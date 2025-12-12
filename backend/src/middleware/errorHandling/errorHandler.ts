import { Request, Response, NextFunction } from 'express';
import { normalizeError } from './normalizeError';

export const errorHandler = (error: unknown, req: Request, res: Response, _next: NextFunction) => {
    console.error('Error: ' + req.method + ' ' + req.originalUrl);

    const normalizedError = normalizeError(error);

    const statusCode = normalizedError.statusCode;

    const response = {
        success: false,
        data: null,
        error: {
            message: normalizedError.message || 'Internal Server Error',
            code: statusCode,
            ...(process.env.NODE_ENV === 'development' && {
                stack: normalizedError.stack,
            }),
        },
    };

    res.status(statusCode).json(response);
};
