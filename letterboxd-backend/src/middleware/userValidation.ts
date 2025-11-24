import { Request, Response, NextFunction } from "express";

export const validateUserCreation = (req: Request, res: Response, next: NextFunction) => {
	let { username, password, email } = req.body;

	// Sanitize inputs
	username = username?.trim();
	email = email?.trim().toLowerCase();

	const errors: string[] = [];

	// Username validation
	if (!username || typeof username !== "string") {
		errors.push("Username is required and must be a string.");
	} else if (username.length < 3) {
		errors.push("Username must be at least 3 characters long.");
	} else if (username.length > 30) {
		errors.push("Username must be less than 30 characters long.");
	};

	// Password validation
	if (!password || typeof password !== "string") {
		errors.push("Password is required and must be a string.");
	} else if (password.length < 8) {
		errors.push("Password must be at least 8 characters long.");
	} else if (password.length > 128) {
		errors.push("Password must be less than 128 characters long.");
	}

	// Email validation
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!email || typeof email !== "string") {
		errors.push("Email is required and must be a string.");
	} else if (!emailRegex.test(email)) {
		errors.push("Invalid email format.");
	} else if (email.length > 254) {
		errors.push("Email must be less than 254 characters long.");
	}

	if (errors.length > 0) {
		return res.status(400).json({ errors });
	}

	// Attach sanitized data to request for later use
	req.body.username = username;
	req.body.email = email;

	next();
};