import { useEffect } from "react";
import { useUserStore } from "../stores/useUserStore";
import AuthClient from "../services/AuthClient";

export function useRestoreUser() {

	const authClient = new AuthClient();

	const setUser = useUserStore((state) => state.setUser);

	useEffect(() => {
		authClient.me()
			.then((user) => {
				if (user) setUser(user); // populate Zustand
			})
			.catch(() => {
				setUser(null); // no session
			});
	}, [setUser]);
}
