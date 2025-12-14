# Production Deployment Guide

## Environment Configuration

### Required Environment Variables for Production

When deploying to production, ensure the following environment variables are set:

```bash
NODE_ENV=production
SESSION_SECRET=<strong-random-secret>
CSRF_SECRET=<strong-random-secret>
CORS_ORIGIN=<your-frontend-url>
DB_URL=<your-database-url>
```

### Security Settings

#### Session and CSRF Protection

The application uses both session-based authentication and CSRF protection. In production mode (`NODE_ENV=production`), the following security settings are automatically applied:

1. **Secure Cookies**: All cookies (session and CSRF) are set with the `secure` flag, meaning they will only be sent over HTTPS.

2. **SameSite Cookie Attribute**: In production, cookies use `sameSite: 'strict'` to prevent CSRF attacks by ensuring cookies are only sent in first-party contexts.

3. **Trust Proxy**: The application is configured to trust the first proxy (`trust proxy: 1`), which is necessary when deployed behind reverse proxies like nginx, load balancers, or hosting platforms (Render, Heroku, etc.). This allows Express to:
   - Correctly identify the client's IP address from `X-Forwarded-For` headers
   - Recognize when requests are made over HTTPS via `X-Forwarded-Proto` headers
   - Properly set secure cookies even when the connection between the proxy and Express is HTTP

#### Why These Settings Matter

The changes fix the following production issues:

- **Invalid CSRF Token Errors**: Previously, the session cookie had `secure: false` while the CSRF cookie had `secure: true` in production. This mismatch caused sessions not to be established properly over HTTPS, leading to CSRF token validation failures.

- **Proxy Configuration**: Without `trust proxy`, Express doesn't recognize that requests are coming through HTTPS when behind a reverse proxy, causing secure cookies to not be set properly.

- **Cookie Consistency**: Both session and CSRF cookies now use identical security settings in production, ensuring they work together correctly.

### Reverse Proxy Configuration

If you're using nginx or another reverse proxy, ensure it's configured to forward the necessary headers:

```nginx
location /api/ {
    proxy_pass http://backend:5000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### Testing Production Configuration Locally

To test production-like settings locally:

1. Set `NODE_ENV=production` in your `.env` file
2. Use an HTTPS reverse proxy (like nginx with self-signed certificates) or a service like ngrok
3. Ensure `CORS_ORIGIN` matches your frontend URL exactly
4. Generate strong random secrets for `SESSION_SECRET` and `CSRF_SECRET`

### Common Issues and Solutions

#### Issue: "Invalid CSRF token" errors in production
**Solution**: Ensure:
- `NODE_ENV=production` is set
- `CSRF_SECRET` environment variable is configured
- Your application is accessed via HTTPS
- CORS is configured correctly with `credentials: true`
- Frontend includes `withCredentials: true` in API requests

#### Issue: Session not persisting across requests
**Solution**: Check that:
- Cookies are being set (check browser DevTools > Application > Cookies)
- `secure` flag on cookies matches your protocol (HTTPS in production)
- `CORS_ORIGIN` matches your frontend domain exactly
- Frontend is sending cookies with requests (`withCredentials: true`)

#### Issue: CORS errors with credentials
**Solution**: Verify:
- `CORS_ORIGIN` is set to your exact frontend URL (not a wildcard)
- Both frontend and backend are on the same protocol (both HTTPS)
- Frontend API client includes `withCredentials: true` or `credentials: 'include'`

## Deployment Checklist

Before deploying to production:

- [ ] Set `NODE_ENV=production`
- [ ] Configure strong, unique secrets for `SESSION_SECRET` and `CSRF_SECRET`
- [ ] Set `CORS_ORIGIN` to your frontend URL
- [ ] Ensure database URL (`DB_URL`) is configured
- [ ] Verify reverse proxy (if any) forwards required headers
- [ ] Test CSRF protection works with production settings
- [ ] Ensure HTTPS is configured on your hosting platform
- [ ] Test authentication flow end-to-end
- [ ] Monitor logs for any cookie or CSRF-related errors

## Security Best Practices

1. **Never commit secrets**: Use environment variables, never hardcode secrets
2. **Use strong random secrets**: Generate secrets using `openssl rand -hex 32` or similar
3. **Keep dependencies updated**: Regularly update packages to patch security vulnerabilities
4. **Enable HTTPS**: Always use HTTPS in production (required for secure cookies)
5. **Monitor logs**: Set up logging and monitoring (consider Sentry integration)
6. **Regular backups**: Ensure your database has regular automated backups
