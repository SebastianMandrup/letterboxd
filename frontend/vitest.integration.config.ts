import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['tests/integration/**/*.ts'], // only integration tests
		reporters: 'verbose',
		environment: 'node',
	},
});