import { Request, Response, NextFunction } from 'express';
import validateId from './validation/validateId';
import validateRating from './validation/validateRating';
import validateReviewText from './validation/validateReview';

export const validateReview = (req: Request, res: Response, next: NextFunction) => {
    try {
        let { movieId, review, rating } = req.body;

        movieId = validateId(movieId);
        review = validateReviewText(review);
        rating = validateRating(rating);
        req.body.movieId = movieId;
        req.body.review = review;
        req.body.rating = rating;
        next();
    } catch (error) {
        next(error);
    }
};
