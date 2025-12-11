import { ApiError } from '../../interfaces/ApiError';

export default (email: string): string => {
    const sanitizedEmail = email?.trim().toLowerCase();

    if (!sanitizedEmail || typeof sanitizedEmail !== 'string') {
        throw new ApiError('Email is required and must be a string.', 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
        throw new ApiError('Invalid email format.', 400);
    }

    if (sanitizedEmail.length > 254) {
        throw new ApiError('Email must be less than 254 characters long.', 400);
    }

    return sanitizedEmail;
};
