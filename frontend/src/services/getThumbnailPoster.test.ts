import { describe, it, expect } from 'vitest';
import { getThumbnailPoster } from './getThumbnailPoster';

describe('getThumbnailPoster', () => {
    const imgPlaceholder = '/placeholder-movie.png';

    it('returns placeholder if url is null', () => {
        expect(getThumbnailPoster(null)).toBe(imgPlaceholder);
    });

    it('returns placeholder if url is empty string', () => {
        expect(getThumbnailPoster('')).toBe(imgPlaceholder);
    });

    it("replaces 'original' with 'w185' in the url", () => {
        const url = 'https://example.com/media/original/image.jpg';
        expect(getThumbnailPoster(url)).toBe('https://example.com/media/w185/image.jpg');
    });

    it('handles urls without original keyword', () => {
        const url = 'https://example.com/media/image.jpg';
        expect(getThumbnailPoster(url)).toBe('https://example.com/media/image.jpg');
    });
});
