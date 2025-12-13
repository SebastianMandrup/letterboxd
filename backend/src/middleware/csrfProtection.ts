import { doubleCsrf } from 'csrf-csrf';

const csrfSecret = process.env.CSRF_SECRET;

// Require CSRF secret in production
if (process.env.NODE_ENV === 'production' && !csrfSecret) {
    throw new Error('CSRF_SECRET environment variable must be set in production');
}

const {
    generateCsrfToken,
    doubleCsrfProtection,
} = doubleCsrf({
    getSecret: () => csrfSecret || 'csrf-secret-key-for-development',
    cookieName: 'x-csrf-token',
    cookieOptions: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    },
    size: 64,
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
    getSessionIdentifier: (req) => {
        // Use session ID if available, otherwise use a fallback
        return (req.session?.id as string) || '';
    },
});

export { generateCsrfToken, doubleCsrfProtection };
