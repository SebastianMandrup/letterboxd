import validatePassword from './validatePassword';

describe('validatePassword', () => {
  it('returns the password when valid', () => {
    expect(validatePassword('abc123')).toBe('abc123');
  });

  it('throws if password is empty', () => {
    expect(() => validatePassword('')).toThrow(
      'Password is required and must be a string.',
    );
  });

  it('throws if password is not a string', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => validatePassword(null as any)).toThrow(
      'Password is required and must be a string.',
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => validatePassword(undefined as any)).toThrow(
      'Password is required and must be a string.',
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => validatePassword(123 as any)).toThrow(
      'Password is required and must be a string.',
    );
  });

  it('throws if password is shorter than 3 characters', () => {
    expect(() => validatePassword('ab')).toThrow(
      'Password must be at least 3 characters long.',
    );
  });

  it('throws if password is longer than 128 characters', () => {
    const longPassword = 'a'.repeat(129);
    expect(() => validatePassword(longPassword)).toThrow(
      'Password must be less than 128 characters long.',
    );
  });

  it('accepts a password exactly at length limits', () => {
    expect(validatePassword('abc')).toBe('abc');
    expect(validatePassword('a'.repeat(128))).toBe('a'.repeat(128));
  });
});
