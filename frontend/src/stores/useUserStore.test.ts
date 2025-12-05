import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from './useUserStore';
import { createMockUser } from '../../tests/mocks/mockData';

describe('useUserStore', () => {
    beforeEach(() => {
        // Reset store before each test
        useUserStore.setState({ user: null });
    });

    it('should initialize with null user', () => {
        const { user } = useUserStore.getState();
        expect(user).toBeNull();
    });

    it('should set user correctly', () => {
        const mockUser = createMockUser();
        useUserStore.getState().setUser(mockUser);

        const { user } = useUserStore.getState();
        expect(user).toEqual(mockUser);
    });

    it('should clear user correctly', () => {
        const mockUser = createMockUser();
        useUserStore.getState().setUser(mockUser);
        useUserStore.getState().clearUser();

        const { user } = useUserStore.getState();
        expect(user).toBeNull();
    });

    it('should return true for isAuthenticated when user is set', () => {
        const mockUser = createMockUser();
        useUserStore.getState().setUser(mockUser);

        const isAuthenticated = useUserStore.getState().isAuthenticated();
        expect(isAuthenticated).toBe(true);
    });

    it('should return false for isAuthenticated when user is null', () => {
        const isAuthenticated = useUserStore.getState().isAuthenticated();
        expect(isAuthenticated).toBe(false);
    });
});
