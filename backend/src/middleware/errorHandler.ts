import { Request, Response, NextFunction } from 'express';

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

export const notFoundHandler = (req: Request, res: Response, _next: NextFunction) => {
    console.error(`Not Found: ${req.originalUrl}`);

    res.status(404).json({
        success: false,
        data: null,
        error: {
            message: 'Resource not found',
            code: 404,
        },
    });
};

export class ApiError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

function normalizeError(error: unknown) {
    if (error instanceof ApiError) {
        return {
            message: error.message,
            stack: error.stack,
            statusCode: error.statusCode,
        };
    }

    if (error instanceof Error) {
        return {
            message: error.message,
            stack: error.stack,
            statusCode: 500,
        };
    }

    return {
        message: String(error),
        statusCode: 500,
    };
}
