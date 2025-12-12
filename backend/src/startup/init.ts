import cors from 'cors';
import express from 'express';
import session from 'express-session';
import dbConnection from './dbConnection';
import setupRouters from './setupRouters';
import { errorHandler } from '../middleware/errorHandling/errorHandler';
import { notFoundHandler } from '../middleware/errorHandling/notFoundHandler';

const init = async (app: express.Application) => {
    app.use(express.json());
    app.use(
        cors({
            origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
            credentials: true,
        }),
    );

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

    // 🔥 WAIT for DB to finish connecting
    await dbConnection();

    setupRouters(app);

    app.use(notFoundHandler);
    app.use(errorHandler);
};
export default init;
