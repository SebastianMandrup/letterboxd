import cors from 'cors';
import express, { Application } from 'express';
import session from 'express-session';
import dbConnection from './dbConnection';
import setupRouters from './setupRouters';
import { errorHandler } from '../middleware/errorHandling/errorHandler';
import { notFoundHandler } from '../middleware/errorHandling/notFoundHandler';
import { setupSwagger } from './swagger';
import { initSentry, sentryErrorHandler } from './sentry';
import cookieParser from 'cookie-parser';
import { doubleCsrfProtection } from '../middleware/csrfProtection';
import { getSessionConfig } from './sessionConfig';

const init = async (app: Application) => {
    initSentry();

    app.set('trust proxy', 1);
    app.use(express.json());
    app.use(
        cors({
            origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
            credentials: true,
        }),
    );

    app.use(cookieParser());

    const sessionConfig = await getSessionConfig();
    app.use(session(sessionConfig));

    setupSwagger(app);

    // 🔥 WAIT for DB to finish connecting
    await dbConnection();

    // Apply CSRF protection before routes
    app.use(doubleCsrfProtection);

    setupRouters(app);

    app.use(notFoundHandler);
    app.use(sentryErrorHandler);
    app.use(errorHandler);
};
export default init;
