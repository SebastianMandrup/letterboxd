import bcrypt from "bcrypt";
import { Router } from "express";
import "express-session";
import { AppDataSource } from "../data-source";
import { User } from '../entities/User';

import "express-session";

declare module "express-session" {
    interface SessionData {
        user?: {
            id: number;
            name: string;
        };
    }
}

const authRouter = Router();

const userRepository = AppDataSource.getRepository(User);

authRouter.post("/login", async (req, res) => {
    try {
        const { name, password } = req.body;

        const user = await userRepository.findOne({
            where: { name }
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        req.session.user = { id: user.id, name: user.name };

        return res.json({ message: "Logged in successfully", user: req.session.user });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

authRouter.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Could not log out. Please try again." });
        }
        res.clearCookie("connect.sid");
        return res.json({ message: "Logged out successfully" });
    });
});

export default authRouter;
