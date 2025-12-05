import request from 'supertest';
import bcrypt from 'bcrypt';
import { Express } from 'express';
import { TestDataSource } from '../../startup/data-source.test';
import { Review } from '../../entities/Review';
import { Movie } from '../../entities/Movie';
import { User } from '../../entities/User';
import { initTestDb, cleanupTestDb, clearDatabase, createIntegrationTestApp } from './setup';

// Mock AppDataSource to use TestDataSource
jest.mock('../../startup/data-source', () => ({
    AppDataSource: TestDataSource,
}));

describe('Integration Tests - Reviews', () => {
    let app: Express;
    let reviewRepository: ReturnType<typeof TestDataSource.getRepository<Review>>;
    let movieRepository: ReturnType<typeof TestDataSource.getRepository<Movie>>;
    let userRepository: ReturnType<typeof TestDataSource.getRepository<User>>;

    beforeAll(async () => {
        await initTestDb();
        app = createIntegrationTestApp();
        reviewRepository = TestDataSource.getRepository(Review);
        movieRepository = TestDataSource.getRepository(Movie);
        userRepository = TestDataSource.getRepository(User);
    });

    afterAll(async () => {
        await cleanupTestDb();
    });

    beforeEach(async () => {
        await clearDatabase();
    });

    describe('Review Operations', () => {
        it('should fetch list of reviews from database', async () => {
            // Create test data
            const user = userRepository.create({
                username: 'reviewer',
                email: 'reviewer@example.com',
                password: await bcrypt.hash('password', 10),
                role: 'user',
            });
            await userRepository.save(user);

            const movie1 = movieRepository.create({
                title: 'Test Movie 1',
                slug: 'test-movie-1',
                originalTitle: 'Test Movie 1',
                adult: false,
                overview: 'A test movie',
                releaseDate: new Date('2020-01-01'),
            });

            const movie2 = movieRepository.create({
                title: 'Test Movie 2',
                slug: 'test-movie-2',
                originalTitle: 'Test Movie 2',
                adult: false,
                overview: 'Another test movie',
                releaseDate: new Date('2020-02-01'),
            });

            await movieRepository.save([movie1, movie2]);

            // Create reviews (different movies to avoid unique constraint)
            const review1 = reviewRepository.create({
                review: 'Great movie!',
                rating: 5,
                author: user,
                movie: movie1,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const review2 = reviewRepository.create({
                review: 'Not bad',
                rating: 3,
                author: user,
                movie: movie2,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            await reviewRepository.save([review1, review2]);

            // Fetch reviews via API
            const res = await request(app).get('/reviews');

            expect(res.status).toBe(200);
            expect(res.body.count).toBe(2);
            expect(res.body.results).toHaveLength(2);
        });

        it('should handle pagination for reviews', async () => {
            // Create test user
            const user = userRepository.create({
                username: 'reviewer',
                email: 'reviewer@example.com',
                password: await bcrypt.hash('password', 10),
                role: 'user',
            });
            await userRepository.save(user);

            // Create multiple movies (one per review to avoid unique constraint)
            const movies = Array.from({ length: 15 }, (_, i) =>
                movieRepository.create({
                    title: `Test Movie ${i + 1}`,
                    slug: `test-movie-${i + 1}`,
                    originalTitle: `Test Movie ${i + 1}`,
                    adult: false,
                    overview: 'A test movie',
                    releaseDate: new Date('2020-01-01'),
                }),
            );
            await movieRepository.save(movies);

            // Create multiple reviews
            const reviews = movies.map((movie, i) =>
                reviewRepository.create({
                    review: `Review ${i + 1}`,
                    rating: 4,
                    author: user,
                    movie: movie,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }),
            );

            await reviewRepository.save(reviews);

            // Fetch first page
            const page1Res = await request(app).get('/reviews?page=1&pageSize=10');

            expect(page1Res.status).toBe(200);
            expect(page1Res.body.count).toBe(15);
            expect(page1Res.body.results).toHaveLength(10);

            // Fetch second page
            const page2Res = await request(app).get('/reviews?page=2&pageSize=10');

            expect(page2Res.status).toBe(200);
            expect(page2Res.body.count).toBe(15);
            expect(page2Res.body.results).toHaveLength(5);
        });

        it('should include movie and author information in reviews', async () => {
            // Create test data
            const user = userRepository.create({
                username: 'testauthor',
                email: 'author@example.com',
                password: await bcrypt.hash('password', 10),
                role: 'user',
            });
            await userRepository.save(user);

            const movie = movieRepository.create({
                title: 'Featured Movie',
                slug: 'featured-movie',
                originalTitle: 'Featured Movie',
                adult: false,
                overview: 'A featured movie',
                releaseDate: new Date('2021-01-01'),
            });
            await movieRepository.save(movie);

            const review = reviewRepository.create({
                review: 'Amazing film!',
                rating: 5,
                author: user,
                movie: movie,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            await reviewRepository.save(review);

            // Fetch reviews
            const res = await request(app).get('/reviews');

            expect(res.status).toBe(200);
            expect(res.body.results).toHaveLength(1);

            const reviewData = res.body.results[0];
            expect(reviewData.review).toBe('Amazing film!');
            expect(reviewData.rating).toBe(5);

            // Verify author info is included
            expect(reviewData.author).toBeDefined();
            expect(reviewData.author.username).toBe('testauthor');

            // Verify movie info is included
            expect(reviewData.movie).toBeDefined();
            expect(reviewData.movie.title).toBe('Featured Movie');
        });
    });
});
