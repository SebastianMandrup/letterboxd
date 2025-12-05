import request from 'supertest';
import bcrypt from 'bcrypt';
import { Express } from 'express';
import { TestDataSource } from '../../startup/data-source.test';
import { User } from '../../entities/User';
import { initTestDb, cleanupTestDb, clearDatabase, createIntegrationTestApp } from './setup';

// Mock AppDataSource to use TestDataSource
jest.mock('../../startup/data-source', () => ({
    AppDataSource: TestDataSource,
}));

describe('Integration Tests - Authentication', () => {
    let app: Express;
    let userRepository: ReturnType<typeof TestDataSource.getRepository<User>>;

    beforeAll(async () => {
        await initTestDb();
        app = createIntegrationTestApp();
        userRepository = TestDataSource.getRepository(User);
    });

    afterAll(async () => {
        await cleanupTestDb();
    });

    beforeEach(async () => {
        await clearDatabase();
    });

    describe('User Registration and Login', () => {
        it('should register a new user and login successfully', async () => {
            // Step 1: Register new user
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'Test123!@#',
            };

            const registerRes = await request(app).post('/users').send(userData);

            expect(registerRes.status).toBe(201);
            expect(registerRes.body.message).toBe('User created successfully');

            // Verify user was created in database
            const createdUser = await userRepository.findOne({
                where: { username: userData.username },
            });

            expect(createdUser).toBeDefined();
            expect(createdUser?.username).toBe(userData.username);
            expect(createdUser?.email).toBe(userData.email);
            expect(createdUser?.role).toBe('user');

            // Verify password was hashed
            const passwordMatch = await bcrypt.compare(userData.password, createdUser!.password);
            expect(passwordMatch).toBe(true);

            // Step 2: Login with created user
            const loginRes = await request(app).post('/auth/login').send({
                username: userData.username,
                password: userData.password,
            });

            expect(loginRes.status).toBe(200);
            expect(loginRes.body.message).toBe('Logged in successfully');
            expect(loginRes.body.user).toMatchObject({
                username: userData.username,
                role: 'user',
            });
        });

        it('should reject login with invalid credentials', async () => {
            // Create a user first
            const hashedPassword = await bcrypt.hash('correctpassword', 10);
            await userRepository.save({
                username: 'existinguser',
                email: 'existing@example.com',
                password: hashedPassword,
                role: 'user',
            });

            // Try to login with wrong password
            const res = await request(app).post('/auth/login').send({
                username: 'existinguser',
                password: 'wrongpassword',
            });

            expect(res.status).toBe(401);
            expect(res.body.message).toBe('Invalid credentials');
        });

        it('should maintain session after login', async () => {
            // Create a user
            const hashedPassword = await bcrypt.hash('password123', 10);
            await userRepository.save({
                username: 'sessionuser',
                email: 'session@example.com',
                password: hashedPassword,
                role: 'user',
            });

            const agent = request.agent(app);

            // Login
            const loginRes = await agent.post('/auth/login').send({
                username: 'sessionuser',
                password: 'password123',
            });

            expect(loginRes.status).toBe(200);

            // Verify session with /auth/me
            const meRes = await agent.get('/auth/me');
            expect(meRes.status).toBe(200);
            expect(meRes.body.username).toBe('sessionuser');
        });

        it('should logout successfully', async () => {
            // Create and login user
            const hashedPassword = await bcrypt.hash('password123', 10);
            await userRepository.save({
                username: 'logoutuser',
                email: 'logout@example.com',
                password: hashedPassword,
                role: 'user',
            });

            const agent = request.agent(app);

            await agent.post('/auth/login').send({
                username: 'logoutuser',
                password: 'password123',
            });

            // Logout
            const logoutRes = await agent.post('/auth/logout');
            expect(logoutRes.status).toBe(200);
            expect(logoutRes.body.message).toBe('Logged out successfully');

            // Verify session is cleared
            const meRes = await agent.get('/auth/me');
            expect(meRes.status).toBe(401);
        });
    });

    describe('User Registration Validation', () => {
        it('should prevent duplicate usernames', async () => {
            // Create first user
            await userRepository.save({
                username: 'duplicate',
                email: 'first@example.com',
                password: await bcrypt.hash('password', 10),
                role: 'user',
            });

            // Try to create another user with same username
            const res = await request(app).post('/users').send({
                username: 'duplicate',
                email: 'second@example.com',
                password: 'Password123!',
            });

            // Should fail due to unique constraint or validation
            expect([400, 500]).toContain(res.status);
        });
    });
});
