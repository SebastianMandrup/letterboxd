/* tslint:disable:no-implicit-any */
import dotenv from 'dotenv';
import { describe, it, expect, beforeEach } from 'vitest';
import fetch from 'node-fetch';
import fetchCookie from 'fetch-cookie';

dotenv.config();
const VITE_API_URL = process.env.VITE_API_URL;
const fetchWithCookies = fetchCookie(fetch);

describe('Auth API Integration', () => {
    let csrfToken: any; // Variable to store the CSRF token

    // Step 1: Fetch a CSRF token before running auth tests
    beforeEach(async () => {
        const csrfRes = await fetchWithCookies(`${VITE_API_URL}/csrf-token`, {
            method: 'GET',
        });
        // The token might be in the response body, a custom header, or a cookie.
        // This example assumes it's in a JSON response.
        const csrfData: any = await csrfRes.json();
        csrfToken = csrfData.csrfToken;
        // If the server sets it in a cookie, fetch-cookie should handle it automatically.
    });

    it('registers a user successfully', async () => {
        const res = await fetchWithCookies(`${VITE_API_URL}/users`, {
            method: 'POST',
            body: JSON.stringify({ username: 'testing', password: 'password', email: 'test@example.com' }),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken, // Step 2: Include the token in the header
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
                'X-CSRF-Token': csrfToken, // Include the token in the header
            },
        });
        const data: any = await res.json();
        expect(res.status).toBe(200);
        expect(data.message).toBe('Logged in successfully');
    });

    it('logs the user out successfully', async () => {
        const res = await fetchWithCookies(`${VITE_API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'X-CSRF-Token': csrfToken, // Include the token in the header
            },
        });
        const data: any = await res.json();
        expect(res.status).toBe(200);
        expect(data.message).toBe('Logged out successfully');
    });
});
