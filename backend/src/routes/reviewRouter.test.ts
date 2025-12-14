import request from 'supertest';
import express from 'express';

// 1. Create mocks
const mockGetReviews = jest.fn();

// Enhanced mocks with all needed methods
const mockReviewRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(), // For review like removal
};

const mockMovieRepository = {
    findOneBy: jest.fn(),
};

const mockMovieLikeRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
};

const mockReviewLikeRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
};

// 2. Mock AppDataSource before importing router
jest.mock('../startup/data-source', () => ({
    AppDataSource: {
        getRepository: jest.fn((entity) => {
            if (entity.name === 'Movie') {
                return mockMovieRepository;
            } else if (entity.name === 'MovieLike') {
                return mockMovieLikeRepository;
            } else if (entity.name === 'ReviewLike') {
                return mockReviewLikeRepository;
            }
            return mockReviewRepository;
        }),
    },
}));

// 3. Mock the reviewService module
jest.mock('../services/reviewService', () => ({
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
import { errorHandler } from '../middleware/errorHandling/errorHandler';

const app = express();
app.use(express.json());
app.use('/reviews', reviewRouter);
app.use(errorHandler);

describe('reviewRouter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

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
        const mockMovie = { id: 1, title: 'Test Movie' };
        const mockReviewData = {
            review: 'This is a great movie!',
            rating: 4.5,
            movieId: 1,
        };

        it('should create a review successfully', async () => {
            const newReview = {
                id: 1,
                ...mockReviewData,
                movie: { id: mockReviewData.movieId },
                author: { id: 1, username: 'testuser' },
            };

            mockMovieRepository.findOneBy.mockResolvedValue(mockMovie);
            mockReviewRepository.findOne.mockResolvedValue(null); // No existing review
            mockReviewRepository.create.mockReturnValue(newReview);
            mockReviewRepository.save.mockResolvedValue(newReview);

            // Mock the second findOne for savedReview with relations
            mockReviewRepository.findOne.mockResolvedValueOnce(null); // First call for existing review
            mockReviewRepository.findOne.mockResolvedValueOnce({
                // Second call for savedReview
                id: newReview.id,
                review: newReview.review,
                rating: newReview.rating,
                author: { id: 1, username: 'testuser' },
            });

            const res = await request(app).post('/reviews').send(mockReviewData);

            expect(res.status).toBe(201);
            expect(res.body).toEqual({
                success: true,
                data: {
                    id: newReview.id,
                    review: newReview.review,
                    rating: newReview.rating,
                    author: {
                        id: 1,
                        username: 'testuser',
                    },
                },
                message: 'Review created successfully',
            });

            expect(mockMovieRepository.findOneBy).toHaveBeenCalledWith({ id: mockReviewData.movieId });
            expect(mockReviewRepository.findOne).toHaveBeenCalledWith({
                where: {
                    movie: { id: mockReviewData.movieId },
                    author: { id: 1 },
                },
                relations: ['author'],
            });
            expect(mockReviewRepository.create).toHaveBeenCalled();
            expect(mockReviewRepository.save).toHaveBeenCalled();
        });

        it('should create a review and like the movie when isLiked is true', async () => {
            const reviewData = {
                ...mockReviewData,
                isLiked: true,
            };

            const newReview = {
                id: 1,
                ...mockReviewData,
                movie: { id: reviewData.movieId },
                author: { id: 1, username: 'testuser' },
            };

            const newLike = {
                id: 1,
                movie: { id: reviewData.movieId },
                user: { id: 1 },
            };

            mockMovieRepository.findOneBy.mockResolvedValue(mockMovie);
            mockReviewRepository.findOne.mockResolvedValue(null);
            mockReviewRepository.create.mockReturnValue(newReview);
            mockReviewRepository.save.mockResolvedValue(newReview);

            // Mock the savedReview findOne
            mockReviewRepository.findOne.mockResolvedValueOnce(null);
            mockReviewRepository.findOne.mockResolvedValueOnce({
                id: newReview.id,
                review: newReview.review,
                rating: newReview.rating,
                author: { id: 1, username: 'testuser' },
            });

            mockMovieLikeRepository.findOne.mockResolvedValue(null); // No existing like
            mockMovieLikeRepository.create.mockReturnValue(newLike);
            mockMovieLikeRepository.save.mockResolvedValue(newLike);

            const res = await request(app).post('/reviews').send(reviewData);

            expect(res.status).toBe(201);
            expect(mockMovieLikeRepository.findOne).toHaveBeenCalledWith({
                where: {
                    movie: { id: reviewData.movieId },
                    user: { id: 1 },
                },
            });
            expect(mockMovieLikeRepository.create).toHaveBeenCalledWith({
                movie: { id: reviewData.movieId },
                user: { id: 1 },
            });
            expect(mockMovieLikeRepository.save).toHaveBeenCalled();
        });

        it('should not create a duplicate like when isLiked is true and like already exists', async () => {
            const reviewData = {
                ...mockReviewData,
                isLiked: true,
            };

            const newReview = {
                id: 1,
                ...mockReviewData,
                movie: { id: reviewData.movieId },
                author: { id: 1, username: 'testuser' },
            };

            const existingLike = {
                id: 1,
                movie: { id: reviewData.movieId },
                user: { id: 1 },
            };

            mockMovieRepository.findOneBy.mockResolvedValue(mockMovie);
            mockReviewRepository.findOne.mockResolvedValue(null);
            mockReviewRepository.create.mockReturnValue(newReview);
            mockReviewRepository.save.mockResolvedValue(newReview);

            // Mock the savedReview findOne
            mockReviewRepository.findOne.mockResolvedValueOnce(null);
            mockReviewRepository.findOne.mockResolvedValueOnce({
                id: newReview.id,
                review: newReview.review,
                rating: newReview.rating,
                author: { id: 1, username: 'testuser' },
            });

            mockMovieLikeRepository.findOne.mockResolvedValue(existingLike); // Like already exists

            const res = await request(app).post('/reviews').send(reviewData);

            expect(res.status).toBe(201);
            expect(mockMovieLikeRepository.findOne).toHaveBeenCalled();
            expect(mockMovieLikeRepository.create).not.toHaveBeenCalled();
            expect(mockMovieLikeRepository.save).not.toHaveBeenCalled();
        });

        it('should not create a like when isLiked is false', async () => {
            const reviewData = {
                ...mockReviewData,
                isLiked: false,
            };

            const newReview = {
                id: 1,
                ...mockReviewData,
                movie: { id: reviewData.movieId },
                author: { id: 1, username: 'testuser' },
            };

            mockMovieRepository.findOneBy.mockResolvedValue(mockMovie);
            mockReviewRepository.findOne.mockResolvedValue(null);
            mockReviewRepository.create.mockReturnValue(newReview);
            mockReviewRepository.save.mockResolvedValue(newReview);

            // Mock the savedReview findOne
            mockReviewRepository.findOne.mockResolvedValueOnce(null);
            mockReviewRepository.findOne.mockResolvedValueOnce({
                id: newReview.id,
                review: newReview.review,
                rating: newReview.rating,
                author: { id: 1, username: 'testuser' },
            });

            const res = await request(app).post('/reviews').send(reviewData);

            expect(res.status).toBe(201);
            expect(mockMovieLikeRepository.create).not.toHaveBeenCalled();
            expect(mockMovieLikeRepository.save).not.toHaveBeenCalled();
        });

        it('should update existing review if review already exists', async () => {
            const existingReview = {
                id: 1,
                review: 'Old review',
                rating: 3.0,
                movie: { id: mockReviewData.movieId },
                author: { id: 1, username: 'testuser' },
            };

            const updatedReview = {
                ...existingReview,
                review: mockReviewData.review,
                rating: mockReviewData.rating,
            };

            mockMovieRepository.findOneBy.mockResolvedValue(mockMovie);
            mockReviewRepository.findOne.mockResolvedValue(existingReview);
            mockReviewRepository.save.mockResolvedValue(updatedReview);

            const res = await request(app).post('/reviews').send(mockReviewData);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                success: true,
                data: {
                    id: existingReview.id,
                    review: mockReviewData.review,
                    rating: mockReviewData.rating,
                    author: {
                        id: 1,
                        username: 'testuser',
                    },
                },
                message: 'Review updated successfully',
            });

            expect(mockReviewRepository.findOne).toHaveBeenCalledWith({
                where: {
                    movie: { id: mockReviewData.movieId },
                    author: { id: 1 },
                },
                relations: ['author'],
            });
            expect(mockReviewRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    review: mockReviewData.review,
                    rating: mockReviewData.rating,
                }),
            );
        });

        it('should handle movie like when updating existing review with isLiked: true', async () => {
            const reviewData = {
                ...mockReviewData,
                isLiked: true,
            };

            const existingReview = {
                id: 1,
                review: 'Old review',
                rating: 3.0,
                movie: { id: mockReviewData.movieId },
                author: { id: 1, username: 'testuser' },
            };

            const updatedReview = {
                ...existingReview,
                review: mockReviewData.review,
                rating: mockReviewData.rating,
            };

            const newLike = {
                id: 1,
                movie: { id: reviewData.movieId },
                user: { id: 1 },
            };

            mockMovieRepository.findOneBy.mockResolvedValue(mockMovie);
            mockReviewRepository.findOne.mockResolvedValue(existingReview);
            mockReviewRepository.save.mockResolvedValue(updatedReview);
            mockMovieLikeRepository.findOne.mockResolvedValue(null); // No existing like
            mockMovieLikeRepository.create.mockReturnValue(newLike);
            mockMovieLikeRepository.save.mockResolvedValue(newLike);

            const res = await request(app).post('/reviews').send(reviewData);

            expect(res.status).toBe(200);
            expect(mockMovieLikeRepository.findOne).toHaveBeenCalled();
            expect(mockMovieLikeRepository.create).toHaveBeenCalled();
            expect(mockMovieLikeRepository.save).toHaveBeenCalled();
        });

        it('should return an error if movie not found', async () => {
            mockMovieRepository.findOneBy.mockResolvedValue(null);

            const res = await request(app).post('/reviews').send(mockReviewData);

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
            mockMovieRepository.findOneBy.mockResolvedValue(mockMovie);
            mockReviewRepository.findOne.mockResolvedValue(null);
            mockReviewRepository.create.mockReturnValue({});
            mockReviewRepository.save.mockRejectedValue(new Error('Database error'));

            const res = await request(app).post('/reviews').send(mockReviewData);

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });

        it('should handle error when retrieving saved review fails', async () => {
            const newReview = {
                id: 1,
                ...mockReviewData,
                movie: { id: mockReviewData.movieId },
                author: { id: 1, username: 'testuser' },
            };

            mockMovieRepository.findOneBy.mockResolvedValue(mockMovie);
            mockReviewRepository.findOne.mockResolvedValue(null);
            mockReviewRepository.create.mockReturnValue(newReview);
            mockReviewRepository.save.mockResolvedValue(newReview);

            // Mock the savedReview findOne to return null
            mockReviewRepository.findOne.mockResolvedValueOnce(null); // First call for existing review
            mockReviewRepository.findOne.mockResolvedValueOnce(null); // Second call for savedReview - returns null

            const res = await request(app).post('/reviews').send(mockReviewData);

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
            expect(res.body.error.message).toBe('Error retrieving saved review');
        });

        it('should not fail when movie like creation fails but review succeeds', async () => {
            const reviewData = {
                ...mockReviewData,
                isLiked: true,
            };

            const newReview = {
                id: 1,
                ...mockReviewData,
                movie: { id: reviewData.movieId },
                author: { id: 1, username: 'testuser' },
            };

            mockMovieRepository.findOneBy.mockResolvedValue(mockMovie);
            mockReviewRepository.findOne.mockResolvedValue(null);
            mockReviewRepository.create.mockReturnValue(newReview);
            mockReviewRepository.save.mockResolvedValue(newReview);

            // Mock the savedReview findOne
            mockReviewRepository.findOne.mockResolvedValueOnce(null);
            mockReviewRepository.findOne.mockResolvedValueOnce({
                id: newReview.id,
                review: newReview.review,
                rating: newReview.rating,
                author: { id: 1, username: 'testuser' },
            });

            mockMovieLikeRepository.findOne.mockResolvedValue(null);
            mockMovieLikeRepository.create.mockReturnValue({});
            mockMovieLikeRepository.save.mockRejectedValue(new Error('Like save failed'));

            const res = await request(app).post('/reviews').send(reviewData);

            // Review should still be created successfully even if like fails
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Review created successfully');
        });
    });

    describe('POST /:id/like', () => {
        const mockReview = { id: 1, review: 'Test review', rating: 4.5 };

        it('should like a review successfully', async () => {
            mockReviewRepository.findOneBy.mockResolvedValue(mockReview);
            mockReviewLikeRepository.findOne.mockResolvedValue(null); // No existing like
            mockReviewLikeRepository.create.mockReturnValue({ id: 1 });
            mockReviewLikeRepository.save.mockResolvedValue({ id: 1 });

            const res = await request(app).post('/reviews/1/like');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                status: 'ok',
                message: 'Review liked successfully',
            });
            expect(mockReviewRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
            expect(mockReviewLikeRepository.findOne).toHaveBeenCalledWith({
                where: {
                    review: { id: 1 },
                    user: { id: 1 },
                },
            });
            expect(mockReviewLikeRepository.create).toHaveBeenCalled();
            expect(mockReviewLikeRepository.save).toHaveBeenCalled();
        });

        it('should unlike a review when already liked', async () => {
            const existingLike = {
                id: 1,
                review: { id: 1 },
                user: { id: 1 },
            };

            mockReviewRepository.findOneBy.mockResolvedValue(mockReview);
            mockReviewLikeRepository.findOne.mockResolvedValue(existingLike);
            mockReviewLikeRepository.remove.mockResolvedValue({});

            const res = await request(app).post('/reviews/1/like');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                status: 'ok',
                message: 'Review unliked successfully',
            });
            expect(mockReviewLikeRepository.findOne).toHaveBeenCalled();
            expect(mockReviewLikeRepository.remove).toHaveBeenCalledWith(existingLike);
        });

        it('should return 404 if review not found', async () => {
            mockReviewRepository.findOneBy.mockResolvedValue(null);

            const res = await request(app).post('/reviews/999/like');

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.error.message).toBe('Review not found');
        });

        it('should handle errors during review like', async () => {
            mockReviewRepository.findOneBy.mockResolvedValue(mockReview);
            mockReviewLikeRepository.findOne.mockRejectedValue(new Error('Database error'));

            const res = await request(app).post('/reviews/1/like');

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });

        it('should handle errors during review unlike', async () => {
            const existingLike = {
                id: 1,
                review: { id: 1 },
                user: { id: 1 },
            };

            mockReviewRepository.findOneBy.mockResolvedValue(mockReview);
            mockReviewLikeRepository.findOne.mockResolvedValue(existingLike);
            mockReviewLikeRepository.remove.mockRejectedValue(new Error('Database error'));

            const res = await request(app).post('/reviews/1/like');

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });
});
