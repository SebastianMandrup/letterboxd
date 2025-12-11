import { Router, NextFunction } from 'express';
import { AppDataSource } from '../startup/data-source';
import { User } from '../entities/User';
import type Response from '../DTO/Response';
import { validateUserCreation } from '../middleware/userValidation';
import bcrypt from 'bcrypt';
import { getUserByUsername, getUsers } from '../services/userService';
import { toUserWithCountDto, UserWithCountDto } from '../DTO/UserWithCountDto';
import { authenticateUser } from '../middleware/authenticateUser';
import { ApiError } from '../middleware/errorHandler';

const userRouter = Router();

const userRepository = AppDataSource.getRepository(User);

userRouter.get('/', async (req, res, next) => {
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
        next(error);
    }
});

userRouter.get('/:username', async (req, res, next) => {
    try {
        const username = req.params.username;

        const currentUserId = req.session.user?.id;

        const user = await getUserByUsername(username, currentUserId);

        if (!user) {
            throw new ApiError('User not found', 404);
        }

        res.send(user);
    } catch (error) {
        console.error('Error fetching user by username:', error);
        next(new ApiError('Error fetching user by username', 500));
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
        console.error('Error creating new user:', error);
        next(error);
    }
});

userRouter.post('/:userId/follow', authenticateUser, async (req, res, next) => {
    try {
        const userToFollowId = parseInt(req.params.userId, 10);
        const userToFollow = await userRepository.findOneBy({ id: userToFollowId });

        if (!userToFollow) {
            throw new ApiError('User to follow not found', 404);
        }

        const currentUser = await userRepository.findOne({
            where: { id: req.user!.id },
            relations: ['following'],
        });

        if (!currentUser) {
            throw new ApiError('Current user not found', 404);
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
        next(error);
    }
});

export default userRouter;
