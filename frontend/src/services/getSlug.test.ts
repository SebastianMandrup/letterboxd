import { describe, it, expect } from 'vitest';
import { getSlug } from './getSlug';

describe('getSlug', () => {
    it('converts string to lowercase', () => {
        expect(getSlug('HELLO WORLD')).toBe('hello-world');
    });

    it('replaces spaces with hyphens', () => {
        expect(getSlug('hello world test')).toBe('hello-world-test');
    });

    it('removes special characters', () => {
        expect(getSlug('hello@world#test!')).toBe('helloworldtest');
    });

    it('handles multiple spaces', () => {
        expect(getSlug('hello   world')).toBe('hello-world');
    });

    it('handles multiple hyphens', () => {
        expect(getSlug('hello---world')).toBe('hello-world');
    });

    it('handles movie titles with numbers', () => {
        expect(getSlug('Die Hard 2')).toBe('die-hard-2');
    });

    it('handles complex movie titles', () => {
        expect(getSlug("Schindler's List")).toBe('schindlers-list');
    });

    it('handles titles with parentheses and years', () => {
        expect(getSlug('The Matrix (1999)')).toBe('the-matrix-1999');
    });

    it('handles empty string', () => {
        expect(getSlug('')).toBe('');
    });

    it('handles string with only special characters', () => {
        expect(getSlug('@#$%^&*()')).toBe('');
    });
});
