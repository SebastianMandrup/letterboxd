import bcrypt from "bcrypt";
import { Router } from "express";
import "express-session";
import { AppDataSource } from "../data-source";
import { User } from '../entities/User';

import { requireAuth } from "../middleware/requireAuth";



const authRouter = Router();

const userRepository = AppDataSource.getRepository(User);

authRouter.get("/me", (req, res) => {
    if (!req.session.user) return res.status(401).json(null);
    return res.json(req.session.user);
});

authRouter.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await userRepository.findOne({
            where: { username }
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        req.session.user = { id: user.id, username: user.username, role: user.role };

        return res.json({ message: "Logged in successfully", user: req.session.user });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

authRouter.post("/logout", requireAuth, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Could not log out. Please try again." });
        }
        res.clearCookie("connect.sid");
        return res.json({ message: "Logged out successfully" });
    });
});

authRouter.post("/register", async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const existingUser = await userRepository.findOne({
            where: [{ username }, { email }]
        });
        if (existingUser) {
            return res.status(400).json({ message: "Username or email already in use" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = userRepository.create({
            username,
            password: hashedPassword,
            email,
            role: "user"
        });
        await userRepository.save(newUser);
        req.session.user = { id: newUser.id, username: newUser.username, role: newUser.role };
        return res.status(201).json({ message: "User registered successfully", user: req.session.user });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default authRouter;
