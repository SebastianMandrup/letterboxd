import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../interfaces/ApiError';

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return next(new ApiError('Admin privileges required', 403));
    }
    next();
}
