import { getMediumPoster } from './getMediumPoster';
import { describe, it, expect } from 'vitest';

describe('getMediumPoster', () => {
  const imgPlaceholder = '/placeholder-movie.png';

  it('returns placeholder if url is null', () => {
    expect(getMediumPoster(null)).toBe(imgPlaceholder);
  });

  it('returns placeholder if url is empty string', () => {
    expect(getMediumPoster('')).toBe(imgPlaceholder);
  });

  it("replaces 'original' with 'w500' in the url", () => {
    const url = 'https://example.com/media/original/image.jpg';
    expect(getMediumPoster(url)).toBe(
      'https://example.com/media/w500/image.jpg',
    );
  });
});
