export default (password: string): string => {
	if (!password || typeof password !== "string") {
		throw new Error("Password is required and must be a string.");
	}

	if (password.length < 8) {
		throw new Error("Password must be at least 8 characters long.");
	}

	if (password.length > 128) {
		throw new Error("Password must be less than 128 characters long.");
	}
	return password;
}