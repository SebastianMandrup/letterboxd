import request from 'supertest';
import express from 'express';

// 1. Mock service functions
const mockGetMovies = jest.fn();
const mockGetMovieBySlug = jest.fn();
const mockDeleteMovieById = jest.fn();
const mockBuildPaginatedResponse = jest.fn();

// 2. Mock AppDataSource before importing router
jest.mock('../startup/data-source', () => ({
    AppDataSource: {
        getRepository: jest.fn(),
    },
}));

// 3. Mock authentication middleware
jest.mock('../middleware/authenticateUser', () => ({
    authenticateUser: (req: express.Request, res: express.Response, next: express.NextFunction) => {
        next();
    },
}));

jest.mock('../services/movies/movieService', () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getMovies: (...args: any[]) => mockGetMovies(...args),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getMovieBySlug: (...args: any[]) => mockGetMovieBySlug(...args),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    deleteMovieById: (...args: any[]) => mockDeleteMovieById(...args),
}));

jest.mock(
    './helper/buildPaginatedResponse',
    () =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (...args: any[]) =>
            mockBuildPaginatedResponse(...args),
);

// 4. Import the router after mocks
import movieRouter from './movieRouter';
import { errorHandler } from '../middleware/errorHandling/errorHandler';

const app = express();
app.use(express.json());
app.use('/movies', movieRouter);
app.use(errorHandler);

describe('movieRouter', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /movies', () => {
        it('should return paginated movies', async () => {
            const movies = [{ id: 1, title: 'Movie 1' }];
            const total = 1;
            const paginatedResponse = { data: movies, total };

            mockGetMovies.mockResolvedValue({ movies, total });
            mockBuildPaginatedResponse.mockReturnValue(paginatedResponse);

            const res = await request(app).get('/movies');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(paginatedResponse);
            expect(mockGetMovies).toHaveBeenCalled();
            expect(mockBuildPaginatedResponse).toHaveBeenCalledWith(movies, total, expect.anything());
        });

        it('should return 500 on service error', async () => {
            mockGetMovies.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/movies');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({
                success: false,
                data: null,
                error: {
                    message: 'Database error',
                    code: 500,
                },
            });
        });
    });

    describe('GET /movies/:slug', () => {
        it('should return movie if found', async () => {
            const movie = { id: 1, title: 'Movie 1', slug: 'movie-1' };
            mockGetMovieBySlug.mockResolvedValue(movie);

            const res = await request(app).get('/movies/movie-1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(movie);
        });

        it('should return 404 if movie not found', async () => {
            mockGetMovieBySlug.mockResolvedValue(null);

            const res = await request(app).get('/movies/nonexistent');

            expect(res.status).toBe(404);
            expect(res.body).toEqual({
                success: false,
                data: null,
                error: {
                    message: 'Movie with slug nonexistent not found.',
                    code: 404,
                },
            });
        });

        it('should return 500 on service error', async () => {
            mockGetMovieBySlug.mockRejectedValue(new Error('Service error'));

            const res = await request(app).get('/movies/movie-1');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({
                success: false,
                data: null,
                error: {
                    message: 'Service error',
                    code: 500,
                },
            });
        });
    });
});
