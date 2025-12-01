import { describe, it, expect } from 'vitest';
import { getApiAvatar } from './getApiAvatar';

describe('getApiAvatar', () => {
  const defaultAvatar =
    'https://ui-avatars.com/api/?name=muo&background=random';

  it('returns placeholder if url is null', () => {
    expect(getApiAvatar(null)).toBe(defaultAvatar);
  });

  it('returns placeholder if url is empty string', () => {
    expect(getApiAvatar('')).toBe(defaultAvatar);
  });

  it('replaces username with pass value', () => {
    const username = 'john doe';
    expect(getApiAvatar(username)).toBe(
      'https://ui-avatars.com/api/?name=john%20doe&background=random',
    );
  });
});
