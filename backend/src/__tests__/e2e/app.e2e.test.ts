import request from 'supertest';
import express from 'express';
import session from 'express-session';
import bcrypt from 'bcrypt';
import { User } from '../../entities/User';
import { Movie } from '../../entities/Movie';
import { Review } from '../../entities/Review';
import { List } from '../../entities/List';

// Mock user repository functions
const mockUserFindOne = jest.fn();
const mockUserCreate = jest.fn();
const mockUserSave = jest.fn();

// Mock service functions
const mockGetMovies = jest.fn();
const mockGetMovieBySlug = jest.fn();
const mockDeleteMovieById = jest.fn();
const mockGetReviews = jest.fn();
const mockGetLists = jest.fn();
const mockGetUsers = jest.fn();

// Mock AppDataSource - only for auth/user routes that use it directly
jest.mock('../../startup/data-source', () => ({
    AppDataSource: {
        getRepository: jest.fn((entity) => {
            if (entity === User) {
                return {
                    findOne: mockUserFindOne,
                    create: mockUserCreate,
                    save: mockUserSave,
                };
            }
            return {};
        }),
    },
}));

// Mock bcrypt
jest.mock('bcrypt', () => ({
    compare: jest.fn(),
    hash: jest.fn(),
}));

// Mock movie service
jest.mock('../../services/movies/movieService', () => ({
    getMovies: jest.fn((...args) => mockGetMovies(...args)),
    getMovieBySlug: jest.fn((...args) => mockGetMovieBySlug(...args)),
    deleteMovieById: jest.fn((...args) => mockDeleteMovieById(...args)),
}));

// Mock review service
jest.mock('../../services/reviewService', () => ({
    getReviews: jest.fn((...args) => mockGetReviews(...args)),
}));

// Mock list service
jest.mock('../../services/listService', () => ({
    getLists: jest.fn((...args) => mockGetLists(...args)),
}));

// Mock user service
jest.mock('../../services/userService', () => ({
    getUsers: jest.fn((...args) => mockGetUsers(...args)),
}));

// Import routers after mocks
import authRouter from '../../routes/authRouter';
import userRouter from '../../routes/userRouter';
import movieRouter from '../../routes/movieRouter';
import reviewRouter from '../../routes/reviewRouter';
import listRouter from '../../routes/listRouter';

// Setup Express app similar to the real app
const app = express();
app.use(express.json());
app.use(
    session({
        secret: 'test-secret',
        resave: false,
        saveUninitialized: false,
    }),
);

// Mount routers
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/movies', movieRouter);
app.use('/reviews', reviewRouter);
app.use('/lists', listRouter);

describe('E2E Tests - Full Application Flow', () => {
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
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');

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
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

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
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

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
            expect(res.body.message).toBe('Invalid credentials');
        });

        it('should logout user successfully', async () => {
            const loginUser = {
                id: 1,
                username: 'testuser',
                password: 'hashed',
                role: 'user',
            } as User;

            mockUserFindOne.mockResolvedValue(loginUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

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

    describe('Movie Operations Flow', () => {
        it('should fetch list of movies', async () => {
            const mockMovies = [
                {
                    id: 1,
                    title: 'Inception',
                    slug: 'inception',
                    originalTitle: 'Inception',
                    adult: false,
                    overview: 'A thief who steals corporate secrets',
                    releaseDate: new Date('2010-07-16'),
                },
                {
                    id: 2,
                    title: 'The Matrix',
                    slug: 'the-matrix',
                    originalTitle: 'The Matrix',
                    adult: false,
                    overview: 'A computer hacker learns about reality',
                    releaseDate: new Date('1999-03-31'),
                },
            ] as Movie[];

            mockGetMovies.mockResolvedValue({ movies: mockMovies, total: 2 });

            const res = await request(app).get('/movies');

            expect(res.status).toBe(200);
            expect(res.body.count).toBe(2);
            expect(res.body.results).toHaveLength(2);
            expect(res.body.results[0].title).toBe('Inception');
        });

        it('should fetch a single movie by slug', async () => {
            const mockMovie = {
                id: 1,
                title: 'Inception',
                slug: 'inception',
                originalTitle: 'Inception',
                adult: false,
                overview: 'A thief who steals corporate secrets',
                releaseDate: new Date('2010-07-16'),
            } as Movie;

            mockGetMovieBySlug.mockResolvedValue(mockMovie);

            const res = await request(app).get('/movies/inception');

            expect(res.status).toBe(200);
            expect(res.body.title).toBe('Inception');
            expect(res.body.slug).toBe('inception');
        });

        it('should return 404 for non-existent movie', async () => {
            mockGetMovieBySlug.mockResolvedValue(null);

            const res = await request(app).get('/movies/non-existent-movie');

            expect(res.status).toBe(404);
            expect(res.body.error).toContain('not found');
        });

        it('should delete a movie by ID', async () => {
            mockDeleteMovieById.mockResolvedValue(true);

            const res = await request(app).delete('/movies/1');

            expect(res.status).toBe(200);
            expect(res.body.message).toContain('deleted successfully');
        });
    });

    describe('Review Operations Flow', () => {
        it('should fetch list of reviews', async () => {
            const mockReviews = [
                {
                    id: 1,
                    review: 'Great movie!',
                    rating: 5,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 2,
                    review: 'Not bad',
                    rating: 3,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ] as Review[];

            mockGetReviews.mockResolvedValue({ reviews: mockReviews, total: 2 });

            const res = await request(app).get('/reviews');

            expect(res.status).toBe(200);
            expect(res.body.count).toBe(2);
            expect(res.body.results).toHaveLength(2);
        });

        it('should handle pagination for reviews', async () => {
            const mockReviews = [
                {
                    id: 1,
                    review: 'Review 1',
                    rating: 5,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ] as Review[];

            mockGetReviews.mockResolvedValue({ reviews: mockReviews, total: 10 });

            const res = await request(app).get('/reviews?page=1&limit=1');

            expect(res.status).toBe(200);
            expect(res.body.count).toBe(10);
            expect(res.body.results).toHaveLength(1);
        });
    });

    describe('List Operations Flow', () => {
        it('should fetch list of movie lists', async () => {
            const mockLists = [
                {
                    id: 1,
                    name: 'Favorite Movies',
                    description: 'My all-time favorites',
                },
                {
                    id: 2,
                    name: 'To Watch',
                    description: 'Movies I want to watch',
                },
            ] as List[];

            mockGetLists.mockResolvedValue({ lists: mockLists, total: 2 });

            const res = await request(app).get('/lists');

            expect(res.status).toBe(200);
            expect(res.body.count).toBe(2);
            expect(res.body.results).toHaveLength(2);
        });

        it('should handle pagination for lists', async () => {
            const mockLists = [
                {
                    id: 1,
                    name: 'List 1',
                },
            ] as List[];

            mockGetLists.mockResolvedValue({ lists: mockLists, total: 5 });

            const res = await request(app).get('/lists?page=1&limit=1');

            expect(res.status).toBe(200);
            expect(res.body.count).toBe(5);
            expect(res.body.results).toHaveLength(1);
        });
    });

    describe('User Management Flow', () => {
        it('should fetch list of users', async () => {
            mockGetUsers.mockResolvedValue({
                users: [
                    {
                        id: 1,
                        username: 'user1',
                    },
                    {
                        id: 2,
                        username: 'user2',
                    },
                ],
                total: 2,
            });

            const res = await request(app).get('/users');

            expect(res.status).toBe(200);
            expect(res.body.count).toBe(2);
        });
    });

    describe('Complete User Journey - Registration to Movie Interaction', () => {
        it('should complete a full user journey', async () => {
            const agent = request.agent(app);

            // 1. Register new user
            mockUserCreate.mockReturnValue({
                username: 'moviefan',
                email: 'fan@movies.com',
                role: 'user',
            });
            mockUserSave.mockResolvedValue(undefined);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');

            const registerRes = await agent.post('/users').send({
                username: 'moviefan',
                email: 'fan@movies.com',
                password: 'SecurePass123!',
            });

            expect(registerRes.status).toBe(201);

            // 2. Login
            const loginUser = {
                id: 1,
                username: 'moviefan',
                password: 'hashed_password',
                role: 'user',
            } as User;

            mockUserFindOne.mockResolvedValue(loginUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const loginRes = await agent.post('/auth/login').send({
                username: 'moviefan',
                password: 'SecurePass123!',
            });

            expect(loginRes.status).toBe(200);

            // 3. Browse movies
            mockGetMovies.mockResolvedValue({
                movies: [{ id: 1, title: 'Inception', slug: 'inception' }] as Movie[],
                total: 1,
            });

            const moviesRes = await agent.get('/movies');
            expect(moviesRes.status).toBe(200);
            expect(moviesRes.body.results).toHaveLength(1);

            // 4. View movie details
            mockGetMovieBySlug.mockResolvedValue({
                id: 1,
                title: 'Inception',
                slug: 'inception',
            } as Movie);

            const movieRes = await agent.get('/movies/inception');
            expect(movieRes.status).toBe(200);
            expect(movieRes.body.title).toBe('Inception');

            // 5. Check reviews
            mockGetReviews.mockResolvedValue({
                reviews: [],
                total: 0,
            });

            const reviewsRes = await agent.get('/reviews');
            expect(reviewsRes.status).toBe(200);

            // 6. Check lists
            mockGetLists.mockResolvedValue({
                lists: [],
                total: 0,
            });

            const listsRes = await agent.get('/lists');
            expect(listsRes.status).toBe(200);

            // 7. Logout
            const logoutRes = await agent.post('/auth/logout');
            expect(logoutRes.status).toBe(200);
        });
    });

    describe('Error Handling', () => {
        it('should handle database errors gracefully', async () => {
            mockGetMovies.mockRejectedValue(new Error('Database connection failed'));

            const res = await request(app).get('/movies');

            expect(res.status).toBe(500);
            expect(res.body.error).toBe('Internal server error');
        });

        it('should handle invalid request data', async () => {
            mockUserCreate.mockReturnValue({});
            mockUserSave.mockRejectedValue(new Error('Validation failed'));

            const res = await request(app).post('/users').send({
                username: 'a', // Too short
                email: 'invalid-email',
                password: '123', // Too short
            });

            // Should fail validation or return error
            expect([400, 500]).toContain(res.status);
        });
    });
});
