import { Request, Response } from 'express';

//
export const errorHandler = (error: unknown, req: Request, res: Response) => {
  console.error('Error: ' + req.method + ' ' + req.originalUrl);

  const normalizedError = normalizeError(error);

  const statusCode = normalizedError.statusCode || 500;

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

export const notFoundHandler = (req: Request, res: Response) => {
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

function normalizeError(error: unknown) {
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
