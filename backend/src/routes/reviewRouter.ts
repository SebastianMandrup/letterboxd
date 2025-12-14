import { Router, Request, Response, NextFunction } from 'express';
import { getReviews } from '../services/reviewService';
import { authenticateUser } from '../middleware/authenticateUser';
import { AppDataSource } from '../startup/data-source';
import { Review } from '../entities/Review';
import { validateReview } from '../middleware/reviewValidation';
import { Movie } from '../entities/Movie';
import { MovieLike } from '../entities/MovieLike';
import { ReviewLike } from '../entities/ReviewLike';
import { ApiError } from '../interfaces/ApiError';

const reviewRouter = Router();

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: List of reviews
 */
reviewRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { reviews, total } = await getReviews(req);

        const response = {
            count: total,
            results: reviews,
        };
        res.send(response);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        next(error);
    }
});

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     security:
 *       - session: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               review:
 *                 type: string
 *               rating:
 *                 type: number
 *               movieId:
 *                 type: integer
 *               isLiked:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Review created
 *       404:
 *         description: Movie not found
 *       401:
 *         description: Unauthorized
 */
reviewRouter.post('/', authenticateUser, validateReview, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { review, rating, movieId, isLiked } = req.body;
        const userId = req.user.id;

        const movieRepository = AppDataSource.getRepository(Movie);
        const reviewRepository = AppDataSource.getRepository(Review);
        const movieLikeRepository = AppDataSource.getRepository(MovieLike);

        // Check if movie exists
        const movie = await movieRepository.findOneBy({ id: movieId });
        if (!movie) {
            return res.status(404).json({
                success: false,
                data: null,
                error: {
                    message: 'Movie not found',
                    code: 404,
                },
            });
        }

        // Handle movie like if isLiked is true
        if (isLiked === true) {
            try {
                const existingLike = await movieLikeRepository.findOne({
                    where: {
                        movie: { id: movieId },
                        user: { id: userId },
                    },
                });

                if (!existingLike) {
                    const newLike = movieLikeRepository.create({
                        movie: { id: movieId },
                        user: { id: userId },
                    });
                    await movieLikeRepository.save(newLike);
                }
            } catch (likeError) {
                console.error('Error saving movie like:', likeError);
            }
        }

        // Check for existing review - REMOVE the select clause
        const existingReview = await reviewRepository.findOne({
            where: {
                movie: { id: movieId },
                author: { id: userId },
            },
            relations: ['author'], // Add this to load the author relation
        });

        if (existingReview) {
            // Update existing review
            existingReview.review = review;
            existingReview.rating = rating;
            await reviewRepository.save(existingReview);

            const reviewDTO = {
                id: existingReview.id,
                review: existingReview.review,
                rating: existingReview.rating,
                author: {
                    id: existingReview.author.id,
                    username: existingReview.author.username,
                },
            };

            return res.status(200).json({
                success: true,
                data: reviewDTO,
                message: 'Review updated successfully',
            });
        }

        // Create new review
        const newReview = reviewRepository.create({
            review,
            rating,
            movie: { id: movieId },
            author: { id: userId },
        });

        await reviewRepository.save(newReview);

        // For new reviews, you might need to fetch with author relation
        const savedReview = await reviewRepository.findOne({
            where: { id: newReview.id },
            relations: ['author'],
        });

        if (!savedReview) {
            throw new ApiError('Error retrieving saved review', 500);
        }

        const reviewDTO = {
            id: savedReview.id,
            review: savedReview.review,
            rating: savedReview.rating,
            author: {
                id: savedReview.author.id,
                username: savedReview.author.username,
            },
        };

        return res.status(201).json({
            success: true,
            data: reviewDTO,
            message: 'Review created successfully',
        });
    } catch (error) {
        next(error);
    }
});

reviewRouter.delete('/:id', authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviewId = parseInt(req.params.id, 10);
        const userId = req.user.id;

        const reviewRepository = AppDataSource.getRepository(Review);
        const review = await reviewRepository.findOne({
            where: { id: reviewId },
            relations: ['author'],
        });

        if (!review) {
            throw new ApiError('Review not found', 404);
        }

        if (review.author.id !== userId) {
            throw new ApiError('Unauthorized to delete this review', 403);
        }

        await reviewRepository.remove(review);

        res.status(200).send({
            status: 'ok',
            message: 'Review deleted successfully',
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /reviews/{id}/like:
 *   post:
 *     summary: Toggle like on a review
 *     tags: [Reviews]
 *     security:
 *       - session: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Review like toggled
 *       404:
 *         description: Review not found
 *       401:
 *         description: Unauthorized
 */
reviewRouter.post('/:id/like', authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviewId = parseInt(req.params.id, 10);

        const reviewRepository = AppDataSource.getRepository(Review);
        const review = await reviewRepository.findOneBy({ id: reviewId });

        if (!review) {
            throw new ApiError('Review not found', 404);
        }

        const reviewLikeRepository = AppDataSource.getRepository(ReviewLike);

        const existingLike = await reviewLikeRepository.findOne({
            where: {
                review: { id: reviewId },
                user: { id: req.user.id },
            },
        });

        if (existingLike) {
            await reviewLikeRepository.remove(existingLike);
            return res.status(200).send({
                status: 'ok',
                message: 'Review unliked successfully',
            });
        }

        const newLike = reviewLikeRepository.create({
            review: { id: reviewId },
            user: { id: req.user.id },
        });

        await reviewLikeRepository.save(newLike);

        res.status(200).send({
            status: 'ok',
            message: 'Review liked successfully',
        });
    } catch (error) {
        next(error);
    }
});

export default reviewRouter;
