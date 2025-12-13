/* tslint:disable:no-implicit-any */
import dotenv from 'dotenv';
import { describe, it, expect } from 'vitest';
import fetch from 'node-fetch';
import fetchCookie from 'fetch-cookie';

dotenv.config();
const VITE_API_URL = process.env.VITE_API_URL;
const fetchWithCookies = fetchCookie(fetch);

describe('Auth API Integration', () => {
    // Store CSRF token between tests
    let csrfToken: string | null = null;

    // Helper to get CSRF token
    async function getCsrfToken(): Promise<string> {
        const res = await fetchWithCookies(`${VITE_API_URL}/auth/csrf-token`, {
            method: 'GET',
        });
        const data: any = await res.json();
        return data.csrfToken;
    }

    it('registers a user successfully', async () => {
        const res = await fetchWithCookies(`${VITE_API_URL}/users`, {
            method: 'POST',
            body: JSON.stringify({ username: 'testing', password: 'password', email: 'test@example.com' }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data: any = await res.json();
        expect(res.status).toBe(201);
        expect(data.message).toBe('User created successfully');
    });

    it('logs in a user successfully', async () => {
        const res = await fetchWithCookies(`${VITE_API_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ username: 'testing', password: 'password' }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data: any = await res.json();
        expect(res.status).toBe(200);
        expect(data.message).toBe('Logged in successfully');
    });

    it('gets CSRF token for logout', async () => {
        // Get CSRF token after login (important: cookies are preserved)
        csrfToken = await getCsrfToken();
        expect(csrfToken).toBeDefined();
        expect(typeof csrfToken).toBe('string');
        expect(csrfToken.length).toBeGreaterThan(0);
    });

    it('logs the user out successfully with CSRF protection', async () => {
        // Ensure we have a CSRF token
        if (!csrfToken) {
            csrfToken = await getCsrfToken();
        }

        const res = await fetchWithCookies(`${VITE_API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken!,
            },
        });
        const data: any = await res.json();
        expect(res.status).toBe(200);
        expect(data.message).toBe('Logged out successfully');
    });
});
