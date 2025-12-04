import { requireAdmin } from './requireAdmin';
import { Request, Response, NextFunction } from 'express';

describe('requireAdmin middleware', () => {
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

    it('should call next if user is admin', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        req.session = { user: { role: 'admin' } } as any;

        requireAdmin(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it('should return 403 if no user in session', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        req.session = {} as any;

        requireAdmin(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if user is not admin', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        req.session = { user: { role: 'user' } } as any;

        requireAdmin(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' });
        expect(next).not.toHaveBeenCalled();
    });
});
