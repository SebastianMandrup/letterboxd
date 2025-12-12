import { getMovieBackdrop } from './getMovieBackdrop';
import { describe, it, expect } from 'vitest';

describe('getMovieBackdrop', () => {
    const placeholder = '/placeholder-backdrop.png';

    it('returns placeholder for null/undefined/empty', () => {
        expect(getMovieBackdrop(null)).toBe(placeholder);
        expect(getMovieBackdrop(undefined)).toBe(placeholder);
        expect(getMovieBackdrop('')).toBe(placeholder);
    });

    it('constructs full URL from backdrop path', () => {
        const path = '/hZkgoQYus5vegHoetLkCJzb17zJ.jpg';
        expect(getMovieBackdrop(path)).toBe('https://image.tmdb.org/t/p/w1280/hZkgoQYus5vegHoetLkCJzb17zJ.jpg');
    });

    it('replaces original size with w1280 in TMDB URLs', () => {
        const originalUrl = 'https://image.tmdb.org/t/p/original/hZkgoQYus5vegHoetLkCJzb17zJ.jpg';
        expect(getMovieBackdrop(originalUrl)).toBe('https://image.tmdb.org/t/p/w1280/hZkgoQYus5vegHoetLkCJzb17zJ.jpg');
    });
});
