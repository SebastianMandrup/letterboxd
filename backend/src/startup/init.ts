import cors from 'cors';
import express from 'express';
import session from 'express-session';
import dbConnection from './dbConnection';
import setupRouters from './setupRouters';
import { errorHandler, notFoundHandler } from '../middleware/errorHandler';

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
        secure: false, // true if HTTPS
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      },
    }),
  );

  dbConnection(); // Initialize database connection

  setupRouters(app);

  app.use(errorHandler);
  app.use(notFoundHandler);
};

export default init;
