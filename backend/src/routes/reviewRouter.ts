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

        const movieRepository = AppDataSource.getRepository(Movie);

        const movie = await movieRepository.findOneBy({ id: movieId });

        if (!movie) {
            throw new ApiError('Movie not found', 404);
        }

        const reviewRepository = AppDataSource.getRepository(Review);

        const newReview = reviewRepository.create({
            review,
            rating,
            movie: { id: movieId },
            author: { id: req.user.id },
        });

        await reviewRepository.save(newReview);

        if (isLiked === true) {
            const movieLikeRepository = AppDataSource.getRepository(MovieLike);
            const newLike = movieLikeRepository.create({
                movie: { id: movieId },
                user: { id: req.user.id },
            });
            await movieLikeRepository.save(newLike);
        }

        res.status(201).send({ message: 'Review created successfully', review: newReview });
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
