import { MuoError } from '../errorHandler';

export default (review: string) => {
    if (typeof review !== 'string' || review.length === 0) {
        throw new Error('Review content must be a non-empty string');
    }

    review = review.trim();

    if (review.length < 10) {
        throw new MuoError('Review content must be at least 10 characters long', 400);
    }

    if (review.length > 255) {
        throw new MuoError('Review content must not exceed 5000 characters', 400);
    }

    return review;
};
