import express from 'express';
import session from 'express-session';
import { User } from '../../entities/User';

// Mock auth middleware
export const mockAuthenticateUser = jest.fn();

// Mock user repository functions
export const mockUserFindOne = jest.fn();
export const mockUserCreate = jest.fn();
export const mockUserSave = jest.fn();

// Mock service functions
export const mockGetMovies = jest.fn();
export const mockGetMovieBySlug = jest.fn();
export const mockDeleteMovieById = jest.fn();
export const mockGetReviews = jest.fn();
export const mockGetLists = jest.fn();
export const mockGetUsers = jest.fn();

// Mock bcrypt functions
export const mockBcryptHash = jest.fn();
export const mockBcryptCompare = jest.fn();

// Mock AppDataSource - only for auth/user routes that use it directly
jest.mock('../../startup/data-source', () => ({
    AppDataSource: {
        getRepository: jest.fn((entity) => {
            if (entity === User) {
                return {
                    findOne: mockUserFindOne,
                    create: mockUserCreate,
                    save: mockUserSave,
                };
            }
            return {};
        }),
    },
}));

// Mock bcrypt
jest.mock('bcrypt', () => ({
    compare: mockBcryptCompare,
    hash: mockBcryptHash,
}));

// Mock movie service
jest.mock('../../services/movies/movieService', () => ({
    getMovies: mockGetMovies,
    getMovieBySlug: mockGetMovieBySlug,
    deleteMovieById: mockDeleteMovieById,
}));

// Mock review service
jest.mock('../../services/reviewService', () => ({
    getReviews: mockGetReviews,
}));

// Mock list service
jest.mock('../../services/listService', () => ({
    getLists: mockGetLists,
}));

// Mock user service
jest.mock('../../services/userService', () => ({
    getUsers: mockGetUsers,
}));

// Import routers after mocks
import authRouter from '../../routes/authRouter';
import userRouter from '../../routes/userRouter';
import movieRouter from '../../routes/movieRouter';
import reviewRouter from '../../routes/reviewRouter';
import listRouter from '../../routes/listRouter';
import { errorHandler } from '../../middleware/errorHandler';

// Setup Express app similar to the real app
export const createTestApp = () => {
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
    
    // Add error handler as the last middleware
    app.use(errorHandler);

    return app;
};
