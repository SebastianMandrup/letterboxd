import { describe, it, expect } from 'vitest';
import { getSlug } from './getSlug';

describe('getSlug', () => {
    it('converts to lowercase', () => {
        expect(getSlug('HELLO World')).toBe('hello-world');
        expect(getSlug('TEST')).toBe('test');
    });

    it('replaces spaces with hyphens', () => {
        expect(getSlug('hello world')).toBe('hello-world');
        expect(getSlug('hello    world')).toBe('hello-world');
        expect(getSlug('  hello  world  ')).toBe('hello-world');
    });

    it('removes special characters', () => {
        expect(getSlug('hello!@#$%^&*()world')).toBe('helloworld');
        expect(getSlug('test & test')).toBe('test-test');
        expect(getSlug('email@example.com')).toBe('emailexamplecom');
    });

    it('handles multiple hyphens', () => {
        expect(getSlug('hello---world')).toBe('hello-world');
        expect(getSlug('hello -- world')).toBe('hello-world');
        expect(getSlug('hello - - - world')).toBe('hello-world');
    });

    it('handles mixed cases and special characters', () => {
        expect(getSlug('Hello World!')).toBe('hello-world');
        expect(getSlug('My Test & Your Test')).toBe('my-test-your-test');
        expect(getSlug('Product Name (2024)')).toBe('product-name-2024');
    });

    it('handles numbers', () => {
        expect(getSlug('Product 123')).toBe('product-123');
        expect(getSlug('123 Test')).toBe('123-test');
        expect(getSlug('test-456')).toBe('test-456');
    });

    it('handles empty string', () => {
        expect(getSlug('')).toBe('');
    });

    it('handles string with only special characters', () => {
        expect(getSlug('!@#$%^&*()')).toBe('');
        expect(getSlug('   ')).toBe('');
    });

    it('handles international characters', () => {
        // Note: Your function removes non-ASCII characters
        expect(getSlug('café')).toBe('caf');
        expect(getSlug('naïve')).toBe('nave');
        expect(getSlug('Schön')).toBe('schn');
    });

    it('handles real-world examples', () => {
        expect(getSlug('My Awesome Product Name')).toBe('my-awesome-product-name');
        expect(getSlug('How to Use React in 2024')).toBe('how-to-use-react-in-2024');
        expect(getSlug('The Best & Worst of 2023')).toBe('the-best-worst-of-2023');
    });
});
