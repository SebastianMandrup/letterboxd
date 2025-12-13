import dotenv from 'dotenv';
import { describe, it, expect, beforeAll } from 'vitest';
import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

dotenv.config();
const VITE_API_URL = process.env.VITE_API_URL;

describe('Auth API Integration with CSRF', () => {
    let csrfToken: string | null = null;
    const jar = new CookieJar();
    const client = wrapper(
        axios.create({
            baseURL: VITE_API_URL,
            withCredentials: true,
            jar,
        }),
    );

    // Helper to get CSRF token from cookies
    function getCsrfFromCookies(): string | null {
        const cookies = jar.toJSON()!.cookies;
        const xsrfCookie = cookies.find((c: any) => c.key === 'XSRF-TOKEN');
        return xsrfCookie ? xsrfCookie.value! : null;
    }

    beforeAll(async () => {
        // Clean up test user
        try {
            await client.delete('/users/testing');
        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    });

    it('registers a user', async () => {
        const response = await client.post('/users', {
            username: 'testing',
            password: 'password123!',
            email: 'test@example.com',
        });

        expect(response.status).toBe(201);
        expect(response.data.message).toBe('User created successfully');
    });

    it('gets CSRF token', async () => {
        const response = await client.get('/auth/csrf-token');
        csrfToken = response.data.csrfToken || getCsrfFromCookies();

        expect(csrfToken).toBeDefined();
        expect(typeof csrfToken).toBe('string');
    });

    it('logs in with CSRF protection', async () => {
        // Update client to include CSRF token in headers
        client.interceptors.request.use((config) => {
            if (csrfToken && config.method && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
                config.headers['X-CSRF-Token'] = csrfToken;
            }
            return config;
        });

        const response = await client.post('/auth/login', {
            username: 'testing',
            password: 'password123!',
        });

        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Logged in successfully');
    });

    it('accesses protected resource', async () => {
        const response = await client.get('/auth/me');
        expect(response.status).toBe(200);
        expect(response.data.username).toBe('testing');
    });

    it('logs out with CSRF token', async () => {
        const response = await client.post('/auth/logout');
        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Logged out successfully');
    });
});
