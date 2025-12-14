# CSRF Protection in Production

## Problem

When deploying to production with Redis and `saveUninitialized: false` in the session configuration, CSRF protection fails with "invalid csrf token" errors on all mutation requests (POST, PUT, PATCH, DELETE).

## Root Causes

### 1. Session Not Persisting (Original Issue)

The CSRF secret is stored in the session when the CSRF token is first generated (via `/auth/csrf-token` endpoint). However, with `saveUninitialized: false`, Express sessions are not saved to Redis if they only contain data added during the request (like the CSRF secret) and have no "user" data from authentication.

### 2. Cross-Origin Cookie Issue (Primary Issue in Render.com Deployment)

**This is the main issue for cross-origin deployments like Render.com where frontend and backend are on different domains:**

With `sameSite: 'lax'` (the previous setting), cookies are not sent on cross-origin requests. When the frontend (`https://frontend-h88t.onrender.com`) makes requests to the backend (`https://backend-e62k.onrender.com`), the session cookie is blocked by the browser, causing:
1. Client requests `/auth/csrf-token` → New session created with CSRF secret
2. Session cookie sent to client but browser rejects it (cross-origin + sameSite: 'lax')
3. Client sends POST request with CSRF token
4. Server creates a NEW session (no cookie received) with a different CSRF secret
5. CSRF validation fails because secrets don't match

## Solutions

### Fix 1: Save Session After CSRF Token Generation

Explicitly call `req.session.save()` in the `/auth/csrf-token` endpoint after generating the CSRF token. This ensures the session with the CSRF secret is persisted to Redis, regardless of the `saveUninitialized` setting.

```typescript
authRouter.get('/csrf-token', (req, res) => {
    const token = generateCsrfToken(req, res);
    
    // Explicitly save the session to ensure CSRF secret persists
    // This is crucial when saveUninitialized: false is set in production
    if (req.session) {
        req.session.save((err) => {
            if (err) {
                console.error('Failed to save session:', err);
            }
            res.json({ token });
        });
    } else {
        res.json({ token });
    }
});
```

### Fix 2: Set sameSite: 'none' for Cross-Origin Production Deployments ⭐ **CRITICAL**

For deployments where frontend and backend are on different domains (like Render.com, Heroku, etc.), cookies must use `sameSite: 'none'` to work across origins. This requires `secure: true` (HTTPS only).

**Session Cookie Configuration** (`sessionConfig.ts`):
```typescript
const cookieOptions: CookieOptions = {
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-origin in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
};
```

**CSRF Cookie Configuration** (`csrfProtection.ts`):
```typescript
cookieOptions: {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
}
```

### Why sameSite: 'none' for Production?

The `sameSite` cookie attribute controls when cookies are sent:
- `'strict'`: Only sent for same-site requests (never cross-origin)
- `'lax'`: Sent for same-site requests and top-level navigation (but not cross-origin fetch/XHR)
- `'none'`: Sent for all requests (cross-origin included), **requires secure: true**

When your frontend (`frontend-h88t.onrender.com`) makes API calls to your backend (`backend-e62k.onrender.com`), these are **cross-origin requests**. With `sameSite: 'lax'`, the browser blocks the cookies, breaking sessions and CSRF protection.

## Why `saveUninitialized: false`?

The `saveUninitialized: false` setting is recommended for production because:
- Reduces storage usage (doesn't save empty sessions)
- Better compliance with laws requiring permission before setting cookies
- Prevents race conditions with multiple requests creating sessions

## Environment Variables

Ensure these are set in production:
- `CSRF_SECRET`: Secret key for CSRF token generation
- `SESSION_SECRET`: Secret key for session encryption
- `REDIS_URL`: Redis connection URL for session storage
- `NODE_ENV=production`: Enables production mode

## Testing

Run the integration tests to verify CSRF protection works:
```bash
npm test -- auth.integration.test.ts
```

## References

- CSRF Protection: `backend/src/middleware/csrfProtection.ts`
- Session Config: `backend/src/startup/sessionConfig.ts`
- Auth Router: `backend/src/routes/authRouter.ts`
