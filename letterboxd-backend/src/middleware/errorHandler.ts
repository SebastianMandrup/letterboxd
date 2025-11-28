import { Request, Response, NextFunction } from "express"; // Add missing imports

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
	console.error("Error:", error);

	const statusCode = error.statusCode || error.status || 500;

	const response = {
		success: false,
		data: null,
		error: {
			message: error.message || "Internal Server Error",
			code: statusCode,
			...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
			...(error.details && { details: error.details })
		}
	};

	res.status(statusCode).json(response); // This should work now
};


export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
	res.status(404).json({
		success: false,
		data: null,
		error: {
			message: "Resource not found",
			code: 404
		}
	});
};