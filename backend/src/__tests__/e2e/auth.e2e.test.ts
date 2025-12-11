import request from 'supertest';
import { User } from '../../entities/User';
import { createTestApp, mockUserFindOne, mockUserCreate, mockUserSave, mockBcryptHash, mockBcryptCompare } from './setup';

const app = createTestApp();

describe('E2E Tests - Authentication', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('User Registration and Authentication Flow', () => {
        it('should complete full user registration and login flow', async () => {
            // Step 1: Create a new user
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'Test123!@#',
            };

            mockUserCreate.mockReturnValue({
                ...userData,
                role: 'user',
            });
            mockUserSave.mockResolvedValue(undefined);
            mockBcryptHash.mockResolvedValue('hashed_password');

            const registerRes = await request(app).post('/users').send(userData);

            expect(registerRes.status).toBe(201);
            expect(registerRes.body.message).toBe('User created successfully');
            expect(mockUserCreate).toHaveBeenCalledWith({
                username: userData.username,
                password: 'hashed_password',
                email: userData.email,
                role: 'user',
            });

            // Step 2: Login with created user
            const loginUser = {
                id: 1,
                username: userData.username,
                password: 'hashed_password',
                role: 'user',
            } as User;

            mockUserFindOne.mockResolvedValue(loginUser);
            mockBcryptCompare.mockResolvedValue(true);

            const loginRes = await request(app).post('/auth/login').send({
                username: userData.username,
                password: userData.password,
            });

            expect(loginRes.status).toBe(200);
            expect(loginRes.body.message).toBe('Logged in successfully');
            expect(loginRes.body.user).toEqual({
                id: 1,
                username: userData.username,
                role: 'user',
            });

            // Step 3: Verify authentication with /auth/me
            const agent = request.agent(app);
            mockUserFindOne.mockResolvedValue(loginUser);
            mockBcryptCompare.mockResolvedValue(true);

            await agent.post('/auth/login').send({
                username: userData.username,
                password: userData.password,
            });

            const meRes = await agent.get('/auth/me');
            expect(meRes.status).toBe(200);
            expect(meRes.body).toHaveProperty('username', userData.username);
        });

        it('should handle invalid login credentials', async () => {
            mockUserFindOne.mockResolvedValue(null);

            const res = await request(app).post('/auth/login').send({
                username: 'nonexistent',
                password: 'wrongpassword',
            });

            expect(res.status).toBe(401);
            expect(res.body.error.message).toBe('Invalid credentials');
        });

        it('should logout user successfully', async () => {
            const loginUser = {
                id: 1,
                username: 'testuser',
                password: 'hashed',
                role: 'user',
            } as User;

            mockUserFindOne.mockResolvedValue(loginUser);
            mockBcryptCompare.mockResolvedValue(true);

            const agent = request.agent(app);

            // Login first
            await agent.post('/auth/login').send({
                username: 'testuser',
                password: 'password',
            });

            // Logout
            const logoutRes = await agent.post('/auth/logout');
            expect(logoutRes.status).toBe(200);
            expect(logoutRes.body.message).toBe('Logged out successfully');

            // Verify logged out by checking /auth/me
            const meRes = await agent.get('/auth/me');
            expect(meRes.status).toBe(401);
        });
    });
});
