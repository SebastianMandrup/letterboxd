import request from 'supertest';
import { List } from '../../entities/List';
import { createTestApp, mockGetLists } from './setup';

const app = createTestApp();

describe('E2E Tests - Lists', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('List Operations Flow', () => {
        it('should fetch list of movie lists', async () => {
            const mockLists = [
                {
                    id: 1,
                    name: 'Favorite Movies',
                    description: 'My all-time favorites',
                },
                {
                    id: 2,
                    name: 'To Watch',
                    description: 'Movies I want to watch',
                },
            ] as List[];

            mockGetLists.mockResolvedValue({ lists: mockLists, total: 2 });

            const res = await request(app).get('/lists');

            expect(res.status).toBe(200);
            expect(res.body.count).toBe(2);
            expect(res.body.results).toHaveLength(2);
        });

        it('should handle pagination for lists', async () => {
            const mockLists = [
                {
                    id: 1,
                    name: 'List 1',
                },
            ] as List[];

            mockGetLists.mockResolvedValue({ lists: mockLists, total: 5 });

            const res = await request(app).get('/lists?page=1&limit=1');

            expect(res.status).toBe(200);
            expect(res.body.count).toBe(5);
            expect(res.body.results).toHaveLength(1);
        });
    });
});
