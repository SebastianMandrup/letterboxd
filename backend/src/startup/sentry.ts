import * as Sentry from '@sentry/node';
import { Request, Response, NextFunction } from 'express';

// Initialize Sentry
export const initSentry = (): void => {
    if (!process.env.SENTRY_DSN) {
        console.log('Sentry DSN not found, skipping Sentry initialization');
        return;
    }

    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        tracesSampleRate: 1.0,
        environment: process.env.NODE_ENV || 'development',
    });
};

// Simple error handler function
export const logErrorToSentry = (error: Error): void => {
    if (process.env.SENTRY_DSN) {
        Sentry.captureException(error);
    }
};

// Error middleware - MUST be defined as 4-parameter function
export const sentryErrorHandler = (error: Error, _req: Request, _res: Response, next: NextFunction): void => {
    logErrorToSentry(error);
    next(error);
};
