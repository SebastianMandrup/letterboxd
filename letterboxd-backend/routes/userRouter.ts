import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Review } from '../entities/Review';
import { User } from '../entities/User';

interface Response {
    count: number;
    results: User[];
}

interface UserDto {
    id: number;
    name: string;
    reviews: Review[];
}

const userRouter = Router();

const userRepository = AppDataSource.getRepository(User);

//GET all users
userRouter.get("/", async (req, res) => {
    try {
        const users = await userRepository.find();
        const response: Response = {
            count: users.length,
            results: users,
        };
        res.send(response);
    } catch (error) {
        console.error("Error fetching genres:", error);
        res.status(500).send({ error: "Internal server error" });
    }
});

userRouter.post("/", async (req, res) => {
    try {
        const newUser = userRepository.create(req.body);
        const savedUser = await userRepository.save(newUser);
        res.status(201).send(savedUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send({ error: "Internal server error" });
    }
});

userRouter.post("/", async (req, res) => {
    try {
        const newUser = userRepository.create(req.body);
        const savedUser = await userRepository.save(newUser);
        res.status(201).send(savedUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send({ error: "Internal server error" });
    }
});

export default userRouter;
