import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';
import { useUserStore } from '../stores/useUserStore';

// Note: This test focuses on testing the hook's integration with the store
// API integration tests are in the integration test suite

describe('useAuth', () => {
    beforeEach(() => {
        // Reset store before each test
        useUserStore.setState({ user: null });
    });

    it('initializes with no user and not authenticated', () => {
        const { result } = renderHook(() => useAuth());

        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('reflects user from store', () => {
        const mockUser = {
            id: 1,
            username: 'testuser',
            role: 'user' as const,
        };

        // Set user in store
        act(() => {
            useUserStore.getState().setUser(mockUser);
        });

        const { result } = renderHook(() => useAuth());

        expect(result.current.user).toEqual(mockUser);
        expect(result.current.isAuthenticated).toBe(true);
    });

    it('setUser updates the store', () => {
        const { result } = renderHook(() => useAuth());

        const mockUser = {
            id: 1,
            username: 'newuser',
            role: 'user' as const,
        };

        act(() => {
            result.current.setUser(mockUser);
        });

        expect(result.current.user).toEqual(mockUser);
        expect(useUserStore.getState().user).toEqual(mockUser);
    });

    it('handles null user', () => {
        const mockUser = {
            id: 1,
            username: 'testuser',
            role: 'user' as const,
        };

        useUserStore.getState().setUser(mockUser);

        const { result } = renderHook(() => useAuth());

        act(() => {
            result.current.setUser(null);
        });

        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
    });
});
