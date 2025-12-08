import express from 'express';
import session from 'express-session';
import { TestDataSource } from '../../startup/data-source.test';
import authRouter from '../../routes/authRouter';
import userRouter from '../../routes/userRouter';
import movieRouter from '../../routes/movieRouter';
import reviewRouter from '../../routes/reviewRouter';
import listRouter from '../../routes/listRouter';
import { errorHandler, notFoundHandler } from '../../middleware/errorHandler';

// Initialize test database
export const initTestDb = async () => {
    if (!TestDataSource.isInitialized) {
        await TestDataSource.initialize();
    }
    return TestDataSource;
};

// Clean up test database
export const cleanupTestDb = async () => {
    if (TestDataSource.isInitialized) {
        await TestDataSource.destroy();
    }
};

// Clear all data from database
export const clearDatabase = async () => {
    const entities = TestDataSource.entityMetadatas;
    for (const entity of entities) {
        const repository = TestDataSource.getRepository(entity.name);
        await repository.clear();
    }
};

// Create Express app with real routes and services
export const createIntegrationTestApp = () => {
    const app = express();
    app.use(express.json());
    app.use(
        session({
            secret: 'test-secret',
            resave: false,
            saveUninitialized: false,
        }),
    );

    // Mount routers
    app.use('/auth', authRouter);
    app.use('/users', userRouter);
    app.use('/movies', movieRouter);
    app.use('/reviews', reviewRouter);
    app.use('/lists', listRouter);

    // Add error handlers (must be after routes)
    app.use(errorHandler);
    app.use(notFoundHandler);

    return app;
};
