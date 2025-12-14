import { doubleCsrf } from 'csrf-csrf';
import { randomBytes } from 'crypto';
import { Request } from 'express';

const csrfSecret = process.env.CSRF_SECRET;

// Require CSRF secret in production
if (process.env.NODE_ENV === 'production' && !csrfSecret) {
    throw new Error('CSRF_SECRET environment variable must be set in production');
}

const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
    // Handle undefined req parameter
    getSecret: (req?: Request) => {
        if (req?.session) {
            // If using sessions, store secret in session
            if (!req.session.csrfSecret) {
                req.session.csrfSecret = randomBytes(32).toString('hex');
            }
            return req.session.csrfSecret;
        }

        // Fallback: Use environment variable or generate random
        return csrfSecret || randomBytes(32).toString('hex');
    },

    // Handle undefined req parameter
    getSessionIdentifier: (req?: Request) => {
        if (!req) {
            return 'default-session-id';
        }

        // Return session ID if using sessions
        if (req.session && req.session.id) {
            return req.session.id as string;
        }

        // Fallback options if not using sessions
        const ip = req.ip || req.socket?.remoteAddress || 'unknown-ip';
        const userAgent = req.get('user-agent') || 'unknown-agent';
        return `${ip}-${userAgent}`;
    },

    cookieName: 'X-Csrf-Token',
    cookieOptions: {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    },
    size: 64,
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
});

export { generateCsrfToken, doubleCsrfProtection };
