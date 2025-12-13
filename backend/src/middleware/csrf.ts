import { doubleCsrf } from 'csrf-csrf';
import { Request } from 'express';

const { invalidCsrfTokenError, generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production',
    cookieName: 'x-csrf-token',
    cookieOptions: {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    },
    size: 64,
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
    getSessionIdentifier: (req: Request) => {
        // Use session ID if available, otherwise generate a simple identifier
        return (req.session && req.session.id) || 'anonymous';
    },
    getCsrfTokenFromRequest: (req: Request) => {
        return req.headers['x-csrf-token'] as string;
    },
});

export { doubleCsrfProtection, generateCsrfToken as generateToken, invalidCsrfTokenError };
