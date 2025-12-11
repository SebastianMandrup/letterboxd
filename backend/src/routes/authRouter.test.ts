import request from 'supertest';
import express from 'express';
import session from 'express-session';
import bcrypt from 'bcrypt';
import { User } from '../entities/User';

// 1. Declare mocks first
const mockFindOne = jest.fn();

// 2. Mock AppDataSource before importing authRouter
jest.mock('../startup/data-source', () => ({
    AppDataSource: {
        getRepository: jest.fn(() => ({
            findOne: mockFindOne,
        })),
    },
}));

// 3. Mock bcrypt
jest.mock('bcrypt', () => ({
    compare: jest.fn(),
}));

// 4. Now import the router after mocks
import authRouter from '../routes/authRouter';
import { errorHandler } from '../middleware/errorHandler';

// 5. Setup Express app
const app = express();
app.use(express.json());
app.use(
    session({
        secret: 'test-secret',
        resave: false,
        saveUninitialized: false,
    }),
);
app.use('/auth', authRouter);
app.use(errorHandler);

describe('Auth Router', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /auth/login', () => {
        it('should login successfully with correct credentials', async () => {
            const user = {
                id: 1,
                username: 'test',
                password: 'hashed',
                role: 'user',
            } as User;

            mockFindOne.mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const res = await request(app).post('/auth/login').send({ username: 'test', password: 'password' });

            expect(res.status).toBe(200);
            expect(res.body.user).toEqual({
                id: 1,
                username: 'test',
                role: 'user',
            });
            expect(res.body.message).toBe('Logged in successfully');
        });

        it('should return 401 for invalid username', async () => {
            mockFindOne.mockResolvedValue(null);

            const res = await request(app).post('/auth/login').send({ username: 'wrong', password: 'password' });

            expect(res.status).toBe(401);
            expect(res.body).toEqual({
                success: false,
                data: null,
                error: {
                    message: 'Invalid credentials',
                    code: 401,
                },
            });
        });

        it('should return 401 for invalid password', async () => {
            const user = {
                id: 1,
                username: 'test',
                password: 'hashed',
                role: 'user',
            } as User;

            mockFindOne.mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            const res = await request(app).post('/auth/login').send({ username: 'test', password: 'wrong' });

            expect(res.status).toBe(401);
            expect(res.body).toEqual({
                success: false,
                data: null,
                error: {
                    message: 'Invalid credentials',
                    code: 401,
                },
            });
        });
    });

    describe('GET /auth/me', () => {
        it('should return 401 if not logged in', async () => {
            const res = await request(app).get('/auth/me');
            expect(res.status).toBe(401);
            expect(res.body).toEqual({
                success: false,
                data: null,
                error: {
                    message: 'Not authenticated',
                    code: 401,
                },
            });
        });

        it('should return user info if logged in', async () => {
            const user = {
                id: 1,
                username: 'test',
                password: 'hashed',
                role: 'user',
            } as User;
            mockFindOne.mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const agent = request.agent(app);

            // Login first to populate session
            await agent.post('/auth/login').send({ username: 'test', password: 'password' });

            // Now /me should succeed
            const res = await agent.get('/auth/me');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('username', 'test');
        });
    });
});
