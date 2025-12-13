import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from './useUserStore';
import type UserDto from '../DTO/UserDto';

describe('useUserStore', () => {
    beforeEach(() => {
        // Reset store state before each test
        useUserStore.setState({ user: null });
    });

    it('should initialize with null user', () => {
        const state = useUserStore.getState();
        expect(state.user).toBeNull();
    });

    it('should set user correctly', () => {
        const mockUser: UserDto = {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            role: 'user',
        };

        useUserStore.getState().setUser(mockUser);
        const state = useUserStore.getState();

        expect(state.user).toEqual(mockUser);
        expect(state.user?.username).toBe('testuser');
    });

    it('should clear user correctly', () => {
        const mockUser: UserDto = {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            role: 'user',
        };

        useUserStore.getState().setUser(mockUser);
        expect(useUserStore.getState().user).toEqual(mockUser);

        useUserStore.getState().clearUser();
        expect(useUserStore.getState().user).toBeNull();
    });

    it('should return false for isAuthenticated when user is null', () => {
        const state = useUserStore.getState();
        expect(state.isAuthenticated()).toBe(false);
    });

    it('should return true for isAuthenticated when user exists', () => {
        const mockUser: UserDto = {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            role: 'user',
        };

        useUserStore.getState().setUser(mockUser);
        const state = useUserStore.getState();

        expect(state.isAuthenticated()).toBe(true);
    });

    it('should handle setting user to null', () => {
        const mockUser: UserDto = {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            role: 'user',
        };

        useUserStore.getState().setUser(mockUser);
        expect(useUserStore.getState().user).toEqual(mockUser);

        useUserStore.getState().setUser(null);
        expect(useUserStore.getState().user).toBeNull();
    });

    it('should persist user state across multiple accesses', () => {
        const mockUser: UserDto = {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            role: 'user',
        };

        useUserStore.getState().setUser(mockUser);

        // Access multiple times
        expect(useUserStore.getState().user).toEqual(mockUser);
        expect(useUserStore.getState().user).toEqual(mockUser);
        expect(useUserStore.getState().user?.username).toBe('testuser');
    });
});
