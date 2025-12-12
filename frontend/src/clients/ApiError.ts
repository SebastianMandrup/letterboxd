export class ApiError extends Error {
    status?: number;
    statusCode?: number;
    stack?: string;
}
