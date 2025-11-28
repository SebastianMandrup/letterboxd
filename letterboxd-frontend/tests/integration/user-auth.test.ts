import dotenv from 'dotenv';
import { describe, it, expect } from 'vitest';

dotenv.config();

const VITE_API_URL = process.env.VITE_API_URL;

describe('Auth API Integration', () => {

	it('registers a user successfully', async () => {
		const res = await fetch(`${VITE_API_URL}/users`, {
			method: 'POST',
			body: JSON.stringify({ username: 'test', password: 'test', email: 'test@example.com' }),
			headers: { 'Content-Type': 'application/json' },
		});
		const data = await res.json();

		expect(res.status).toBe(201);
		expect(data.user).toBeDefined();
	});

	it('logs in a user successfully', async () => {
		const res = await fetch(`${VITE_API_URL}/auth/login`, {
			method: 'POST',
			body: JSON.stringify({ username: 'test', password: 'test' }),
			headers: { 'Content-Type': 'application/json' },
		});
		const data = await res.json();

		expect(res.status).toBe(200);
		expect(data.user).toBeDefined();
	});
});