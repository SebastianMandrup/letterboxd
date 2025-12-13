import bcrypt from 'bcrypt';
import { Router } from 'express';
import 'express-session';
import { AppDataSource } from '../startup/data-source';
import { User } from '../entities/User';
import { ApiError } from '../interfaces/ApiError';

const authRouter = Router();

const userRepository = AppDataSource.getRepository(User);

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
