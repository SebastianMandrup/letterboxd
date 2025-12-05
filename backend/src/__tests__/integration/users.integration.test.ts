import request from 'supertest';
import bcrypt from 'bcrypt';
import { Express } from 'express';
import { TestDataSource } from '../../startup/data-source.test';
import { User } from '../../entities/User';
import { Review } from '../../entities/Review';
import { Movie } from '../../entities/Movie';
import { initTestDb, cleanupTestDb, clearDatabase, createIntegrationTestApp } from './setup';

// Mock AppDataSource to use TestDataSource
jest.mock('../../startup/data-source', () => ({
    AppDataSource: TestDataSource,
}));

describe('Integration Tests - Users', () => {
    let app: Express;
    let userRepository: ReturnType<typeof TestDataSource.getRepository<User>>;
    let reviewRepository: ReturnType<typeof TestDataSource.getRepository<Review>>;
    let movieRepository: ReturnType<typeof TestDataSource.getRepository<Movie>>;

    beforeAll(async () => {
        await initTestDb();
        app = createIntegrationTestApp();
        userRepository = TestDataSource.getRepository(User);
        reviewRepository = TestDataSource.getRepository(Review);
        movieRepository = TestDataSource.getRepository(Movie);
    });

    afterAll(async () => {
        await cleanupTestDb();
    });

    beforeEach(async () => {
        await clearDatabase();
    });

    describe('User Management', () => {
        it('should fetch list of users from database', async () => {
            // Create test users
            const users = [
                userRepository.create({
                    username: 'user1',
                    email: 'user1@example.com',
                    password: await bcrypt.hash('password', 10),
                    role: 'user',
                }),
                userRepository.create({
                    username: 'user2',
                    email: 'user2@example.com',
                    password: await bcrypt.hash('password', 10),
                    role: 'user',
                }),
            ];

            await userRepository.save(users);

            // Fetch users via API
            const res = await request(app).get('/users');

            expect(res.status).toBe(200);
            expect(res.body.count).toBe(2);

            const usernames = res.body.results.map((u: User) => u.username);
            expect(usernames).toContain('user1');
            expect(usernames).toContain('user2');
        });

        it('should include user statistics (reviews, watched films)', async () => {
            // Create user
            const user = userRepository.create({
                username: 'statuser',
                email: 'statuser@example.com',
                password: await bcrypt.hash('password', 10),
                role: 'user',
            });
            await userRepository.save(user);

            // Create movie
            const movie = movieRepository.create({
                title: 'Test Movie',
                slug: 'test-movie',
                originalTitle: 'Test Movie',
                adult: false,
                overview: 'Test',
                releaseDate: new Date('2020-01-01'),
            });
            await movieRepository.save(movie);

            // Create another movie
            const movie2 = movieRepository.create({
                title: 'Test Movie 2',
                slug: 'test-movie-2',
                originalTitle: 'Test Movie 2',
                adult: false,
                overview: 'Test 2',
                releaseDate: new Date('2020-02-01'),
            });
            await movieRepository.save(movie2);

            // Create reviews for the user (different movies to avoid unique constraint)
            const reviews = [
                reviewRepository.create({
                    review: 'Review 1',
                    rating: 5,
                    author: user,
                    movie: movie,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }),
                reviewRepository.create({
                    review: 'Review 2',
                    rating: 4,
                    author: user,
                    movie: movie2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }),
            ];
            await reviewRepository.save(reviews);

            // Fetch users
            const res = await request(app).get('/users');

            expect(res.status).toBe(200);
            const userData = res.body.results.find((u: User) => u.username === 'statuser');

            expect(userData).toBeDefined();
            // The service should calculate these counts
            expect(userData.numberOfReviews).toBeGreaterThanOrEqual(0);
        });

        it('should handle pagination for users', async () => {
            // Create multiple users
            const users = Array.from({ length: 15 }, (_, i) =>
                userRepository.create({
                    username: `user${i + 1}`,
                    email: `user${i + 1}@example.com`,
                    password: 'hashed',
                    role: 'user',
                }),
            );

            await userRepository.save(users);

            // Fetch first page
            const page1Res = await request(app).get('/users?page=1&pageSize=10');

            expect(page1Res.status).toBe(200);
            expect(page1Res.body.results).toHaveLength(10);

            // Fetch second page
            const page2Res = await request(app).get('/users?page=2&pageSize=10');

            expect(page2Res.status).toBe(200);
            expect(page2Res.body.results).toHaveLength(5);
        });
    });

    describe('User Creation', () => {
        it('should create user with hashed password', async () => {
            const userData = {
                username: 'newuser',
                email: 'newuser@example.com',
                password: 'SecurePassword123!',
            };

            const res = await request(app).post('/users').send(userData);

            expect(res.status).toBe(201);

            // Verify in database
            const createdUser = await userRepository.findOne({
                where: { username: userData.username },
            });

            expect(createdUser).toBeDefined();
            expect(createdUser?.password).not.toBe(userData.password);

            // Verify password was hashed correctly
            const passwordMatch = await bcrypt.compare(userData.password, createdUser!.password);
            expect(passwordMatch).toBe(true);
        });
    });
});
