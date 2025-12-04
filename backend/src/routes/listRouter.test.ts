import request from 'supertest';
import express from 'express';

// 1. Mock dependencies
const mockGetLists = jest.fn();
const mockBuildPaginatedResponse = jest.fn();

jest.mock('../services/listService', () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getLists: (...args: any[]) => mockGetLists(...args),
}));

jest.mock(
    './helper/buildPaginatedResponse',
    () =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (...args: any[]) =>
            mockBuildPaginatedResponse(...args),
);

// 2. Import router after mocks
import listRouter from './listRouter';

const app = express();
app.use(express.json());
app.use('/lists', listRouter);

describe('listRouter', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return paginated lists successfully', async () => {
        const lists = [{ id: 1, name: 'List 1' }];
        const total = 1;
        const paginatedResponse = { data: lists, total };

        mockGetLists.mockResolvedValue({ lists, total });
        mockBuildPaginatedResponse.mockReturnValue(paginatedResponse);

        const res = await request(app).get('/lists');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(paginatedResponse);
        expect(mockGetLists).toHaveBeenCalled();
        expect(mockBuildPaginatedResponse).toHaveBeenCalledWith(lists, total, expect.anything());
    });

    it('should return 500 if getLists throws an error', async () => {
        mockGetLists.mockRejectedValue(new Error('Database error'));

        const res = await request(app).get('/lists');

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: 'Internal server error' });
    });
});
