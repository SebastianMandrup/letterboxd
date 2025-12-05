import { afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test
afterEach(() => {
    cleanup();
});

// Force cleanup of any remaining timers/handlers
afterAll(() => {
    cleanup();
});
