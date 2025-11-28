import { Request, Response, NextFunction } from "express";
import validateUsername from "./validation/validateUsername";
import validatePassword from "./validation/validatePassword";
import validateEmail from "./validation/validateEmail";

export const validateUserCreation = (req: Request, res: Response, next: NextFunction) => {
	let { username, password, email } = req.body;

	username = validateUsername(username);
	password = validatePassword(password);
	email = validateEmail(email);

	req.body.username = username;
	req.body.email = email;
	req.body.password = password;
	next();
};