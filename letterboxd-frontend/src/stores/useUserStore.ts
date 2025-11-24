import { create } from "zustand";
import type UserDto from "../models/userDto";

interface UserState {
	user: UserDto | null;
	setUser: (user: UserDto | null) => void;
	clearUser: () => void;
	isAuthenticated: () => boolean;
}

export const useUserStore = create<UserState>((set, get) => ({
	user: null,
	setUser: (user) => set({ user }),
	clearUser: () => set({ user: null }),
	isAuthenticated: () => !!get().user,
}));