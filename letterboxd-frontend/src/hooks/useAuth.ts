import { useCallback, useState } from "react";
import AuthClient from "../services/AuthClient";
import { useUserStore } from "../stores/useUserStore";

const authClient = new AuthClient();

export function useAuth() {
	const setUser = useUserStore((state) => state.setUser);
	const clearUser = useUserStore((state) => state.clearUser);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const login = useCallback(async (username: string, password: string) => {
		setLoading(true);
		setError(null);

		try {
			// Backend should return { message, user: { id, name, role } }
			const { message, user } = await authClient.login({ username, password });

			setUser(user); // update global Zustand state
			return user;
		} catch (e: any) {
			setError(e?.response?.data?.message ?? "Login failed");
			throw e;
		} finally {
			setLoading(false);
		}
	}, [setUser]);

	const logout = useCallback(async () => {
		try {
			await authClient.logout(); // call backend logout
		} catch (err) {
			console.error("Logout failed", err);
		} finally {
			clearUser(); // clear global state
		}
	}, [clearUser]);

	const register = useCallback(async (email: string, username: string, password: string) => {
		setLoading(true);
		setError(null);
		try {
			const { message, user } = await authClient.register({ email, username, password });
			return user;
		} catch (e: any) {
			setError(e?.response?.data?.message ?? "Sign up failed");
			throw e;
		} finally {
			setLoading(false);
		};
	}, [setUser]);

	const user = useUserStore((state) => state.user);

	return {
		user,
		loading,
		error,
		login,
		logout,
		register,
		isAuthenticated: !!user,
	};
}
