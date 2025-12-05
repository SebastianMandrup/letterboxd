import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // Enable polling for file changes
      interval: 100,   // Check for changes every 100 milliseconds
    },
    port: 3000,
    host: "0.0.0.0",
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    exclude: ['tests/integration/**/*.ts', 'node_modules/**'],
    watch: false,
    isolate: false,
    passWithNoTests: false,
    testTimeout: 30000,
    hookTimeout: 10000,
  }
})
