import request from 'supertest';
import express from 'express';
import bcrypt from 'bcrypt';

// 1. Mock repository methods
const mockCreate = jest.fn();
const mockSave = jest.fn();
const mockFindOne = jest.fn(); // Need this for the new conflict check

// 2. Mock AppDataSource before importing router
jest.mock('../startup/data-source', () => ({
    AppDataSource: {
        getRepository: jest.fn(() => ({
            create: mockCreate,
            save: mockSave,
            findOne: mockFindOne, // Added for conflict check
            // Keep other methods if needed by other routes
        })),
    },
}));

// 3. Mock bcrypt
jest.mock('bcrypt', () => ({
    hash: jest.fn(),
}));

// 4. Mock getUsers and DTO mapper
const mockGetUsers = jest.fn();
const mockToUserWithCountDto = jest.fn();

jest.mock('../services/userService', () => ({
    getUsers: (...args: any[]) => mockGetUsers(...args),
}));

jest.mock('../interfaces/UserWithCountDto', () => ({
    toUserWithCountDto: (...args: any[]) => mockToUserWithCountDto(...args),
}));

import userRouter from './userRouter';
import { errorHandler } from '../middleware/errorHandling/errorHandler';
import session from 'express-session';

const app = express();
app.use(express.json());
app.use(
    session({
        secret: 'test-secret',
        resave: false,
        saveUninitialized: false,
    }),
);
app.use('/users', userRouter);
app.use(errorHandler);

describe('userRouter', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /users', () => {
        it('should create a new user and return 201 with success response', async () => {
            const reqBody = {
                username: 'john',
                password: 'pass',
                email: 'john@example.com',
            };

            // Mock: No existing user found
            mockFindOne.mockResolvedValue(null);

            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

            const savedUser = {
                id: 1,
                username: 'john',
                email: 'john@example.com',
                password: 'hashedPassword',
                role: 'user',
            };

            mockCreate.mockReturnValue(savedUser);
            mockSave.mockResolvedValue(savedUser);

            const res = await request(app).post('/users').send(reqBody);

            expect(res.status).toBe(201);
            expect(res.body).toEqual({
                success: true,
                message: 'User created successfully',
                data: {
                    id: 1,
                    username: 'john',
                    email: 'john@example.com',
                },
            });

            // Verify findOne was called to check for existing user
            expect(mockFindOne).toHaveBeenCalledWith({
                where: [{ username: 'john' }, { email: 'john@example.com' }],
            });

            expect(bcrypt.hash).toHaveBeenCalledWith('pass', 10);
            expect(mockCreate).toHaveBeenCalledWith({
                username: 'john',
                password: 'hashedPassword',
                email: 'john@example.com',
                role: 'user',
            });
            expect(mockSave).toHaveBeenCalled();
        });

        it('should return 409 if username already exists', async () => {
            const reqBody = {
                username: 'john',
                password: 'pass',
                email: 'john@example.com',
            };

            // Mock: Existing user with same username
            mockFindOne.mockResolvedValue({
                id: 1,
                username: 'john',
                email: 'different@example.com', // Different email
            });

            const res = await request(app).post('/users').send(reqBody);

            expect(res.status).toBe(409);
            expect(res.body).toEqual({
                success: false,
                data: null,
                error: {
                    message: 'Username already taken',
                    code: 409,
                },
            });

            expect(mockFindOne).toHaveBeenCalled();
            expect(bcrypt.hash).not.toHaveBeenCalled(); // Should not hash password
            expect(mockCreate).not.toHaveBeenCalled(); // Should not create user
            expect(mockSave).not.toHaveBeenCalled(); // Should not save
        });

        it('should return 409 if email already exists', async () => {
            const reqBody = {
                username: 'newuser',
                password: 'pass',
                email: 'existing@example.com',
            };

            // Mock: Existing user with same email
            mockFindOne.mockResolvedValue({
                id: 1,
                username: 'differentuser', // Different username
                email: 'existing@example.com',
            });

            const res = await request(app).post('/users').send(reqBody);

            expect(res.status).toBe(409);
            expect(res.body).toEqual({
                success: false,
                data: null,
                error: {
                    message: 'Email already registered',
                    code: 409,
                },
            });

            expect(mockFindOne).toHaveBeenCalled();
            expect(bcrypt.hash).not.toHaveBeenCalled();
            expect(mockCreate).not.toHaveBeenCalled();
            expect(mockSave).not.toHaveBeenCalled();
        });

        it('should return 500 if repository save fails', async () => {
            const reqBody = {
                username: 'john',
                password: 'pass',
                email: 'john@example.com',
            };

            // Mock: No existing user
            mockFindOne.mockResolvedValue(null);

            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

            const userToSave = {
                username: 'john',
                password: 'hashedPassword',
                email: 'john@example.com',
                role: 'user',
            };

            mockCreate.mockReturnValue(userToSave);
            mockSave.mockRejectedValue(new Error('DB save error'));

            const res = await request(app).post('/users').send(reqBody);

            expect(res.status).toBe(500);
            expect(res.body.error).toBeDefined();
            expect(res.body.error.message).toBe('DB save error');

            expect(mockFindOne).toHaveBeenCalled();
            expect(bcrypt.hash).toHaveBeenCalled();
            expect(mockCreate).toHaveBeenCalled();
            expect(mockSave).toHaveBeenCalled();
        });
    });

    // Keep your existing GET tests...
    describe('GET /users', () => {
        it('should return 500 if getUsers throws an error', async () => {
            mockGetUsers.mockRejectedValue(new Error('DB error'));

            const res = await request(app).get('/users');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({
                success: false,
                data: null,
                error: {
                    message: 'DB error',
                    code: 500,
                },
            });
        });
    });
});
