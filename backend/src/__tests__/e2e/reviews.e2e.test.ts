import request from 'supertest';
import { Review } from '../../entities/Review';
import { createTestApp, mockGetReviews } from './setup';

const app = createTestApp();

describe('E2E Tests - Reviews', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Review Operations Flow', () => {
        it('should fetch list of reviews', async () => {
            const mockReviews = [
                {
                    id: 1,
                    review: 'Great movie!',
                    rating: 5,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 2,
                    review: 'Not bad',
                    rating: 3,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ] as Review[];

            mockGetReviews.mockResolvedValue({ reviews: mockReviews, total: 2 });

            const res = await request(app).get('/reviews');

            expect(res.status).toBe(200);
            expect(res.body.count).toBe(2);
            expect(res.body.results).toHaveLength(2);
        });

        it('should handle pagination for reviews', async () => {
            const mockReviews = [
                {
                    id: 1,
                    review: 'Review 1',
                    rating: 5,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ] as Review[];

            mockGetReviews.mockResolvedValue({ reviews: mockReviews, total: 10 });

            const res = await request(app).get('/reviews?page=1&limit=1');

            expect(res.status).toBe(200);
            expect(res.body.count).toBe(10);
            expect(res.body.results).toHaveLength(1);
        });
    });
});
