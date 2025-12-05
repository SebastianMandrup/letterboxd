import request from 'supertest';
import { User } from '../../entities/User';
import { Movie } from '../../entities/Movie';
import {
    createTestApp,
    mockUserFindOne,
    mockUserCreate,
    mockUserSave,
    mockGetMovies,
    mockGetMovieBySlug,
    mockGetReviews,
    mockGetLists,
    mockBcryptHash,
    mockBcryptCompare,
} from './setup';

const app = createTestApp();

describe('E2E Tests - User Journey', () => {
    beforeEach(() => {
        jest.clearAllMocks();
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
            mockBcryptHash.mockResolvedValue('hashed_password');

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
            mockBcryptCompare.mockResolvedValue(true);

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
});
