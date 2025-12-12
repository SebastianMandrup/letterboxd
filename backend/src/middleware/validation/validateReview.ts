import { ApiError } from '../../interfaces/ApiError';

export default (review: string) => {
    if (typeof review !== 'string' || review.length === 0) {
        throw new ApiError('Review content must be a non-empty string', 400);
    }

    review = review.trim();

    if (review.length < 10) {
        throw new ApiError('Review content must be at least 10 characters long', 400);
    }

    if (review.length > 255) {
        throw new ApiError('Review content must not exceed 5000 characters', 400);
    }

    return review;
};
