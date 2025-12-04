import request from 'supertest';
import express from 'express';

// Mock repository methods
const mockCount = jest.fn();

// Mock AppDataSource before importing router
jest.mock('../startup/data-source', () => ({
    AppDataSource: {
        getRepository: jest.fn(() => ({
            count: mockCount,
        })),
    },
}));

// Import the router after mocks
import viewRouter from './viewRouter';

const app = express();
app.use(express.json());
app.use('/views', viewRouter);

describe('viewRouter', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return total views', async () => {
        mockCount.mockResolvedValue(42);

        const res = await request(app).get('/views');

        expect(res.status).toBe(200);
        expect(res.body).toBe(42);
        expect(mockCount).toHaveBeenCalled();
    });

    it('should return 500 if repository.count throws an error', async () => {
        mockCount.mockRejectedValue(new Error('DB error'));

        const res = await request(app).get('/views');

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: 'Internal server error' });
    });
});
