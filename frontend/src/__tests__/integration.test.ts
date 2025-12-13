import dotenv from 'dotenv';
dotenv.config();

import { describe, it, expect } from 'vitest';
import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

// cookie-aware axios client (REQUIRED for CSRF + sessions in Node)
const jar = new CookieJar();

const client = wrapper(
    axios.create({
        baseURL: 'http://nginx-proxy/api',
        withCredentials: true,
        jar,
        timeout: 5000,
    }),
);

describe('Auth API Integration with CSRF', () => {
    it('full auth flow with double CSRF', async () => {
        // 1. get CSRF token (sets XSRF-TOKEN cookie)
        const csrfRes = await client.get('/auth/csrf-token');
        const csrfToken = csrfRes.data.token;

        expect(typeof csrfToken).toBe('string');

        // 2. register user
        await client.post(
            '/users',
            {
                username: 'testing',
                password: 'password123!',
                email: 'test@example.com',
            },
            {
                headers: {
                    'X-XSRF-TOKEN': csrfToken,
                },
            },
        );

        // 3. login
        await client.post(
            '/auth/login',
            {
                username: 'testing',
                password: 'password123!',
            },
            {
                headers: {
                    'X-XSRF-TOKEN': csrfToken,
                },
            },
        );

        // 4. access protected route
        const me = await client.get('/auth/me');
        expect(me.status).toBe(200);
        expect(me.data.username).toBe('testing');

        // 5. logout
        const logout = await client.post(
            '/auth/logout',
            {},
            {
                headers: {
                    'X-XSRF-TOKEN': csrfToken,
                },
            },
        );

        expect(logout.status).toBe(200);
    });
});
