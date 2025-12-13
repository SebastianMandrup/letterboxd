import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { Express } from 'express';

export const initSentry = (app: Express): void => {
    // Only initialize Sentry if DSN is provided
    if (process.env.SENTRY_DSN) {
        Sentry.init({
            dsn: process.env.SENTRY_DSN,
            integrations: [
                // enable HTTP calls tracing
                new Sentry.Integrations.Http({ tracing: true }),
                // enable Express.js middleware tracing
                new Sentry.Integrations.Express({ app }),
                nodeProfilingIntegration(),
            ],
            // Performance Monitoring
            tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
            // Set sampling rate for profiling
            profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
            environment: process.env.NODE_ENV || 'development',
        });

        // The request handler must be the first middleware on the app
        app.use(Sentry.Handlers.requestHandler());

        // TracingHandler creates a trace for every incoming request
        app.use(Sentry.Handlers.tracingHandler());
    }
};

export const sentryErrorHandler = () => {
    if (process.env.SENTRY_DSN) {
        // The error handler must be registered before any other error middleware and after all controllers
        return Sentry.Handlers.errorHandler();
    }
    // Return no-op middleware if Sentry is not configured
    return (req: any, res: any, next: any) => next();
};

export { Sentry };
