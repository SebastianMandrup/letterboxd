import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from './useUserStore';
import type UserDto from '../DTO/UserDto';

describe('useUserStore', () => {
    beforeEach(() => {
        // Reset store before each test
        useUserStore.setState({ user: null });
    });

    it('initializes with null user', () => {
        const { user } = useUserStore.getState();
        expect(user).toBeNull();
    });

    it('sets user correctly', () => {
        const mockUser: UserDto = {
            id: 1,
            username: 'testuser',
            role: 'user',
        };

        useUserStore.getState().setUser(mockUser);

        const { user } = useUserStore.getState();
        expect(user).toEqual(mockUser);
    });

    it('clears user correctly', () => {
        const mockUser: UserDto = {
            id: 1,
            username: 'testuser',
            role: 'user',
        };

        useUserStore.getState().setUser(mockUser);
        expect(useUserStore.getState().user).toEqual(mockUser);

        useUserStore.getState().clearUser();
        expect(useUserStore.getState().user).toBeNull();
    });

    it('isAuthenticated returns false when user is null', () => {
        const { isAuthenticated } = useUserStore.getState();
        expect(isAuthenticated()).toBe(false);
    });

    it('isAuthenticated returns true when user is set', () => {
        const mockUser: UserDto = {
            id: 1,
            username: 'testuser',
            role: 'user',
        };

        useUserStore.getState().setUser(mockUser);

        const { isAuthenticated } = useUserStore.getState();
        expect(isAuthenticated()).toBe(true);
    });

    it('allows setting user to null explicitly', () => {
        const mockUser: UserDto = {
            id: 1,
            username: 'testuser',
            role: 'user',
        };

        useUserStore.getState().setUser(mockUser);
        useUserStore.getState().setUser(null);

        expect(useUserStore.getState().user).toBeNull();
    });
});
