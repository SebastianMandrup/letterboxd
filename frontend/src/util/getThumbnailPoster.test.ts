// getThumbnailPoster.test.ts
import { describe, it, expect } from 'vitest';
import { getThumbnailPoster } from './getThumbnailPoster'; // Adjust import path

describe('getThumbnailPoster', () => {
    it('returns placeholder for null', () => {
        expect(getThumbnailPoster(null)).toBe('/placeholder-movie.png');
    });

    it('returns placeholder for undefined', () => {
        expect(getThumbnailPoster(undefined)).toBe('/placeholder-movie.png');
    });

    it('returns placeholder for empty string', () => {
        expect(getThumbnailPoster('')).toBe('/placeholder-movie.png');
    });

    it('returns placeholder for falsy values', () => {
        expect(getThumbnailPoster('')).toBe('/placeholder-movie.png');
        // @ts-expect-error - testing invalid input
        expect(getThumbnailPoster()).toBe('/placeholder-movie.png');
    });

    it('replaces "original" with "w185" in URL', () => {
        const originalUrl = 'https://image.tmdb.org/t/p/original/abc123.jpg';
        const expected = 'https://image.tmdb.org/t/p/w185/abc123.jpg';
        expect(getThumbnailPoster(originalUrl)).toBe(expected);
    });

    it('handles multiple occurrences of "original"', () => {
        // Only first occurrence should be replaced
        const originalUrl = 'https://image.tmdb.org/t/p/original/original.jpg';
        const expected = 'https://image.tmdb.org/t/p/w185/original.jpg';
        expect(getThumbnailPoster(originalUrl)).toBe(expected);
    });

    it('handles URLs without "original"', () => {
        const url = 'https://image.tmdb.org/t/p/w500/abc123.jpg';
        expect(getThumbnailPoster(url)).toBe(url); // Should remain unchanged

        const anotherUrl = 'https://example.com/image.jpg';
        expect(getThumbnailPoster(anotherUrl)).toBe(anotherUrl);
    });

    it('handles different URL formats', () => {
        // With query parameters
        const urlWithParams = 'https://image.tmdb.org/t/p/original/abc123.jpg?quality=80';
        const expectedWithParams = 'https://image.tmdb.org/t/p/w185/abc123.jpg?quality=80';
        expect(getThumbnailPoster(urlWithParams)).toBe(expectedWithParams);

        // With hash
        const urlWithHash = 'https://image.tmdb.org/t/p/original/abc123.jpg#section';
        const expectedWithHash = 'https://image.tmdb.org/t/p/w185/abc123.jpg#section';
        expect(getThumbnailPoster(urlWithHash)).toBe(expectedWithHash);
    });

    it('handles case sensitivity', () => {
        const uppercaseUrl = 'https://image.tmdb.org/t/p/ORIGINAL/abc123.jpg';
        expect(getThumbnailPoster(uppercaseUrl)).toBe(uppercaseUrl); // Should NOT replace

        const mixedCaseUrl = 'https://image.tmdb.org/t/p/Original/abc123.jpg';
        expect(getThumbnailPoster(mixedCaseUrl)).toBe(mixedCaseUrl); // Should NOT replace
    });

    it('handles edge cases', () => {
        // URL with "original" in different positions
        const url = 'https://original.tmdb.org/t/p/original/abc123.jpg';
        const expected = 'https://original.tmdb.org/t/p/w185/abc123.jpg';
        expect(getThumbnailPoster(url)).toBe(expected);

        // Just the word "original"
        expect(getThumbnailPoster('original')).toBe('original');
    });

    it('handles different image domains', () => {
        const tmdbUrl = 'https://image.tmdb.org/t/p/original/poster.jpg';
        expect(getThumbnailPoster(tmdbUrl)).toBe('https://image.tmdb.org/t/p/w185/poster.jpg');

        const otherDomain = 'https://api.movies.com/images/original/poster.jpg';
        expect(getThumbnailPoster(otherDomain)).toBe('https://api.movies.com/images/original/poster.jpg');
    });
});
