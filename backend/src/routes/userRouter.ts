import { Router, NextFunction } from 'express';
import { AppDataSource } from '../startup/data-source';
import { User } from '../entities/User';
import type Response from '../DTO/Response';
import { validateUserCreation } from '../middleware/userValidation';
import bcrypt from 'bcrypt';
import { getUserByUsername, getUsers } from '../services/userService';
import { toUserWithCountDto, UserWithCountDto } from '../DTO/UserWithCountDto';

const userRouter = Router();

const userRepository = AppDataSource.getRepository(User);

userRouter.get('/', async (req, res) => {
    try {
        const { users, total } = await getUsers(req);

        const userDtos: UserWithCountDto[] = users.map((user) => toUserWithCountDto(user));

        const response: Response<UserWithCountDto> = {
            count: total,
            results: userDtos,
        };
        res.send(response);
    } catch (error) {
        console.error('Error fetching genres:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

userRouter.get('/:username', async (req, res) => {
    try {
        const username = req.params.username;
        const user = await getUserByUsername(username);

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        res.send(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

userRouter.post('/', validateUserCreation, async (req, res, next: NextFunction) => {
    try {
        const { username, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = userRepository.create({
            username,
            password: hashedPassword,
            email,
            role: 'user',
        });

        await userRepository.save(newUser);
        res.status(201).send({ message: 'User created successfully' });
    } catch (error) {
        next(error);
    }
});

export default userRouter;
