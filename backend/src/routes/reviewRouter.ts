import { Router, Request, Response } from 'express';
import { getReviews } from '../services/reviewService';
import { authenticateUser } from '../middleware/authenticateUser';
import { AppDataSource } from '../startup/data-source';
import { Review } from '../entities/Review';
import { validateReview } from '../middleware/reviewValidation';

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

reviewRouter.post('/', authenticateUser, validateReview, async (req: Request, res: Response) => {
    try {
        const { review, rating, movieId } = req.body;

        const reviewRepository = AppDataSource.getRepository(Review);

        const newReview = reviewRepository.create({
            review,
            rating,
            movie: { id: movieId },
        });

        await reviewRepository.save(newReview);
        res.status(201).send({ message: 'Review created successfully', review: newReview });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

export default reviewRouter;
