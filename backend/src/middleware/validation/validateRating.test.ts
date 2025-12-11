import validateRating from './validateRating';
import { ApiError } from '../errorHandler';

describe('validateRating', () => {
    it('returns the rating when valid', () => {
        expect(validateRating(0)).toBe(0);
        expect(validateRating(2.5)).toBe(2.5);
        expect(validateRating(5)).toBe(5);
    });

    it('throws ApiError if rating is not a number', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(() => validateRating(null as any)).toThrow(ApiError);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(() => validateRating(undefined as any)).toThrow(ApiError);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(() => validateRating('5' as any)).toThrow(ApiError);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(() => validateRating(NaN as any)).toThrow('Rating must be a number');
    });

    it('throws ApiError if rating is not in increments of 0.5', () => {
        expect(() => validateRating(1.3)).toThrow(ApiError);
        expect(() => validateRating(2.7)).toThrow('Rating must be in increments of 0.5');
        expect(() => validateRating(4.1)).toThrow(ApiError);
    });

    it('throws ApiError if rating is below 0', () => {
        expect(() => validateRating(-0.5)).toThrow(ApiError);
        expect(() => validateRating(-1)).toThrow('Rating must be between 0 and 5');
    });

    it('throws ApiError if rating is above 5', () => {
        expect(() => validateRating(5.5)).toThrow(ApiError);
        expect(() => validateRating(6)).toThrow('Rating must be between 0 and 5');
    });

    it('accepts valid ratings at boundaries', () => {
        expect(validateRating(0)).toBe(0);
        expect(validateRating(0.5)).toBe(0.5);
        expect(validateRating(1)).toBe(1);
        expect(validateRating(1.5)).toBe(1.5);
        expect(validateRating(2)).toBe(2);
        expect(validateRating(2.5)).toBe(2.5);
        expect(validateRating(3)).toBe(3);
        expect(validateRating(3.5)).toBe(3.5);
        expect(validateRating(4)).toBe(4);
        expect(validateRating(4.5)).toBe(4.5);
        expect(validateRating(5)).toBe(5);
    });
});
