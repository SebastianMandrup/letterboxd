import { Router, NextFunction } from 'express';
import { AppDataSource } from '../startup/data-source';
import { User } from '../entities/User';
import type Response from '../DTO/Response';
import { validateUserCreation } from '../middleware/userValidation';
import bcrypt from 'bcrypt';
import { getUserByUsername, getUsers } from '../services/userService';
import { toUserWithCountDto, UserWithCountDto } from '../DTO/UserWithCountDto';
import { authenticateUser } from '../middleware/authenticateUser';

const userRouter = Router();

const userRepository = AppDataSource.getRepository(User);

userRouter.get('/', async (req, res) => {
    try {
        const userId = req.session.user?.id;

        const { users, total } = await getUsers(req, userId);

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

        const currentUserId = req.session.user?.id;

        const user = await getUserByUsername(username, currentUserId);

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

userRouter.post('/:userId/follow', authenticateUser, async (req, res) => {
    try {
        const userToFollowId = parseInt(req.params.userId, 10);
        const userToFollow = await userRepository.findOneBy({ id: userToFollowId });

        if (!userToFollow) {
            return res.status(404).send({ error: 'User to follow not found' });
        }

        const currentUser = await userRepository.findOne({
            where: { id: req.user!.id },
            relations: ['following'],
        });

        if (!currentUser) {
            return res.status(404).send({ error: 'Current user not found' });
        }

        const isFollowing = currentUser.following.some((user) => user.id === userToFollowId);

        if (isFollowing) {
            currentUser.following = currentUser.following.filter((user) => user.id !== userToFollowId);
        } else {
            currentUser.following.push(userToFollow);
        }

        await userRepository.save(currentUser);

        res.send({ message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully' });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

export default userRouter;
