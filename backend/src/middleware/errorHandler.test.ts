import { errorHandler, notFoundHandler } from './errorHandler';
import { Request, Response, NextFunction } from 'express';

describe('errorHandler', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      method: 'GET',
      originalUrl: '/test',
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
    process.env.NODE_ENV = 'test'; // ensure stack is not included
  });

  it('should respond with 500 and message when an Error object is thrown', () => {
    const error = new Error('Test error');

    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: null,
      error: {
        message: 'Test error',
        code: 500,
      },
    });

    expect(next).toHaveBeenCalled();
  });

  it('should handle non-Error values', () => {
    const error = 'String error';

    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: null,
      error: {
        message: 'String error',
        code: 500,
      },
    });

    expect(next).toHaveBeenCalled();
  });

  it('should include stack when NODE_ENV=development', () => {
    process.env.NODE_ENV = 'development';
    const error = new Error('Dev env error');

    errorHandler(error, req as Request, res as Response, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          message: 'Dev env error',
          code: 500,
          stack: expect.any(String),
        }),
      }),
    );
  });
});

describe('notFoundHandler', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      originalUrl: '/missing',
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should respond with 404 for missing routes', () => {
    notFoundHandler(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: null,
      error: {
        message: 'Resource not found',
        code: 404,
      },
    });
  });
});
