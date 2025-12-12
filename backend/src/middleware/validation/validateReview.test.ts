import { ApiError } from '../../interfaces/ApiError';
import validateReview from './validateReview';

describe('validateReview', () => {
    it('returns the trimmed review when valid', () => {
        expect(validateReview('This is a great movie that everyone should watch')).toBe('This is a great movie that everyone should watch');
        expect(validateReview('  Valid review with spaces  ')).toBe('Valid review with spaces');
    });

    it('throws Error if review is not a string', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(() => validateReview(null as any)).toThrow('Review content must be a non-empty string');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(() => validateReview(undefined as any)).toThrow('Review content must be a non-empty string');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(() => validateReview(123 as any)).toThrow('Review content must be a non-empty string');
    });

    it('throws Error if review is empty', () => {
        expect(() => validateReview('')).toThrow('Review content must be a non-empty string');
    });

    it('throws ApiError if trimmed review is shorter than 10 characters', () => {
        expect(() => validateReview('short')).toThrow(ApiError);
        expect(() => validateReview('         ')).toThrow('Review content must be at least 10 characters long');
        expect(() => validateReview('   abc   ')).toThrow(ApiError);
    });

    it('throws ApiError if review is longer than 255 characters (error message mentions 5000)', () => {
        const longReview = 'a'.repeat(256);
        expect(() => validateReview(longReview)).toThrow(ApiError);
        expect(() => validateReview(longReview)).toThrow('Review content must not exceed 5000 characters');
    });

    it('accepts review exactly at length limits (min=10, max=255)', () => {
        const minReview = 'a'.repeat(10);
        const maxReview = 'a'.repeat(255);
        expect(validateReview(minReview)).toBe(minReview);
        expect(validateReview(maxReview)).toBe(maxReview);
    });

    it('trims whitespace from review', () => {
        const review = '   This is a valid review with leading and trailing spaces   ';
        expect(validateReview(review)).toBe('This is a valid review with leading and trailing spaces');
    });
});
