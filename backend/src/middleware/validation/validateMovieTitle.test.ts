import validateMovieTitle from './validateMovieTitle';

describe('validateMovieTitle', () => {
  it('trims whitespace', () => {
    expect(validateMovieTitle('  inception  ')).toBe('Inception');
  });

  it('capitalizes words split by hyphens', () => {
    expect(validateMovieTitle('the-dark-knight')).toBe('The Dark Knight');
  });

  it('capitalizes a single-word title', () => {
    expect(validateMovieTitle('interstellar')).toBe('Interstellar');
  });

  it('throws if title is empty', () => {
    expect(() => validateMovieTitle('')).toThrow(
      'Movie title is required and must be a string.',
    );
  });

  it('throws if title is not a string', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => validateMovieTitle(null as any)).toThrow(
      'Movie title is required and must be a string.',
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => validateMovieTitle(undefined as any)).toThrow(
      'Movie title is required and must be a string.',
    );
  });

  it('preserves spaces between hyphenated words after formatting', () => {
    expect(validateMovieTitle('lord-of-the-rings')).toBe('Lord Of The Rings');
  });

  it('handles mixed casing', () => {
    expect(validateMovieTitle('ThE-goDfAThEr')).toBe('The Godfather');
  });
});
