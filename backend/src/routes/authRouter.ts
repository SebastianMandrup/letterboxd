import bcrypt from 'bcrypt';
import { Router } from 'express';
import 'express-session';
import { AppDataSource } from '../startup/data-source';
import { User } from '../entities/User';
import { ApiError } from '../interfaces/ApiError';
import { generateToken } from '../middleware/csrfProtection';

const authRouter = Router();

const userRepository = AppDataSource.getRepository(User);

/**
 * @swagger
 * /auth/csrf-token:
 *   get:
 *     summary: Get CSRF token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: CSRF token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 */
authRouter.get('/csrf-token', (req, res) => {
    const token = generateToken(req, res);
    res.json({ token });
});

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Auth]
 *     security:
 *       - session: []
 *     responses:
 *       200:
 *         description: Current user information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 username:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
authRouter.get('/me', (req, res, next) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({
                success: false,
                data: null,
                error: {
                    message: 'Not authenticated',
                    code: 401,
                },
            });
        }
        return res.json(req.session.user);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     username:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
authRouter.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const user = await userRepository.findOne({
            where: { username },
        });

        if (!user) {
            throw new ApiError('Invalid credentials', 401);
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new ApiError('Invalid credentials', 401);
        }

        req.session.user = {
            id: user.id,
            username: user.username,
            role: user.role,
        };

        return res.json({
            message: 'Logged in successfully',
            user: req.session.user,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - session: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
authRouter.post('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            return next(new ApiError('Could not log out. Please try again.', 500));
        }
        res.status(200);
        res.clearCookie('connect.sid');
        return res.json({ message: 'Logged out successfully' });
    });
});

export default authRouter;
