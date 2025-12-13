import request from 'supertest';
import { Express } from 'express';
import { TestDataSource } from '../../startup/data-source.test';
import { Movie } from '../../entities/Movie';
import { initTestDb, cleanupTestDb, clearDatabase, createIntegrationTestApp } from './setup';

// Mock AppDataSource to use TestDataSource
jest.mock('../../startup/data-source', () => ({
    AppDataSource: TestDataSource,
}));

describe('Integration Tests - Movies', () => {
    let app: Express;
    let movieRepository: ReturnType<typeof TestDataSource.getRepository<Movie>>;

    beforeAll(async () => {
        await initTestDb();
        app = createIntegrationTestApp();
        movieRepository = TestDataSource.getRepository(Movie);
    });

    afterAll(async () => {
        await cleanupTestDb();
    });

    beforeEach(async () => {
        await clearDatabase();
    });

    describe('Movie CRUD Operations', () => {
        it('should fetch list of movies from database', async () => {
            // Create test movies in database
            const movie1 = movieRepository.create({
                title: 'Inception',
                slug: 'inception',
                originalTitle: 'Inception',
                adult: false,
                overview: 'A thief who steals corporate secrets',
                releaseDate: new Date('2010-07-16'),
            });

            const movie2 = movieRepository.create({
                title: 'The Matrix',
                slug: 'the-matrix',
                originalTitle: 'The Matrix',
                adult: false,
                overview: 'A computer hacker learns about reality',
                releaseDate: new Date('1999-03-31'),
            });

            await movieRepository.save([movie1, movie2]);

            // Fetch movies via API
            const res = await request(app).get('/movies');

            expect(res.status).toBe(200);
            expect(res.body.count).toBe(2);
            expect(res.body.results).toHaveLength(2);

            // Verify movie data
            const titles = res.body.results.map((m: Movie) => m.title);
            expect(titles).toContain('Inception');
            expect(titles).toContain('The Matrix');
        });

        it('should fetch a single movie by slug', async () => {
            // Create a movie
            const movie = movieRepository.create({
                title: 'Interstellar',
                slug: 'interstellar',
                originalTitle: 'Interstellar',
                adult: false,
                overview: 'A team of explorers travel through a wormhole',
                releaseDate: new Date('2014-11-07'),
            });

            await movieRepository.save(movie);

            // Fetch by slug
            const res = await request(app).get('/movies/interstellar');

            expect(res.status).toBe(200);
            expect(res.body.title).toBe('Interstellar');
            expect(res.body.slug).toBe('interstellar');
            expect(res.body.overview).toBe('A team of explorers travel through a wormhole');
        });

        it('should return 404 for non-existent movie', async () => {
            const res = await request(app).get('/movies/non-existent-movie');

            expect(res.status).toBe(404);
            expect(res.body.error.message).toContain('not found');
        });

        it('should handle pagination correctly', async () => {
            // Create multiple movies
            const movies = Array.from({ length: 15 }, (_, i) =>
                movieRepository.create({
                    title: `Movie ${i + 1}`,
                    slug: `movie-${i + 1}`,
                    originalTitle: `Movie ${i + 1}`,
                    adult: false,
                    overview: `Overview ${i + 1}`,
                    releaseDate: new Date('2020-01-01'),
                }),
            );

            await movieRepository.save(movies);

            // Fetch first page
            const page1Res = await request(app).get('/movies?page=1&pageSize=10');

            expect(page1Res.status).toBe(200);
            expect(page1Res.body.count).toBe(15);
            expect(page1Res.body.results).toHaveLength(10);

            // Fetch second page
            const page2Res = await request(app).get('/movies?page=2&pageSize=10');

            expect(page2Res.status).toBe(200);
            expect(page2Res.body.count).toBe(15);
            expect(page2Res.body.results).toHaveLength(5);
        });

        it('should filter movies by title', async () => {
            // Create movies with different titles
            await movieRepository.save([
                movieRepository.create({
                    title: 'Star Wars',
                    slug: 'star-wars',
                    originalTitle: 'Star Wars',
                    adult: false,
                    overview: 'Space saga',
                    releaseDate: new Date('1977-05-25'),
                }),
                movieRepository.create({
                    title: 'Star Trek',
                    slug: 'star-trek',
                    originalTitle: 'Star Trek',
                    adult: false,
                    overview: 'Space exploration',
                    releaseDate: new Date('2009-05-08'),
                }),
                movieRepository.create({
                    title: 'The Godfather',
                    slug: 'the-godfather',
                    originalTitle: 'The Godfather',
                    adult: false,
                    overview: 'Crime family',
                    releaseDate: new Date('1972-03-24'),
                }),
            ]);

            // Filter by title
            const res = await request(app).get('/movies?title=Star');

            expect(res.status).toBe(200);
            expect(res.body.results.length).toBeGreaterThanOrEqual(2);

            const titles = res.body.results.map((m: Movie) => m.title);
            expect(titles).toContain('Star Wars');
            expect(titles).toContain('Star Trek');
        });
    });
});
