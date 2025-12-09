import { Router, Request, Response, NextFunction } from 'express';
import { getReviews } from '../services/reviewService';
import { authenticateUser } from '../middleware/authenticateUser';
import { AppDataSource } from '../startup/data-source';
import { Review } from '../entities/Review';
import { validateReview } from '../middleware/reviewValidation';
import { Movie } from '../entities/Movie';
import { MovieLike } from '../entities/MovieLike';
import { ReviewLike } from '../entities/ReviewLike';

const reviewRouter = Router();

reviewRouter.get('/', async (req: Request, res: Response) => {
    try {
        const { reviews, total } = await getReviews(req);

        const response = {
            count: total,
            results: reviews,
        };
        res.send(response);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

reviewRouter.post('/', authenticateUser, validateReview, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { review, rating, movieId, isLiked } = req.body;

        const movieRepository = AppDataSource.getRepository(Movie);

        const movie = await movieRepository.findOneBy({ id: movieId });

        if (!movie) {
            throw new Error('Movie not found');
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

reviewRouter.post('/:id/like', authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reviewId = parseInt(req.params.id, 10);

        const reviewRepository = AppDataSource.getRepository(Review);
        const review = await reviewRepository.findOneBy({ id: reviewId });

        if (!review) {
            return res.status(404).send({
                status: 'error',
                message: 'Review not found',
            });
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
