import { useCallback, useEffect, useState, useRef } from 'react';
import AuthClient from '../../clients/AuthClient';
import { useUserStore } from '../../stores/useUserStore';

const authClient = new AuthClient();

export function useAuth() {
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const clearUser = useUserStore((state) => state.clearUser);

    const [loading, setLoading] = useState(false);
    const [restoring, setRestoring] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const hasRestored = useRef(false);

    useEffect(() => {
        if (hasRestored.current) {
            return;
        }

        const restoreUser = async () => {
            hasRestored.current = true;

            try {
                const fetchedUser = await authClient.me();

                setUser(fetchedUser || null);
            } catch (error) {
                console.error('useAuth - Failed to restore session:', error);
                setUser(null);
            } finally {
                setRestoring(false);
            }
        };

        restoreUser();
    }, [setUser]);

    const login = useCallback(
        async (username: string, password: string) => {
            setLoading(true);
            setError(null);

            try {
                const { user } = await authClient.login({
                    username,
                    password,
                });

                setUser(user);
                return user;
            } catch (e: unknown) {
                setError('Login failed');
                throw e;
            } finally {
                setLoading(false);
            }
        },
        [setUser],
    );

    const logout = useCallback(async () => {
        try {
            await authClient.logout();
        } catch (err) {
            console.error('Logout failed', err);
        } finally {
            clearUser();
        }
    }, [clearUser]);

    return {
        user,
        loading,
        restoring,
        error,
        login,
        logout,
        isAuthenticated: !!user,
    };
}
