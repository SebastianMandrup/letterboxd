import request from 'supertest';
import express from 'express';
import session from 'express-session';
import { doubleCsrfProtection, generateToken } from './csrf';

const createTestApp = () => {
    const app = express();
    app.use(express.json());
    app.use(
        session({
            secret: 'test-secret',
            resave: false,
            saveUninitialized: false,
        }),
    );

    // CSRF token endpoint
    app.get('/csrf-token', (req, res) => {
        const token = generateToken(req, res);
        res.json({ token });
    });

    // Apply CSRF protection
    app.use(doubleCsrfProtection);

    // Test routes
    app.post('/api/test', (req, res) => {
        res.json({ message: 'Success' });
    });

    app.get('/api/test', (req, res) => {
        res.json({ message: 'GET requests should not require CSRF token' });
    });

    return app;
};

describe('CSRF Protection', () => {
    let app: express.Application;
    let agent: request.Agent;

    beforeEach(() => {
        app = createTestApp();
        agent = request.agent(app);
    });

    it('should allow GET requests without CSRF token', async () => {
        const response = await agent.get('/api/test');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('GET requests should not require CSRF token');
    });

    it('should reject POST requests without CSRF token', async () => {
        const response = await agent.post('/api/test').send({ data: 'test' });
        expect(response.status).toBe(403);
    });

    it('should provide CSRF token via endpoint', async () => {
        const response = await agent.get('/csrf-token');
        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
        expect(typeof response.body.token).toBe('string');
    });

    it('should allow POST requests with valid CSRF token', async () => {
        // Get CSRF token first
        const tokenResponse = await agent.get('/csrf-token');
        const csrfToken = tokenResponse.body.token;

        // Use the token in POST request
        const response = await agent.post('/api/test').set('x-csrf-token', csrfToken).send({ data: 'test' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Success');
    });

    it('should reject POST requests with invalid CSRF token', async () => {
        const response = await agent.post('/api/test').set('x-csrf-token', 'invalid-token').send({ data: 'test' });

        expect(response.status).toBe(403);
    });

    it('should set CSRF cookie when token is generated', async () => {
        const response = await agent.get('/csrf-token');
        expect(response.status).toBe(200);
        const cookies = response.headers['set-cookie'] as unknown as string[];
        expect(cookies).toBeDefined();
        const csrfCookie = Array.isArray(cookies)
            ? cookies.find((cookie) => cookie.startsWith('x-csrf-token='))
            : undefined;
        expect(csrfCookie).toBeDefined();
    });
});
