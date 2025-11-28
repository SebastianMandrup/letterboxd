import dotenv from 'dotenv';
import { describe, it, expect } from 'vitest';
import fetch from 'node-fetch';
import fetchCookie from 'fetch-cookie';

dotenv.config();

const VITE_API_URL = process.env.VITE_API_URL;

const fetchWithCookies = fetchCookie(fetch);

describe('Auth API Integration', () => {

	it('registers a user successfully', async () => {
		const res = await fetchWithCookies(`${VITE_API_URL}/users`, {
			method: 'POST',
			body: JSON.stringify({ username: 'testing', password: 'password', email: 'test@example.com' }),
			headers: { 'Content-Type': 'application/json' },
		});
		const data: any = await res.json();

		expect(res.status).toBe(201);
		expect(data.message).toBe('User created successfully');
	});

	it('logs in a user successfully', async () => {


		const res = await fetchWithCookies(`${VITE_API_URL}/auth/login`, {
			method: 'POST',
			body: JSON.stringify({ username: 'testing', password: 'password' }),
			headers: { 'Content-Type': 'application/json' },
		});
		const data: any = await res.json();

		console.log('Set-Cookie:', res.headers.raw()['set-cookie']); // DEBUG


		console.log(data);

		expect(res.status).toBe(200);
		expect(data.message).toBe('Logged in successfully');

	});

	it('logs the user out successfully', async () => {

		const res = await fetchWithCookies(`${VITE_API_URL}/auth/logout`, {
			method: 'POST',
		});

		const data: any = await res.json();

		console.log(data);

		expect(res.status).toBe(200);
		expect(data.message).toBe('Logged out successfully');
	});
});