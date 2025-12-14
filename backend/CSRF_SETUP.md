# CSRF Protection Setup

## Overview

This application uses the `csrf-csrf` package which implements the **Double Submit Cookie Pattern** for CSRF protection.

## How It Works

### Double Submit Cookie Pattern

1. **Initial Request**: Client requests a CSRF token from `/auth/csrf-token`
   - Server generates a random token (e.g., `abc123.xyz456`)
   - Server stores a secret in the session
   - Server sets a cookie named `X-Csrf-Token` with the token value
   - Server returns the same token in the response body

2. **Subsequent State-Changing Requests** (POST/PUT/DELETE/PATCH):
   - Client includes the token in the `x-csrf-token` header
   - Browser automatically sends the `X-Csrf-Token` cookie
   - Server validates that cookie value === header value
   - If they match, request is allowed; otherwise, returns 403 error

### Configuration

#### Backend Configuration

**CSRF Cookie Settings** (`backend/src/middleware/csrfProtection.ts`):
- `cookieName`: `X-Csrf-Token`
- `sameSite`: `lax` (allows cross-origin requests from same site)
- `secure`: `true` in production (HTTPS only), `false` in development
- `httpOnly`: `true` (prevents JavaScript access)
- `path`: `/` (cookie sent with all requests)

**Session Cookie Settings** (`backend/src/startup/sessionConfig.ts`):
- `sameSite`: `lax` (matches CSRF cookie)
- `secure`: `true` in production, `false` in development
- `httpOnly`: `true`
- `maxAge`: 24 hours

**Important**: Both CSRF and session cookies MUST have matching `sameSite` settings to work correctly in cross-origin scenarios.

#### Frontend Configuration

**API Clients** include CSRF token interceptor:
- Automatically fetches CSRF token on app initialization
- Adds `x-csrf-token` header to all POST/PUT/DELETE/PATCH requests
- Uses `withCredentials: true` to send cookies

### Development Setup

In development:
- Frontend runs on `http://localhost:3000`
- Backend runs on `http://localhost:5050`
- Both are on `localhost` (same site, different ports)
- CORS allows credentials from `http://localhost:3000`
- Cookies work across ports on same domain

**Key Settings for Development**:
- `saveUninitialized: true` ensures sessions are created when CSRF secrets are stored
- `sameSite: 'lax'` allows cookies between same-site origins
- `secure: false` allows cookies over HTTP

### Production Setup

In production:
- Frontend: `https://frontend-h88t.onrender.com`
- Backend: `https://backend-e62k.onrender.com`
- Different domains (cross-origin)
- `sameSite: 'lax'` allows cookies for same-site navigation and safe cross-site requests
- `secure: true` enforces HTTPS
- `trust proxy: 1` required for proper HTTPS detection behind reverse proxy

**Why `sameSite: 'lax'` instead of `'strict'`**:
- `'strict'`: Cookies not sent on ANY cross-site request (including cross-domain)
- `'lax'`: Cookies sent on safe cross-site requests (GET) and same-site requests (all methods)
- Since frontend and backend are on different domains, `'strict'` would block all cookies
- `'lax'` provides CSRF protection while allowing cross-domain functionality

### Environment Variables

Required in production:
- `CSRF_SECRET`: Secret key for CSRF token generation
- `SESSION_SECRET`: Secret key for session management
- `REDIS_URL`: Redis connection URL for session storage
- `CORS_ORIGIN`: Allowed origin for CORS requests

### Troubleshooting

#### CSRF Token Errors in Development

**Symptom**: Getting `invalid csrf token` error on POST requests

**Possible Causes**:
1. **Session not persisting**: Check that `saveUninitialized` is set to `true` or that session is being modified
2. **Cookie not being sent**: Verify browser is sending `X-Csrf-Token` cookie with requests
3. **Token mismatch**: Ensure the token in the header matches the cookie value
4. **CORS issue**: Verify `withCredentials: true` is set in frontend axios config
5. **Wrong token endpoint**: Ensure frontend is calling `/auth/csrf-token` before making POST requests

**Debug Steps**:
1. Check browser DevTools Network tab:
   - Verify `/auth/csrf-token` sets the `X-Csrf-Token` cookie
   - Verify subsequent requests send the cookie in request headers
   - Verify `x-csrf-token` header is included in POST requests
2. Check backend logs for session creation and CSRF validation
3. Verify environment variables are set correctly

#### CSRF Token Errors in Production

**Symptom**: Getting `invalid csrf token` error on POST requests in production

**Possible Causes**:
1. **Cookie not being sent**: With `sameSite: 'strict'`, cookies blocked in cross-origin scenario
2. **Session store issues**: Redis not connected, sessions not persisting
3. **HTTPS issues**: `secure: true` requires HTTPS to be properly detected (need `trust proxy: 1`)
4. **CORS misconfiguration**: Origin not allowed or credentials not enabled

**Solution**:
- Use `sameSite: 'lax'` for both CSRF and session cookies (as implemented)
- Ensure Redis is connected for session persistence
- Set `trust proxy: 1` in Express app
- Verify CORS allows credentials from frontend origin

### Testing

To test CSRF protection manually:

1. Start backend: `cd backend && npm run dev`
2. Get CSRF token:
   ```bash
   curl -c cookies.txt http://localhost:5050/auth/csrf-token
   ```
3. Make a POST request with token:
   ```bash
   curl -b cookies.txt -H "x-csrf-token: <token_from_step_2>" \
     -H "Content-Type: application/json" \
     -d '{"username":"test","password":"test"}' \
     http://localhost:5050/auth/login
   ```

### Security Considerations

- CSRF protection is essential for state-changing operations
- The double-submit cookie pattern is secure when combined with SameSite cookies
- Always use HTTPS in production with `secure: true`
- Use `httpOnly: true` to prevent XSS attacks from stealing tokens
- Session secrets should be cryptographically strong random strings
- Redis or another persistent store is required in production (MemoryStore will cause issues with multiple servers or restarts)
