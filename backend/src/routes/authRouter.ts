import bcrypt from 'bcrypt';
import { Router } from 'express';
import 'express-session';
import { AppDataSource } from '../startup/data-source';
import { User } from '../entities/User';
import { ApiError } from '../middleware/errorHandler';

const authRouter = Router();

const userRepository = AppDataSource.getRepository(User);

authRouter.get('/me', (req, res) => {
    if (!req.session.user) {
        throw new ApiError('Not authenticated', 401);
    }
    return res.json(req.session.user);
});

authRouter.post('/login', async (req, res) => {
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
});

authRouter.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            throw new ApiError('Could not log out. Please try again.', 500);
        }
        res.status(200);
        res.clearCookie('connect.sid');
        return res.json({ message: 'Logged out successfully' });
    });
});

export default authRouter;
