import { Request, Response, NextFunction } from 'express';

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
