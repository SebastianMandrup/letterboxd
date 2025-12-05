import { describe, it, expect } from 'vitest';
import { getSlug } from './getSlug';

describe('getSlug', () => {
    it('should convert string to lowercase', () => {
        expect(getSlug('Test Movie')).toBe('test-movie');
    });

    it('should replace spaces with hyphens', () => {
        expect(getSlug('The Great Movie')).toBe('the-great-movie');
    });

    it('should remove special characters', () => {
        expect(getSlug('Movie: The Special Edition!')).toBe('movie-the-special-edition');
    });

    it('should handle multiple consecutive spaces', () => {
        expect(getSlug('Movie   With   Spaces')).toBe('movie-with-spaces');
    });

    it('should handle multiple consecutive hyphens', () => {
        expect(getSlug('Movie---With---Hyphens')).toBe('movie-with-hyphens');
    });

    it('should handle strings with numbers', () => {
        expect(getSlug('Movie 123')).toBe('movie-123');
    });

    it('should handle empty string', () => {
        expect(getSlug('')).toBe('');
    });

    it('should handle string with only special characters', () => {
        expect(getSlug('!@#$%^&*()')).toBe('');
    });

    it('should preserve existing hyphens', () => {
        expect(getSlug('Spider-Man')).toBe('spider-man');
    });

    it('should handle mixed case with special characters', () => {
        expect(getSlug('The Matrix: Reloaded (2003)')).toBe('the-matrix-reloaded-2003');
    });
});
