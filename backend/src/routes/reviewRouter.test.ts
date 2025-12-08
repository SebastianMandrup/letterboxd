import request from 'supertest';
import express from 'express';

// 1. Create a mock for getReviews
const mockGetReviews = jest.fn();

// 2. Mock AppDataSource before importing router
jest.mock('../startup/data-source', () => ({
    AppDataSource: {
        getRepository: jest.fn(() => ({
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
        })),
    },
}));

// 3. Mock the reviewService module
jest.mock('../services/reviewService', () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getReviews: (...args: any[]) => mockGetReviews(...args),
}));

// 4. Import the router after mocks
import reviewRouter from './reviewRouter';
import { errorHandler } from '../middleware/errorHandler';

const app = express();
app.use(express.json());
app.use('/reviews', reviewRouter);
app.use(errorHandler);

describe('reviewRouter', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return reviews successfully', async () => {
        const reviews = [{ id: 1, content: 'Great movie!' }];
        const total = 1;

        mockGetReviews.mockResolvedValue({ reviews, total });

        const res = await request(app).get('/reviews');

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            count: total,
            results: reviews,
        });
        expect(mockGetReviews).toHaveBeenCalledWith(expect.anything());
    });

    it('should return 500 if getReviews throws an error', async () => {
        mockGetReviews.mockRejectedValue(new Error('Database error'));

        const res = await request(app).get('/reviews');

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: 'Internal server error' });
    });
});
