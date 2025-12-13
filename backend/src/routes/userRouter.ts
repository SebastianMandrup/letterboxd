import { Router, NextFunction } from 'express';
import { AppDataSource } from '../startup/data-source';
import { User } from '../entities/User';
import type Response from '../interfaces/Response';
import { validateUserCreation } from '../middleware/userValidation';
import bcrypt from 'bcrypt';
import { getUserByUsername, getUsers } from '../services/userService';
import { toUserWithCountDto, UserWithCountDto } from '../interfaces/UserWithCountDto';
import { authenticateUser } from '../middleware/authenticateUser';
import validateUsername from '../middleware/validation/validateUsername';
import { ApiError } from '../interfaces/ApiError';

const userRouter = Router();

const userRepository = AppDataSource.getRepository(User);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
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

/**
 * @swagger
 * /users/{username}:
 *   get:
 *     summary: Get user by username
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */
userRouter.get('/:username', async (req, res, next) => {
    try {
        const username = validateUsername(req.params.username);

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

/**
 * @swagger
 * /users/{username}/followers:
 *   get:
 *     summary: Get user's followers
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of followers
 *       404:
 *         description: User not found
 */
userRouter.get('/:username/followers', async (req, res, next) => {
    try {
        const username = validateUsername(req.params.username);

        const userWithFollowers = await userRepository
            .createQueryBuilder('user')
            .leftJoin('user.followers', 'followers')
            .addSelect(['followers.id', 'followers.username'])
            .where('user.username = :username', { username })
            .getOne();

        if (!userWithFollowers) {
            throw new ApiError('User not found', 404);
        }

        res.send(userWithFollowers.followers || []);
    } catch (error) {
        console.error('Error fetching followers:', error);
        next(error);
    }
});

/**
 * @swagger
 * /users/{username}/following:
 *   get:
 *     summary: Get users this user is following
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of followed users
 *       404:
 *         description: User not found
 */
userRouter.get('/:username/following', async (req, res, next) => {
    try {
        const username = validateUsername(req.params.username);

        const userWithFollowing = await userRepository
            .createQueryBuilder('user')
            .leftJoin('user.following', 'following')
            .addSelect(['following.id', 'following.username'])
            .where('user.username = :username', { username })
            .getOne();

        if (!userWithFollowing) {
            throw new ApiError('User not found', 404);
        }

        res.send(userWithFollowing.following || []);
    } catch (error) {
        console.error('Error fetching following:', error);
        next(error);
    }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user (register)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 */
userRouter.post('/', validateUserCreation, async (req, res, next: NextFunction) => {
    try {
        const { username, password, email } = req.body;

        const existingUser = await userRepository.findOne({
            where: [{ username }, { email }],
        });

        if (existingUser) {
            if (existingUser.username === username) {
                throw new ApiError('Username already taken', 409);
            }
            if (existingUser.email === email) {
                throw new ApiError('Email already registered', 409);
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = userRepository.create({
            username,
            password: hashedPassword,
            email,
            role: 'user',
        });

        await userRepository.save(newUser);

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error('Error creating new user:', error);
        next(error);
    }
});

/**
 * @swagger
 * /users/{userId}/follow:
 *   post:
 *     summary: Toggle follow/unfollow a user
 *     tags: [Users]
 *     security:
 *       - session: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Follow toggled
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
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
