import { ApiError } from '../errorHandler';

export default (rating: number) => {
    if (typeof rating !== 'number' || isNaN(rating)) {
        throw new ApiError('Rating must be a number', 400);
    }

    if (rating % 0.5 !== 0) {
        throw new ApiError('Rating must be in increments of 0.5', 400);
    }

    if (rating < 0 || rating > 5) {
        throw new ApiError('Rating must be between 0 and 5', 400);
    }

    return rating;
};
