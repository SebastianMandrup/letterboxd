# CSRF Protection Implementation

This document describes the CSRF (Cross-Site Request Forgery) protection implementation in this application.

## Overview

CSRF protection has been implemented using the `csrf-csrf` package on the backend and integrated with axios on the frontend to automatically include CSRF tokens in state-changing requests.

## Backend Implementation

### Middleware Setup

The CSRF protection middleware is configured in `/backend/src/middleware/csrfProtection.ts`:

- Uses double-submit cookie pattern via `csrf-csrf` package
- Automatically protects POST, PUT, DELETE, PATCH requests
- GET, HEAD, and OPTIONS requests are exempt from CSRF protection
- Uses session ID for additional security

### Configuration

Key configuration options:
- **Cookie Name**: `x-csrf-token`
- **Cookie Options**: HttpOnly, SameSite=lax, Secure (in production)
- **Secret**: Configured via `CSRF_SECRET` environment variable
- **Token Size**: 64 bytes

### CSRF Token Endpoint

A dedicated endpoint is available to fetch CSRF tokens:

```
GET /auth/csrf-token
```

Response:
```json
{
  "token": "csrf-token-value"
}
```

### Application of CSRF Protection

CSRF protection is applied globally to all routes in `/backend/src/startup/init.ts` after session middleware and before route handlers.

## Frontend Implementation

### CSRF Token Management

The frontend manages CSRF tokens via utility functions in `/frontend/src/util/csrf.ts`:

- `fetchCsrfToken()`: Fetches a new CSRF token from the backend
- `getCsrfToken()`: Returns the currently stored CSRF token
- `clearCsrfToken()`: Clears the stored CSRF token (used on logout)

### Axios Integration

All axios instances automatically include CSRF tokens in state-changing requests:

1. **ApiClient**: Base client class with request interceptor that adds CSRF token to POST, PUT, DELETE, PATCH requests
2. **AuthClient**: Specialized client that fetches CSRF token after login and clears it after logout

### Token Lifecycle

1. **App Initialization**: CSRF token is fetched when the app loads (`main.tsx`)
2. **Login**: New CSRF token is fetched after successful login
3. **Requests**: CSRF token is automatically included in request headers
4. **Token Refresh**: If no token is available, it's automatically fetched before making a request
5. **Logout**: CSRF token is cleared from memory

## Testing

### Backend Tests

CSRF protection is tested in `/backend/src/middleware/csrfProtection.test.ts`:

- Verifies CSRF token generation
- Tests protection of state-changing endpoints
- Confirms GET requests are not blocked
- Validates rejection of requests without valid tokens

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Security Considerations

1. **Double-Submit Cookie Pattern**: The implementation uses both a cookie and a header token, providing protection against CSRF attacks
2. **Session Binding**: Tokens are bound to the user's session for additional security
3. **Secure Cookies**: In production, CSRF cookies are set with the `Secure` flag
4. **HttpOnly**: CSRF cookies cannot be accessed via JavaScript
5. **SameSite**: Cookies use `SameSite=lax` to prevent cross-site request attacks

## Environment Variables

Add the following to your `.env` file:

```bash
# CSRF Secret (change in production)
CSRF_SECRET=your-csrf-secret-key-here
```

⚠️ **Important**: Always use a strong, random secret in production!

## Troubleshooting

### 403 Forbidden Errors

If you receive 403 errors on POST/PUT/DELETE requests:

1. Ensure the CSRF token is being fetched on app initialization
2. Check that the `x-csrf-token` header is included in the request
3. Verify that cookies are being sent with `withCredentials: true`
4. Check that the session is active and valid

### Token Not Available

If the CSRF token is not available:

1. The token is automatically fetched when needed
2. Ensure the backend `/auth/csrf-token` endpoint is accessible
3. Check CORS configuration to allow credentials

## Compatibility

- Backend: Express 5.x with express-session
- Frontend: Axios for HTTP requests
- Compatible with session-based authentication
