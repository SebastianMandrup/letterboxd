import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import { doubleCsrfProtection, generateCsrfToken } from './csrfProtection';

// Mock the csrf-csrf module
jest.mock('csrf-csrf', () => {
    const mockGenerateCsrfToken = jest.fn((req, res) => {
        res.cookie('x-csrf-token', 'mock-csrf-cookie', {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            path: '/',
        });
        return 'mock-csrf-token';
    });

    const mockDoubleCsrfProtection = jest.fn((req, res, next) => {
        // For GET, HEAD, OPTIONS, allow through
        if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
            return next();
        }

        // For other methods, check for CSRF token
        const token = req.headers['x-csrf-token'];
        if (token === 'mock-csrf-token') {
            return next();
        }

        return res.status(403).json({ error: 'Invalid CSRF token' });
    });

    return {
        doubleCsrf: jest.fn(() => ({
            generateCsrfToken: mockGenerateCsrfToken,
            doubleCsrfProtection: mockDoubleCsrfProtection,
        })),
    };
});

describe('CSRF Protection Middleware', () => {
    let app: express.Application;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use(cookieParser());

        // Add CSRF protection
        app.use(doubleCsrfProtection);

        // Test routes
        app.get('/csrf-token', (req, res) => {
            const token = generateCsrfToken(req, res);
            res.json({ token });
        });

        app.post('/protected', (req, res) => {
            res.json({ message: 'Success' });
        });

        app.get('/public', (req, res) => {
            res.json({ message: 'Public endpoint' });
        });
    });

    describe('GET /csrf-token', () => {
        it('should return a CSRF token', async () => {
            const res = await request(app).get('/csrf-token');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.token).toBe('mock-csrf-token');

            // Check that cookie was set
            const cookies = res.headers['set-cookie'];
            expect(cookies).toBeDefined();
        });
    });

    describe('POST /protected', () => {
        it('should allow request with valid CSRF token', async () => {
            const res = await request(app).post('/protected').set('x-csrf-token', 'mock-csrf-token').send({ data: 'test' });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Success');
        });

        it('should reject request without CSRF token', async () => {
            const res = await request(app).post('/protected').send({ data: 'test' });

            expect(res.status).toBe(403);
            expect(res.body).toHaveProperty('error');
        });

        it('should reject request with invalid CSRF token', async () => {
            const res = await request(app).post('/protected').set('x-csrf-token', 'invalid-token').send({ data: 'test' });

            expect(res.status).toBe(403);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('GET /public', () => {
        it('should allow GET request without CSRF token', async () => {
            const res = await request(app).get('/public');

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Public endpoint');
        });
    });
});
