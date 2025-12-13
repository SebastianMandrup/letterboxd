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

const init = async (app: Application) => {
    initSentry();

    app.use(express.json());
    app.use(
        cors({
            origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
            credentials: true,
        }),
    );

    app.use(cookieParser());

    app.use(
        session({
            secret: process.env.SESSION_SECRET || 'secretdevkey',
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: false,
                maxAge: 1000 * 60 * 60 * 24,
            },
        }),
    );

    setupSwagger(app);

    // 🔥 WAIT for DB to finish connecting
    await dbConnection();

    setupRouters(app);

    app.use(notFoundHandler);
    app.use(sentryErrorHandler);
    app.use(errorHandler);
};
export default init;
