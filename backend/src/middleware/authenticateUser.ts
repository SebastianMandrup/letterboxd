import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../startup/data-source';
import { User } from '../entities/User';
import { ApiError } from '../interfaces/ApiError';

export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.session.user?.id;

        if (!userId) {
            throw new ApiError('Unauthorized', 401);
        }

        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOneBy({ id: userId });

        if (!user) {
            req.session.destroy(() => {});
            throw new ApiError('Unauthorized', 401);
        }

        req.user = user;

        next();
    } catch (error) {
        next(error);
    }
}
