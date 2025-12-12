import { ApiError } from '../../interfaces/ApiError';

export function normalizeError(error: unknown) {
    if (error instanceof ApiError) {
        return {
            message: error.message,
            stack: error.stack,
            statusCode: error.statusCode,
        };
    }

    if (error instanceof Error) {
        return {
            message: error.message,
            stack: error.stack,
            statusCode: 500,
        };
    }

    return {
        message: String(error),
        statusCode: 500,
    };
}
