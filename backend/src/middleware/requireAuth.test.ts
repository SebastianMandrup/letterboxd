import { requireAuth } from './requireAuth';
import { Request, Response, NextFunction } from 'express';

describe('requireAuth middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session: {} as any,
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it('should call next if user is authenticated', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req.session!.user = { role: 'user' } as any;

    requireAuth(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return 401 if user is not authenticated', () => {
    req.session!.user = undefined;

    requireAuth(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });
});
