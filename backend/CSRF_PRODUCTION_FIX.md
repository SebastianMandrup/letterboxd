# CSRF Protection in Production

## Problem

When deploying to production with Redis and `saveUninitialized: false` in the session configuration, CSRF protection fails with "invalid csrf token" errors on all mutation requests (POST, PUT, PATCH, DELETE).

## Root Cause

The CSRF secret is stored in the session when the CSRF token is first generated (via `/auth/csrf-token` endpoint). However, with `saveUninitialized: false`, Express sessions are not saved to Redis if they only contain data added during the request (like the CSRF secret) and have no "user" data from authentication.

This causes:
1. Client requests `/auth/csrf-token` → CSRF secret is generated and stored in session
2. Session is **not** saved to Redis (because `saveUninitialized: false`)
3. Client sends POST request with CSRF token
4. Server loads session from Redis → session doesn't have the CSRF secret
5. CSRF validation fails with "invalid csrf token"

## Solution

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
