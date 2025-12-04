import validateUsername from './validateUsername';

describe('validateUsername', () => {
    it('returns the username when valid', () => {
        expect(validateUsername('JohnDoe')).toBe('JohnDoe');
    });

    it('trims whitespace before validation', () => {
        expect(validateUsername('   Alice   ')).toBe('Alice');
    });

    it('throws if username is empty', () => {
        expect(() => validateUsername('')).toThrow('Username is required and must be a string.');
    });

    it('throws if username is not a string', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(() => validateUsername(null as any)).toThrow('Username is required and must be a string.');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(() => validateUsername(undefined as any)).toThrow('Username is required and must be a string.');
    });

    it('throws if username is shorter than 3 characters', () => {
        expect(() => validateUsername('ab')).toThrow('Username must be at least 3 characters long.');
    });

    it('throws if username is longer than 30 characters', () => {
        const longName = 'a'.repeat(31);
        expect(() => validateUsername(longName)).toThrow('Username must be less than 30 characters long.');
    });

    it('accepts usernames exactly at the boundaries', () => {
        expect(validateUsername('abc')).toBe('abc');
        expect(validateUsername('a'.repeat(30))).toBe('a'.repeat(30));
    });
});
