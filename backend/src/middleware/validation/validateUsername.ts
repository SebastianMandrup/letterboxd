import { ApiError } from '../errorHandler';

export default (username: string): string => {
    if (!username || typeof username !== 'string') {
        throw new ApiError('Username is required and must be a string.', 400);
    }

    const sanitizedUsername = username.trim();

    if (sanitizedUsername.length < 3) {
        throw new ApiError('Username must be at least 3 characters long.', 400);
    }

    if (sanitizedUsername.length > 30) {
        throw new ApiError('Username must be less than 30 characters long.', 400);
    }

    return sanitizedUsername;
};
