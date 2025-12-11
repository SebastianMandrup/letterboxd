import { NextFunction, Request, Response } from 'express';
import { ApiError } from './errorHandler';

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.session.user || req.session.user.role !== 'admin') {
        throw new ApiError('Admin privileges required', 403);
    }
    next();
}
