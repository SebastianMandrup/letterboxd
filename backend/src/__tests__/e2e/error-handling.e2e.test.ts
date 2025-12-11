import request from 'supertest';
import { createTestApp, mockGetMovies, mockUserCreate, mockUserSave } from './setup';

const app = createTestApp();

describe('E2E Tests - Error Handling', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Error Handling', () => {
        it('should handle database errors gracefully', async () => {
            mockGetMovies.mockRejectedValue(new Error('Database connection failed'));

            const res = await request(app).get('/movies');

            expect(res.status).toBe(500);
            expect(res.body.error.message).toBe('Database connection failed');
        });

        it('should handle invalid request data', async () => {
            mockUserCreate.mockReturnValue({});
            mockUserSave.mockRejectedValue(new Error('Validation failed'));

            const res = await request(app).post('/users').send({
                username: 'a', // Too short
                email: 'invalid-email',
                password: '123', // Too short
            });

            // Should fail validation or return error
            expect([400, 500]).toContain(res.status);
        });
    });
});
