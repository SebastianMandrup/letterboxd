import { ApiError } from '../../interfaces/ApiError';

export default (movieIds: number[]): number[] => {
    if (!Array.isArray(movieIds)) {
        throw new ApiError('List movie IDs are required and must be an array.', 400);
    }

    if (movieIds.length < 5) {
        throw new ApiError('List movie IDs must contain at least 5 items.', 400);
    }

    if (movieIds.length > 40) {
        throw new ApiError('List movie IDs must contain 40 or fewer items.', 400);
    }

    return movieIds;
};
