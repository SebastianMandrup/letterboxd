import { Request, Response, NextFunction } from "express";

export const validateUserCreation = (req: Request, res: Response, next: NextFunction) => {
	const { username, password, email } = req.body;
	const errors = [];
	if (!username || typeof username !== "string" || username.length < 3) {
		errors.push("Username must be at least 3 characters long.");
	};
	if (!password || typeof password !== "string" || password.length < 6) {
		errors.push("Password must be at least 6 characters long.");
	};
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!email || typeof email !== "string" || !emailRegex.test(email)) {
		errors.push("Invalid email format.");
	}
	if (errors.length > 0) {
		return res.status(400).json({ errors });
	}
	next();
};