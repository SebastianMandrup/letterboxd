import { Request, Response, NextFunction } from 'express';
import { authenticateUser } from './authenticateUser';

// Mock the data source
const mockUserRepository = {
    findOneBy: jest.fn(),
};

jest.mock('../startup/data-source', () => ({
    AppDataSource: {
        getRepository: jest.fn(() => mockUserRepository),
    },
}));

describe('authenticateUser', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;

    beforeEach(() => {
        mockRequest = {
            session: {
                id: 'test-session-id',
                cookie: {} as any,
                regenerate: jest.fn(),
                destroy: jest.fn((callback) => {
                    callback(null);
                    return {} as any;
                }),
                reload: jest.fn(),
                resetMaxAge: jest.fn(),
                save: jest.fn(),
                touch: jest.fn(),
            },
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        nextFunction = jest.fn();

        jest.clearAllMocks();
    });

    it('should call next() when user is authenticated', async () => {
        const user = { id: 1, username: 'testuser', email: 'test@example.com' };
        mockRequest.session!.user = { id: 1, username: 'testuser', role: 'user' };
        mockUserRepository.findOneBy.mockResolvedValue(user);

        await authenticateUser(mockRequest as Request, mockResponse as Response, nextFunction);

        expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
        expect(mockRequest.user).toEqual(user);
        expect(nextFunction).toHaveBeenCalled();
        expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should call next with error when no userId in session', async () => {
        mockRequest.session!.user = undefined;

        await authenticateUser(mockRequest as Request, mockResponse as Response, nextFunction);

        expect(nextFunction).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Unauthorized',
            statusCode: 401,
        }));
        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should call next with error when user not found in database', async () => {
        mockRequest.session!.user = { id: 999, username: 'testuser', role: 'user' };
        mockUserRepository.findOneBy.mockResolvedValue(null);

        await authenticateUser(mockRequest as Request, mockResponse as Response, nextFunction);

        expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
        expect(nextFunction).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Unauthorized',
            statusCode: 401,
        }));
        expect(mockRequest.session!.destroy).toHaveBeenCalled();
        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should call next with error when database error occurs', async () => {
        mockRequest.session!.user = { id: 1, username: 'testuser', role: 'user' };
        mockUserRepository.findOneBy.mockRejectedValue(new Error('Database error'));

        await authenticateUser(mockRequest as Request, mockResponse as Response, nextFunction);

        expect(nextFunction).toHaveBeenCalledWith(expect.any(Error));
        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockResponse.json).not.toHaveBeenCalled();
    });
});
