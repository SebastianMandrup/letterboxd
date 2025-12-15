import { ApiError } from '../../interfaces/ApiError';

export default (name: string): string => {
    if (typeof name !== 'string') {
        throw new ApiError('List name is required and must be a string.', 400);
    }

    const sanitizedListName = name.trim().toLowerCase();

    if (!sanitizedListName) {
        throw new ApiError('List name is required and must be a string.', 400);
    }

    if (sanitizedListName.length > 254) {
        throw new ApiError('List name must be less than 254 characters long.', 400);
    }

    if (sanitizedListName.includes('-')) {
        throw new ApiError('List name must not contain hyphens (-).', 400);
    }

    return sanitizedListName;
};
