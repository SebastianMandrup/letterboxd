import request from 'supertest';
import express from 'express';

// 1. Create mocks
const mockGetReviews = jest.fn();
const mockReviewRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
};
const mockMovieRepository = {
    findOneBy: jest.fn(),
};
const mockMovieLikeRepository = {
    create: jest.fn(),
    save: jest.fn(),
};

// 2. Mock AppDataSource before importing router
jest.mock('../startup/data-source', () => ({
    AppDataSource: {
        getRepository: jest.fn((entity) => {
            if (entity.name === 'Movie') {
                return mockMovieRepository;
            } else if (entity.name === 'MovieLike') {
                return mockMovieLikeRepository;
            }
            return mockReviewRepository;
        }),
    },
}));

// 3. Mock the reviewService module
jest.mock('../services/reviewService', () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getReviews: (...args: any[]) => mockGetReviews(...args),
}));

// 4. Mock authentication middleware
jest.mock('../middleware/authenticateUser', () => ({
    authenticateUser: (req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = { id: 1, username: 'testuser', email: 'test@example.com' };
        next();
    },
}));

// 5. Mock validation middleware
jest.mock('../middleware/reviewValidation', () => ({
    validateReview: (req: express.Request, res: express.Response, next: express.NextFunction) => {
        next();
    },
}));

// 6. Import the router after mocks
import reviewRouter from './reviewRouter';
import { errorHandler } from '../middleware/errorHandler';

const app = express();
app.use(express.json());
app.use('/reviews', reviewRouter);
app.use(errorHandler);

describe('reviewRouter', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /', () => {
        it('should return reviews successfully', async () => {
            const reviews = [{ id: 1, content: 'Great movie!' }];
            const total = 1;

            mockGetReviews.mockResolvedValue({ reviews, total });

            const res = await request(app).get('/reviews');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                count: total,
                results: reviews,
            });
            expect(mockGetReviews).toHaveBeenCalledWith(expect.anything());
        });

        it('should return 500 if getReviews throws an error', async () => {
            mockGetReviews.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/reviews');

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

    describe('POST /', () => {
        it('should create a review successfully', async () => {
            const reviewData = {
                review: 'This is a great movie!',
                rating: 4.5,
                movieId: 1,
            };

            const movie = { id: 1, title: 'Test Movie' };
            const newReview = {
                id: 1,
                review: reviewData.review,
                rating: reviewData.rating,
                movie: { id: reviewData.movieId },
                author: { id: 1 },
            };

            mockMovieRepository.findOneBy.mockResolvedValue(movie);
            mockReviewRepository.create.mockReturnValue(newReview);
            mockReviewRepository.save.mockResolvedValue(newReview);

            const res = await request(app).post('/reviews').send(reviewData);

            expect(res.status).toBe(201);
            expect(res.body.message).toBe('Review created successfully');
            expect(res.body.review).toEqual(newReview);
            expect(mockMovieRepository.findOneBy).toHaveBeenCalledWith({ id: reviewData.movieId });
            expect(mockReviewRepository.create).toHaveBeenCalled();
            expect(mockReviewRepository.save).toHaveBeenCalled();
        });

        it('should create a review and like the movie when isLiked is true', async () => {
            const reviewData = {
                review: 'This is a great movie!',
                rating: 4.5,
                movieId: 1,
                isLiked: true,
            };

            const movie = { id: 1, title: 'Test Movie' };
            const newReview = {
                id: 1,
                review: reviewData.review,
                rating: reviewData.rating,
                movie: { id: reviewData.movieId },
                author: { id: 1 },
            };
            const newLike = {
                id: 1,
                movie: { id: reviewData.movieId },
                user: { id: 1 },
            };

            mockMovieRepository.findOneBy.mockResolvedValue(movie);
            mockReviewRepository.create.mockReturnValue(newReview);
            mockReviewRepository.save.mockResolvedValue(newReview);
            mockMovieLikeRepository.create.mockReturnValue(newLike);
            mockMovieLikeRepository.save.mockResolvedValue(newLike);

            const res = await request(app).post('/reviews').send(reviewData);

            expect(res.status).toBe(201);
            expect(mockMovieLikeRepository.create).toHaveBeenCalledWith({
                movie: { id: reviewData.movieId },
                user: { id: 1 },
            });
            expect(mockMovieLikeRepository.save).toHaveBeenCalled();
        });

        it('should not create a like when isLiked is false', async () => {
            const reviewData = {
                review: 'This is a great movie!',
                rating: 4.5,
                movieId: 1,
                isLiked: false,
            };

            const movie = { id: 1, title: 'Test Movie' };
            const newReview = {
                id: 1,
                review: reviewData.review,
                rating: reviewData.rating,
                movie: { id: reviewData.movieId },
                author: { id: 1 },
            };

            mockMovieRepository.findOneBy.mockResolvedValue(movie);
            mockReviewRepository.create.mockReturnValue(newReview);
            mockReviewRepository.save.mockResolvedValue(newReview);

            const res = await request(app).post('/reviews').send(reviewData);

            expect(res.status).toBe(201);
            expect(mockMovieLikeRepository.create).not.toHaveBeenCalled();
            expect(mockMovieLikeRepository.save).not.toHaveBeenCalled();
        });

        it('should return an error if movie not found', async () => {
            const reviewData = {
                review: 'This is a great movie!',
                rating: 4.5,
                movieId: 999,
            };

            mockMovieRepository.findOneBy.mockResolvedValue(null);

            const res = await request(app).post('/reviews').send(reviewData);

            expect(res.status).toBe(404);
            expect(res.body).toEqual({
                success: false,
                data: null,
                error: {
                    message: 'Movie not found',
                    code: 404,
                },
            });
        });

        it('should handle errors during review creation', async () => {
            const reviewData = {
                review: 'This is a great movie!',
                rating: 4.5,
                movieId: 1,
            };

            const movie = { id: 1, title: 'Test Movie' };

            mockMovieRepository.findOneBy.mockResolvedValue(movie);
            mockReviewRepository.create.mockReturnValue({});
            mockReviewRepository.save.mockRejectedValue(new Error('Database error'));

            const res = await request(app).post('/reviews').send(reviewData);

            expect(res.status).toBe(500);
        });
    });
});
