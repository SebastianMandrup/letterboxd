# CSRF Production Deployment Checklist

## What Was Fixed

### Issue 1: Session Not Persisting ✅
- **Problem**: `saveUninitialized: false` prevented session with CSRF secret from being saved
- **Fix**: Explicitly call `req.session.save()` in `/auth/csrf-token` endpoint
- **File**: `backend/src/routes/authRouter.ts`

### Issue 2: Cross-Origin Cookie Blocking ✅ **PRIMARY FIX**
- **Problem**: `sameSite: 'lax'` blocked cookies on cross-origin requests (frontend and backend on different domains)
- **Fix**: Changed to `sameSite: 'none'` in production (requires HTTPS)
- **Files**: 
  - `backend/src/startup/sessionConfig.ts`
  - `backend/src/middleware/csrfProtection.ts`

## Deployment Steps

1. **Deploy the updated code** to Render.com (should auto-deploy from main branch)

2. **Verify environment variables** are set:
   ```
   NODE_ENV=production
   SESSION_SECRET=<your-secret>
   CSRF_SECRET=<your-secret>
   REDIS_URL=<your-redis-url>
   CORS_ORIGIN=https://frontend-h88t.onrender.com
   ```

3. **Test the fix** in production:

   a. Open browser DevTools (F12) → Network tab
   
   b. Visit: `https://frontend-h88t.onrender.com`
   
   c. Make a request to get CSRF token:
      ```
      GET https://backend-e62k.onrender.com/auth/csrf-token
      ```
   
   d. Check Response Headers - should see:
      ```
      Set-Cookie: connect.sid=...; SameSite=None; Secure; HttpOnly
      Set-Cookie: X-Csrf-Token=...; SameSite=None; Secure; HttpOnly
      ```
   
   e. Make a mutation request (POST/PUT/DELETE) with the token
   
   f. Should succeed (no "invalid csrf token" error)

## Debugging Production Issues

### Check Browser Console
Look for cookie warnings:
```
Cookie "connect.sid" has been rejected because it is in a cross-site context and its "SameSite" is "Lax" or "Strict".
```

### Check Server Logs
With the new logging, you should see:
```
[CSRF Token] Session ID: abc123... Has secret: true
[CSRF Token] Session saved successfully with ID: abc123...
[CSRF] Using existing secret from session: abc123...
```

### Common Issues

1. **Still seeing "invalid csrf token"?**
   - Verify cookies are being sent with `sameSite=None` (check Network tab)
   - Ensure HTTPS is enabled (required for `sameSite: 'none'`)
   - Check CORS_ORIGIN matches frontend domain exactly

2. **Session not persisting?**
   - Check Redis connection in server logs
   - Verify REDIS_URL is correct
   - Check if Redis is accessible from Render backend

3. **Cookies not being set at all?**
   - Verify `credentials: true` in frontend fetch/axios config
   - Check CORS headers allow credentials
   - Ensure frontend uses `withCredentials: true` for requests

## Frontend Requirements

Ensure frontend API client includes credentials:

```typescript
// Axios
axios.get('/api/csrf-token', { withCredentials: true });

// Fetch
fetch('/api/csrf-token', { credentials: 'include' });
```

## References

- Session Config: `backend/src/startup/sessionConfig.ts`
- CSRF Config: `backend/src/middleware/csrfProtection.ts`
- Auth Router: `backend/src/routes/authRouter.ts`
- Full Documentation: `backend/CSRF_PRODUCTION_FIX.md`

## Success Criteria

✅ Can fetch CSRF token without errors
✅ Can make POST/PUT/PATCH/DELETE requests with token
✅ Session persists across requests
✅ Cookies show `SameSite=None; Secure` in browser DevTools
✅ No "invalid csrf token" errors in production
