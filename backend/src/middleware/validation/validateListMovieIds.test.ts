import validateListMovieIds from './validateListMovieIds';

describe('validateListMovieIds', () => {
    describe('valid inputs', () => {
        it('should return the same array', () => {
            const ids = [1, 2, 3, 4, 5];
            expect(validateListMovieIds(ids)).toBe(ids); // Same reference
            expect(validateListMovieIds(ids)).toEqual([1, 2, 3, 4, 5]);
        });

        it('should handle empty array', () => {
            expect(() => validateListMovieIds([])).toThrow('List movie IDs must contain at least 5 items.');
        });

        it('should handle exactly 40 items', () => {
            const ids = Array.from({ length: 40 }, (_, i) => i + 1);
            expect(validateListMovieIds(ids)).toEqual(ids);
        });
    });

    describe('invalid inputs', () => {
        it('should throw for null', () => {
            expect(() => validateListMovieIds(null as any)).toThrow('List movie IDs are required and must be an array.');
        });

        it('should throw for undefined', () => {
            expect(() => validateListMovieIds(undefined as any)).toThrow('List movie IDs are required and must be an array.');
        });

        it('should throw for non-array types', () => {
            expect(() => validateListMovieIds('not array' as any)).toThrow('List movie IDs are required and must be an array.');
            expect(() => validateListMovieIds({} as any)).toThrow('List movie IDs are required and must be an array.');
            expect(() => validateListMovieIds(123 as any)).toThrow('List movie IDs are required and must be an array.');
        });

        it('should throw for arrays with more than 40 items', () => {
            const ids = Array.from({ length: 41 }, (_, i) => i + 1);
            expect(() => validateListMovieIds(ids)).toThrow('List movie IDs must contain 40 or fewer items.');
        });

        it('should throw for 41 items', () => {
            const ids = Array.from({ length: 41 }, (_, i) => i + 1);
            expect(() => validateListMovieIds(ids)).toThrow('List movie IDs must contain 40 or fewer items.');
        });
    });
});
