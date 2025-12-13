import { describe, it, expect } from '@jest/globals';
import { doubleCsrfProtection, generateToken } from './csrf';

describe('CSRF Protection', () => {
    it('should export CSRF protection middleware', () => {
        expect(doubleCsrfProtection).toBeDefined();
        expect(typeof doubleCsrfProtection).toBe('function');
    });

    it('should export generateToken function', () => {
        expect(generateToken).toBeDefined();
        expect(typeof generateToken).toBe('function');
    });

    it('should have proper middleware signature', () => {
        // CSRF protection middleware should accept 3 parameters (req, res, next)
        expect(doubleCsrfProtection.length).toBe(3);
    });

    it('should have proper generateToken signature', () => {
        // generateToken should accept at least 2 parameters (req, res)
        expect(generateToken.length).toBeGreaterThanOrEqual(2);
    });
});
