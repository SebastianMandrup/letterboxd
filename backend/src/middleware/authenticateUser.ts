import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../startup/data-source';
import { User } from '../entities/User';

export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.session.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOneBy({ id: userId });

        if (!user) {
            req.session.destroy(() => {});
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user;

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ message: 'Authentication failed' });
    }
}
