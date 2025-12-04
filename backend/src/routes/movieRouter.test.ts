import request from 'supertest';
import express from 'express';

// 1. Mock service functions
const mockGetMovies = jest.fn();
const mockGetMovieBySlug = jest.fn();
const mockDeleteMovieById = jest.fn();
const mockBuildPaginatedResponse = jest.fn();

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

// 2. Import the router after mocks
import movieRouter from './movieRouter';

const app = express();
app.use(express.json());
app.use('/movies', movieRouter);

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
            expect(res.body).toEqual({ error: 'Internal server error' });
        });
    });

    describe('GET /movies/:slug', () => {
        it('should return movie if found', async () => {
            const movie = { id: 1, title: 'Movie 1', slug: 'movie-1' };
            mockGetMovieBySlug.mockResolvedValue(movie);

            const res = await request(app).get('/movies/movie-1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(movie);
            expect(mockGetMovieBySlug).toHaveBeenCalledWith('movie-1');
        });

        it('should return 404 if movie not found', async () => {
            mockGetMovieBySlug.mockResolvedValue(null);

            const res = await request(app).get('/movies/nonexistent');

            expect(res.status).toBe(404);
            expect(res.body).toEqual({
                error: 'Movie with slug nonexistent not found.',
            });
        });

        it('should return 500 on service error', async () => {
            mockGetMovieBySlug.mockRejectedValue(new Error('Service error'));

            const res = await request(app).get('/movies/movie-1');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Internal server error' });
        });
    });

    describe('DELETE /movies/:id', () => {
        it('should delete movie if exists', async () => {
            mockDeleteMovieById.mockResolvedValue(true);

            const res = await request(app).delete('/movies/1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                message: 'Movie with ID 1 deleted successfully.',
            });
            expect(mockDeleteMovieById).toHaveBeenCalledWith(1);
        });

        it('should return 404 if movie does not exist', async () => {
            mockDeleteMovieById.mockResolvedValue(false);

            const res = await request(app).delete('/movies/999');

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Movie with ID 999 not found.' });
        });

        it('should return 500 on service error', async () => {
            mockDeleteMovieById.mockRejectedValue(new Error('Delete error'));

            const res = await request(app).delete('/movies/1');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Internal server error' });
        });
    });
});
