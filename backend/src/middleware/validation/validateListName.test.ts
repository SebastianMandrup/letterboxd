// src/middleware/validation/validateListName.test.ts
import validateListName from './validateListName';

describe('validateListName', () => {
    describe('valid inputs', () => {
        it('should return sanitized list name', () => {
            const result = validateListName(' My List ');
            expect(result).toBe('my list');
        });

        it('should handle mixed case input', () => {
            const result = validateListName('My LIST Name');
            expect(result).toBe('my list name');
        });

        it('should handle exactly 254 characters', () => {
            const longName = 'a'.repeat(254);
            const result = validateListName(longName);
            expect(result).toBe(longName.toLowerCase());
        });

        it('should handle minimal valid input', () => {
            const result = validateListName('a');
            expect(result).toBe('a');
        });

        it('should handle single space trimmed', () => {
            const result = validateListName(' a ');
            expect(result).toBe('a');
        });

        it('should handle special characters', () => {
            const result = validateListName('  My@List#123  ');
            expect(result).toBe('my@list#123');
        });

        it('should handle unicode characters', () => {
            const result = validateListName('  Café List  ');
            expect(result).toBe('café list');
        });

        it('should handle numbers in list name', () => {
            const result = validateListName('  List 123  ');
            expect(result).toBe('list 123');
        });
    });

    describe('invalid string inputs', () => {
        it('should throw error for empty string', () => {
            expect(() => validateListName('')).toThrow('List name is required and must be a string.');
        });

        it('should throw error for whitespace-only string', () => {
            expect(() => validateListName('   ')).toThrow('List name is required and must be a string.');
        });

        it('should throw error for tabs and newlines only', () => {
            expect(() => validateListName('\t\n   ')).toThrow('List name is required and must be a string.');
        });

        it('should throw error for string longer than 254 chars', () => {
            expect(() => validateListName('a'.repeat(255))).toThrow('List name must be less than 254 characters long.');
        });

        it('should throw error for very long string', () => {
            expect(() => validateListName('a'.repeat(1000))).toThrow('List name must be less than 254 characters long.');
        });
    });

    // If you want to test with test.each, here's a TypeScript-safe version:
    describe('using test.each for valid cases', () => {
        const validCases: Array<[string, string]> = [
            ['My List', 'my list'],
            ['  My List  ', 'my list'],
            ['MY LIST', 'my list'],
            ['a', 'a'],
            ['a'.repeat(254), 'a'.repeat(254)],
            ['0', '0'],
            ['false', 'false'],
            ['Café List', 'café list'],
            ['List 123', 'list 123'],
            ['  My@List#123  ', 'my@list#123'],
        ];

        test.each(validCases)('given %p should return %p', (input, expected) => {
            expect(validateListName(input)).toBe(expected);
        });
    });

    describe('using test.each for invalid cases', () => {
        // For invalid cases, use tuples with explicit types
        const invalidCases: Array<[string, string]> = [
            ['', 'List name is required and must be a string.'],
            ['   ', 'List name is required and must be a string.'],
            ['\t\n', 'List name is required and must be a string.'],
            ['a'.repeat(255), 'List name must be less than 254 characters long.'],
        ];

        test.each(invalidCases)('given %p should throw %p', (input, errorMessage) => {
            expect(() => validateListName(input)).toThrow(errorMessage);
        });
    });

    // Runtime type error tests (these would be caught by TypeScript at compile time)
    describe('runtime type errors', () => {
        it('should throw when passed null', () => {
            // TypeScript will complain, but we force it with 'as any'
            expect(() => validateListName(null as any)).toThrow();
        });

        it('should throw when passed undefined', () => {
            expect(() => validateListName(undefined as any)).toThrow();
        });

        it('should throw when passed a number', () => {
            expect(() => validateListName(123 as any)).toThrow();
        });

        it('should throw when passed an object', () => {
            expect(() => validateListName({} as any)).toThrow();
        });

        it('should throw when passed an array', () => {
            expect(() => validateListName([] as any)).toThrow();
        });

        it('should throw when passed a boolean', () => {
            expect(() => validateListName(true as any)).toThrow();
        });
    });
});
