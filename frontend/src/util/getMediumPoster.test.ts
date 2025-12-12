import { getMediumPoster } from './getMediumPoster';
import { describe, it, expect } from 'vitest';

describe('getMediumPoster', () => {
    const imgPlaceholder = '/placeholder-movie.png';

    it('returns placeholder if url is null', () => {
        expect(getMediumPoster(null)).toBe(imgPlaceholder);
    });

    it('returns placeholder if url is undefined', () => {
        expect(getMediumPoster(undefined)).toBe(imgPlaceholder);
    });

    it('returns placeholder if url is empty string', () => {
        expect(getMediumPoster('')).toBe(imgPlaceholder);
    });

    it('constructs full URL from TMDB path', () => {
        const path = '/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg';
        expect(getMediumPoster(path)).toBe('https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg');
    });

    it('replaces "original" with "w500" in TMDB URLs', () => {
        const url = 'https://image.tmdb.org/t/p/original/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg';
        expect(getMediumPoster(url)).toBe('https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg');
    });

    it('returns non-TMDB URLs as-is', () => {
        const url = 'https://example.com/media/original/image.jpg';
        expect(getMediumPoster(url)).toBe(url); // Returns as-is
    });

    it('handles paths without leading slash', () => {
        const path = 'kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg';
        expect(getMediumPoster(path)).toBe('https://image.tmdb.org/t/p/w500kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg');
    });
});
