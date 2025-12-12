import { getThumbnailPoster } from './getThumbnailPoster';
import { describe, it, expect } from 'vitest';

describe('getThumbnailPoster', () => {
    const imgPlaceholder = '/placeholder-movie.png';

    it('returns placeholder for null/undefined/empty', () => {
        expect(getThumbnailPoster(null)).toBe(imgPlaceholder);
        expect(getThumbnailPoster(undefined)).toBe(imgPlaceholder);
        expect(getThumbnailPoster('')).toBe(imgPlaceholder);
    });

    it('replaces original with w185 for TMDB URLs', () => {
        const originalUrl = 'https://image.tmdb.org/t/p/original/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg';
        expect(getThumbnailPoster(originalUrl)).toBe('https://image.tmdb.org/t/p/w185/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg');
    });

    it('replaces other sizes with w185 for TMDB URLs', () => {
        const mediumUrl = 'https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg';
        expect(getThumbnailPoster(mediumUrl)).toBe('https://image.tmdb.org/t/p/w185/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg');

        const largeUrl = 'https://image.tmdb.org/t/p/w780/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg';
        expect(getThumbnailPoster(largeUrl)).toBe('https://image.tmdb.org/t/p/w185/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg');
    });

    it('constructs full URL from TMDB path', () => {
        const path = '/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg';
        expect(getThumbnailPoster(path)).toBe('https://image.tmdb.org/t/p/w185/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg');
    });

    it('handles paths without leading slash', () => {
        const path = 'kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg';
        expect(getThumbnailPoster(path)).toBe('https://image.tmdb.org/t/p/w185/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg');
    });
});
