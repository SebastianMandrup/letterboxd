import cors from 'cors';
import csurf from 'csurf';
import express from 'express';
import session from 'express-session';
import { errorHandler, notFoundHandler } from '../middleware/errorHandler';
import dbConnection from './dbConnection';
import setupRouters from './setupRouters';

const init = (app: express.Application) => {
    app.use(express.json()); // Middleware to parse JSON request bodies
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
                httpOnly: true, // prevents JS access
                secure: true, // true if HTTPS
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24, // 1 day
            },
        }),
    );

    app.use(csurf())

    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (err.code === 'EBADCSRFTOKEN') {
            res.status(403).json({ message: 'Invalid CSRF token' });
        } else {
            next(err);
        }
    });
    
    dbConnection(); // Initialize database connection

    setupRouters(app);


    app.use(errorHandler);
    app.use(notFoundHandler);
};

export default init;
