import request from 'supertest';
import express from 'express';
import bcrypt from 'bcrypt';

// 1. Mock repository methods
const mockCreate = jest.fn();
const mockSave = jest.fn();

// 2. Mock AppDataSource before importing router
jest.mock('../startup/data-source', () => ({
    AppDataSource: {
        getRepository: jest.fn(() => ({
            create: mockCreate,
            save: mockSave,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getUsers: (...args: any[]) => mockGetUsers(...args),
}));

jest.mock('../DTO/UserWithCountDto', () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toUserWithCountDto: (...args: any[]) => mockToUserWithCountDto(...args),
}));

import userRouter from './userRouter';
import { errorHandler } from '../middleware/errorHandler';

const app = express();
app.use(express.json());
app.use('/users', userRouter);
app.use(errorHandler);

describe('userRouter', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

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

    describe('POST /users', () => {
        it('should create a new user and return 201', async () => {
            const reqBody = {
                username: 'john',
                password: 'pass',
                email: 'john@example.com',
            };
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
            mockCreate.mockReturnValue({
                ...reqBody,
                password: 'hashedPassword',
            });
            mockSave.mockResolvedValue({
                ...reqBody,
                id: 1,
                password: 'hashedPassword',
            });

            const res = await request(app).post('/users').send(reqBody);

            expect(res.status).toBe(201);
            expect(res.body).toEqual({ message: 'User created successfully' });
            expect(bcrypt.hash).toHaveBeenCalledWith('pass', 10);
            expect(mockCreate).toHaveBeenCalledWith({
                username: 'john',
                password: 'hashedPassword',
                email: 'john@example.com',
                role: 'user',
            });
            expect(mockSave).toHaveBeenCalled();
        });

        it('should return 500 if repository save fails', async () => {
            const reqBody = {
                username: 'john',
                password: 'pass',
                email: 'john@example.com',
            };
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
            mockCreate.mockReturnValue({
                ...reqBody,
                password: 'hashedPassword',
            });
            mockSave.mockRejectedValue(new Error('DB save error'));

            const res = await request(app).post('/users').send(reqBody);

            expect(res.status).toBe(500);
            // Error handler formats errors consistently
            expect(res.body.error).toBeDefined();
            expect(res.body.error.message).toBe('DB save error');
        });
    });
});
