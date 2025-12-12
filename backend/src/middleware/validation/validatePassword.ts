import { ApiError } from '../../interfaces/ApiError';

export default (password: string): string => {
    if (!password || typeof password !== 'string') {
        throw new ApiError('Password is required and must be a string.', 400);
    }

    if (password.length < 3) {
        throw new ApiError('Password must be at least 3 characters long.', 400);
    }

    if (password.length > 128) {
        throw new ApiError('Password must be less than 128 characters long.', 400);
    }
    return password;
};
