import { validateListCreation } from './listValidation';
import { Request, Response, NextFunction } from 'express';

// Alternative: Test with actual validation functions (no mocking)
// This tests the integration of all validators
describe('validateListCreation integration', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = { body: {} };
        res = {};
        next = jest.fn();
    });

    it('should validate a complete valid request', () => {
        req.body = {
            name: '  My Action List  ',
            description: '  My favorite movies  ',
            movieIds: [1, 2, 3, 4, 5],
        };

        validateListCreation(req as Request, res as Response, next);

        expect(req.body.name).toBe('my action list'); // trimmed & lowercase
        expect(req.body.description).toBe('My favorite movies'); // trimmed only
        expect(req.body.movieIds).toEqual([1, 2, 3, 4, 5]); // unchanged
        expect(next).toHaveBeenCalled();
    });

    it('should handle missing optional fields', () => {
        req.body = {
            name: 'Comedy Movies',
            // description and movieIds are undefined
        };

        validateListCreation(req as Request, res as Response, next);

        // next should be called with an error
        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(req.body.name).toBe('Comedy Movies');
        expect(req.body.description).toBeUndefined(); // Would throw from validator
        expect(req.body.movieIds).toBeUndefined(); // Would throw from validator
    });
});
