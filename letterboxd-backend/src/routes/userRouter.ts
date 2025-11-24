import { Router } from "express";
import { AppDataSource } from "../data-source";
import { User } from '../entities/User';
import { toUserDto, UserDto } from "../DTO/UserDto";
import type Response from "../DTO/Response";
import { validateUserCreation } from "../middleware/userValidation";
import bcrypt from "bcrypt";

const userRouter = Router();

const userRepository = AppDataSource.getRepository(User);

userRouter.get("/", async (req, res) => {
    try {
        const users = await userRepository.find();
        const userDtos = users.map(user => (
            toUserDto(user)
        ));

        const response: Response<UserDto> = {
            count: users.length,
            results: userDtos,
        };
        res.send(response);
    } catch (error) {
        console.error("Error fetching genres:", error);
        res.status(500).send({ error: "Internal server error" });
    }
});

userRouter.post("/", validateUserCreation, async (req, res) => {
    try {

        const { username, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = userRepository.create({
            username,
            password: hashedPassword,
            email,
            role: "user"
        });

        await userRepository.save(newUser);
        res.status(201).send({ message: "User created successfully" });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send({ error: "Internal server error" });
    }
});

export default userRouter;
