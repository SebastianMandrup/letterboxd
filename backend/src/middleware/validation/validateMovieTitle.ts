import { ApiError } from '../../interfaces/ApiError';

export default (title: string): string => {
    const sanitizedTitle = title?.trim();

    if (!sanitizedTitle || typeof sanitizedTitle !== 'string') {
        throw new ApiError('Movie title is required and must be a string.', 400);
    }

    return sanitizedTitle
        .toLowerCase()
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};
