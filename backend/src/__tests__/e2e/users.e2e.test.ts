import request from 'supertest';
import { createTestApp, mockGetUsers } from './setup';

const app = createTestApp();

describe('E2E Tests - Users', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('User Management Flow', () => {
        it('should fetch list of users', async () => {
            mockGetUsers.mockResolvedValue({
                users: [
                    {
                        id: 1,
                        username: 'user1',
                    },
                    {
                        id: 2,
                        username: 'user2',
                    },
                ],
                total: 2,
            });

            const res = await request(app).get('/users');

            expect(res.status).toBe(200);
            expect(res.body.count).toBe(2);
        });
    });
});
