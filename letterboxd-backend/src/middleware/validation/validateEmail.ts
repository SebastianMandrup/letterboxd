export default (email: string): string => {
	const sanitizedEmail = email?.trim().toLowerCase();

	if (!sanitizedEmail || typeof sanitizedEmail !== "string") {
		throw new Error("Email is required and must be a string.");
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(sanitizedEmail)) {
		throw new Error("Invalid email format.");
	}

	if (sanitizedEmail.length > 254) {
		throw new Error("Email must be less than 254 characters long.");
	}

	return sanitizedEmail;
}