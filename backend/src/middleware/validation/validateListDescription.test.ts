import validateListDescription from './validateListDescription';

/* eslint-disable @typescript-eslint/no-explicit-any */
describe('validateListDescription', () => {
    describe('valid inputs', () => {
        it('should return trimmed description', () => {
            expect(validateListDescription(' My Description ')).toBe('My Description');
        });

        it('should handle exactly 254 characters', () => {
            const longDesc = 'a'.repeat(254);
            expect(validateListDescription(longDesc)).toBe(longDesc);
        });

        it('should handle minimal input', () => {
            expect(validateListDescription('a')).toBe('a');
        });

        it('should preserve case', () => {
            expect(validateListDescription('My DESCRIPTION')).toBe('My DESCRIPTION');
        });
    });

    describe('invalid inputs', () => {
        it('should throw for empty string', () => {
            expect(() => validateListDescription('')).toThrow('List description is required and must be a string.');
        });

        it('should throw for whitespace-only', () => {
            expect(() => validateListDescription('   ')).toThrow('List description is required and must be a string.');
        });

        it('should throw for longer than 254 chars', () => {
            expect(() => validateListDescription('a'.repeat(255))).toThrow('List description must be less than 254 characters long.');
        });

        it('should throw for null', () => {
            expect(() => validateListDescription(null as any)).toThrow();
        });

        it('should throw for undefined', () => {
            expect(() => validateListDescription(undefined as any)).toThrow();
        });
    });
});
