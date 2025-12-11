import request from 'supertest';
import { Movie } from '../../entities/Movie';
import { createTestApp, mockGetMovies, mockGetMovieBySlug, mockDeleteMovieById } from './setup';

const app = createTestApp();

describe('E2E Tests - Movies', () => {
    beforeEach(() => {
        jest.clearAllMocks();
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
            expect(res.body.error.message).toContain('not found');
        });

        it('should delete a movie by ID', async () => {
            mockDeleteMovieById.mockResolvedValue(true);

            const res = await request(app).delete('/movies/1');

            expect(res.status).toBe(200);
            expect(res.body.message).toContain('deleted successfully');
        });
    });
});
