import validateEmail from './validateEmail';

describe('validateEmail', () => {
  it('trims and lowercases a valid email', () => {
    const result = validateEmail('  TEST@Example.COM  ');
    expect(result).toBe('test@example.com');
  });

  it('throws if email is empty', () => {
    expect(() => validateEmail('')).toThrow(
      'Email is required and must be a string.',
    );
  });

  it('throws if email is not a string', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => validateEmail(null as any)).toThrow(
      'Email is required and must be a string.',
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => validateEmail(undefined as any)).toThrow(
      'Email is required and must be a string.',
    );
  });

  it('throws if email format is invalid', () => {
    const badEmails = [
      'no-at-symbol.com',
      'missing-domain@',
      '@missing-local.com',
      'a b@c.com',
      'test@@example.com',
    ];

    for (const email of badEmails) {
      expect(() => validateEmail(email)).toThrow('Invalid email format.');
    }
  });

  it('throws if email is longer than 254 characters', () => {
    const longEmail = 'a'.repeat(250) + '@aaa.com'; // > 254 characters total
    expect(() => validateEmail(longEmail)).toThrow(
      'Email must be less than 254 characters long.',
    );
  });
});
