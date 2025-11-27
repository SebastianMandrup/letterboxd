import { describe, it, expect } from 'vitest';

describe('Auth API Integration', () => {

	it('registers a user successfully', async () => {
		const res = await fetch('http://nginx-proxy/api/auth/register', {
			method: 'POST',
			body: JSON.stringify({ username: 'test', password: 'test', email: 'test@example.com' }),
			headers: { 'Content-Type': 'application/json' },
		});
		const data = await res.json();

		console.log('Registration Response:', data);

		expect(res.status).toBe(201);
		expect(data.user).toBeDefined();
	});

	it('logs in a user successfully', async () => {
		const res = await fetch('http://nginx-proxy/api/auth/login', {
			method: 'POST',
			body: JSON.stringify({ username: 'test', password: 'test' }),
			headers: { 'Content-Type': 'application/json' },
		});
		const data = await res.json();

		console.log('Login Response:', data);

		expect(res.status).toBe(200);
		expect(data.user).toBeDefined();
	});
});