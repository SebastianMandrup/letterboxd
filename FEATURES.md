# API Documentation, Logging, and Security Features

This document describes the new features added to the Letterboxd Clone application.

## 🔷 API Documentation with Swagger

### Overview
The backend API is now documented using OpenAPI 3.0 (Swagger). The interactive documentation is available at `/api-docs`.

### Access the Documentation
- **Development**: `http://localhost:5050/api-docs`
- **Production**: `https://your-backend-url.com/api-docs`

### Features
- Interactive API documentation with Swagger UI
- Try-out functionality to test endpoints directly from the browser
- JSON schema available at `/api-docs.json`
- Automatic documentation from JSDoc comments in route files

### Configuration
The Swagger configuration is located in `/backend/src/startup/swagger.ts`. It includes:
- API information (title, version, description)
- Server URLs
- Security schemes (session-based authentication)
- Common response schemas

### Adding Documentation to Routes
To document a route, add JSDoc comments above the route handler:

```typescript
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', async (req, res) => {
  // handler code
});
```

## 🔷 Error Tracking with Sentry.io

### Overview
Both the backend and frontend applications are configured to use Sentry for error tracking and performance monitoring.

### Backend Configuration
- Location: `/backend/src/startup/sentry.ts`
- Integrations:
  - HTTP call tracing
  - Express.js middleware tracing
  - Node.js profiling
- Features:
  - Automatic error capture
  - Performance monitoring
  - Request tracing
  - Environment-specific sampling rates

### Frontend Configuration
- Location: `/frontend/src/main.tsx`
- Integrations:
  - Browser tracing
  - Session replay
- Features:
  - Automatic error capture
  - Performance monitoring
  - Session replay (10% of sessions, 100% of error sessions)
  - Source maps support

### Environment Variables
To enable Sentry, set the following environment variables:

**Backend (.env)**:
```bash
SENTRY_DSN=your_backend_sentry_dsn_here
NODE_ENV=production
```

**Frontend (.env)**:
```bash
VITE_SENTRY_DSN=your_frontend_sentry_dsn_here
```

### How It Works
1. Sentry is initialized before any other middleware/components
2. Errors are automatically captured and sent to Sentry
3. Performance metrics are collected based on sampling rates
4. In development: 100% sampling rate
5. In production: 10% sampling rate (configurable)

### Getting a Sentry DSN
1. Create a free account at [sentry.io](https://sentry.io)
2. Create a new project for Node.js (backend) and React (frontend)
3. Copy the DSN from the project settings
4. Add it to your environment variables

### Benefits
- Real-time error notifications
- Detailed error context (stack traces, user info, breadcrumbs)
- Performance insights
- Release tracking
- Source map support for production debugging

## 🔷 CSRF Protection

### Overview
Cross-Site Request Forgery (CSRF) protection is implemented using the `csrf-csrf` package with double-submit cookie pattern.

### How It Works
1. Client requests a CSRF token from `/csrf-token`
2. Server generates a token and sets it in a cookie
3. Client includes the token in the `x-csrf-token` header for non-GET requests
4. Server validates the token before processing the request

### Backend Implementation
- Location: `/backend/src/middleware/csrf.ts`
- Configuration:
  - Cookie name: `x-csrf-token`
  - HTTP-only cookie
  - SameSite: strict
  - Secure in production
  - Ignored methods: GET, HEAD, OPTIONS

### Frontend Implementation
- Location: `/frontend/src/clients/ApiClient.ts`
- Features:
  - Automatic CSRF token fetching
  - Token caching
  - Auto-retry on token expiration
  - Request interceptor for adding tokens

### Usage
The CSRF protection is automatic and transparent:

1. **Getting a token** (automatic):
```typescript
// The ApiClient automatically fetches and caches the token
const client = new MovieClient();
await client.create({ title: "New Movie" }); // Token automatically included
```

2. **Manual token fetch** (if needed):
```typescript
const response = await fetch('http://localhost:5050/csrf-token', {
  credentials: 'include'
});
const { token } = await response.json();
```

3. **Using the token**:
```typescript
await fetch('http://localhost:5050/api/endpoint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-csrf-token': token
  },
  credentials: 'include',
  body: JSON.stringify(data)
});
```

### Environment Variables
```bash
CSRF_SECRET=your_csrf_secret_key
```

### Security Benefits
- Prevents cross-site request forgery attacks
- Protects state-changing operations
- Works with session-based authentication
- Transparent to the end user

## 🔷 Enhanced Test Coverage

### Backend Tests
- Total: 186 tests passing
- Coverage includes:
  - Route handlers
  - Middleware
  - Validation
  - Error handling
  - CSRF protection

### Frontend Tests
- Total: 61 tests passing
- New test suites:
  - **Store Tests**: `useUserStore`, `useToastStore`
  - **Component Tests**: `StarIcon` (example)
  - **API Client Tests**: CSRF integration, error handling
  - **Utility Tests**: Already existed for slug, poster URLs, etc.

### Test Infrastructure
- **Backend**: Jest with TypeScript
- **Frontend**: Vitest with React Testing Library
- **Setup**: `/frontend/src/__tests__/setup.ts`
- **Configuration**: `/frontend/vite.config.ts`

### Running Tests

**Backend**:
```bash
cd backend
npm test                    # Run all tests
npm test -- path/to/test   # Run specific test
```

**Frontend**:
```bash
cd frontend
npm test                        # Run all unit tests
npm test:integration           # Run integration tests
```

### Writing Tests

**Store Test Example**:
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from './useUserStore';

describe('useUserStore', () => {
  beforeEach(() => {
    useUserStore.setState({ user: null });
  });

  it('should set user correctly', () => {
    const mockUser = { id: 1, username: 'test' };
    useUserStore.getState().setUser(mockUser);
    expect(useUserStore.getState().user).toEqual(mockUser);
  });
});
```

**Component Test Example**:
```typescript
import { render, screen } from '@testing-library/react';
import StarIcon from './StarIcon';

describe('StarIcon Component', () => {
  it('should render the icon', () => {
    render(<StarIcon size={24} />);
    const icon = screen.getByRole('img', { name: 'Star' });
    expect(icon).toBeInTheDocument();
  });
});
```

## 🔷 Configuration Summary

### Required Environment Variables

**Backend (.env)**:
```bash
# Required
PORT=5050
DB_URL=mysql://root:password@mysql:3306/letterboxdDatabase
DB_TYPE=mysql
DB_SCHEMA=letterboxd
JWT_SECRET=your_jwt_secret_key
SESSION_SECRET=your_session_secret_key
CORS_ORIGIN=http://localhost:3000
CSRF_SECRET=your_csrf_secret_key

# Optional - Sentry
SENTRY_DSN=your_sentry_dsn_here

# Environment
NODE_ENV=development
```

**Frontend (.env)**:
```bash
# Required
VITE_API_URL=http://localhost:5050
PORT=3000

# Optional - Sentry
VITE_SENTRY_DSN=your_sentry_dsn_here
```

## 🔷 Next Steps

### Recommended Actions
1. **Setup Sentry**: Create accounts and add DSNs to environment variables
2. **Review API Docs**: Check the Swagger UI at `/api-docs`
3. **Add More Route Documentation**: Document remaining API endpoints
4. **Write More Tests**: Increase coverage for critical paths
5. **Monitor Errors**: Review Sentry dashboard regularly

### Additional Documentation Needed
- Document all remaining API endpoints in Swagger
- Add integration tests for CSRF protection
- Add E2E tests for critical user flows
- Document deployment process with new features

## 🔷 Dependencies Added

### Backend
- `swagger-ui-express`: ^5.x - Swagger UI hosting
- `swagger-jsdoc`: ^6.x - OpenAPI spec generation from JSDoc
- `@sentry/node`: ^8.x - Sentry error tracking
- `@sentry/profiling-node`: ^8.x - Performance profiling
- `csrf-csrf`: ^4.x - CSRF protection

### Frontend
- `@sentry/react`: ^8.x - Sentry error tracking for React
- `@testing-library/react`: ^16.x - React component testing
- `@testing-library/jest-dom`: ^6.x - DOM matchers for testing
- `@testing-library/user-event`: ^14.x - User interaction simulation
- `jsdom`: ^25.x - DOM implementation for testing

## 🔷 Resources

- [Swagger/OpenAPI Documentation](https://swagger.io/docs/)
- [Sentry Documentation](https://docs.sentry.io/)
- [CSRF Protection Guide](https://owasp.org/www-community/attacks/csrf)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
