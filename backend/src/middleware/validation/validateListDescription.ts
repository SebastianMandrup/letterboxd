import { ApiError } from '../errorHandler';

export default (description: string): string => {
    const sanitizedDescription = description?.trim();

    if (!sanitizedDescription || typeof sanitizedDescription !== 'string') {
        throw new ApiError('List description is required and must be a string.', 400);
    }

    if (sanitizedDescription.length > 254) {
        throw new ApiError('List description must be less than 254 characters long.', 400);
    }

    return sanitizedDescription;
};
