import request from 'supertest';
import express from 'express';

// 1. Create mocks
const mockGetLists = jest.fn();
const mockListRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
};
const mockCommentRepository = {
    create: jest.fn(),
    save: jest.fn(),
};

// 2. Mock AppDataSource before importing router
jest.mock('../startup/data-source', () => ({
    AppDataSource: {
        getRepository: jest.fn((entity) => {
            if (entity.name === 'Comment') {
                return mockCommentRepository;
            }
            return mockListRepository;
        }),
    },
}));

// 3. Mock the listService module
jest.mock('../services/listService', () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getLists: (...args: any[]) => mockGetLists(...args),
}));

// 4. Mock authentication middleware
jest.mock('../middleware/authenticateUser', () => ({
    authenticateUser: (req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.user = { id: 1, username: 'testuser', email: 'test@example.com' };
        next();
    },
}));

// 5. Mock validation middleware
jest.mock('../middleware/listValidation', () => ({
    validateListCreation: (req: express.Request, res: express.Response, next: express.NextFunction) => {
        next();
    },
}));

// 6. Import the router after mocks
import listRouter from './listRouter';
import { errorHandler } from '../middleware/errorHandling/errorHandler';

const app = express();
app.use(express.json());
app.use('/lists', listRouter);
app.use(errorHandler);

describe('listRouter', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /', () => {
        it('should return lists successfully', async () => {
            const lists = [{ id: 1, name: 'My List', description: 'A great list' }];
            const total = 1;

            mockGetLists.mockResolvedValue({ lists, total });

            const res = await request(app).get('/lists');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                count: total,
                results: lists,
                next: null,
                previous: null,
            });
            expect(mockGetLists).toHaveBeenCalledWith(expect.anything());
        });

        it('should return 500 if getLists throws an error', async () => {
            mockGetLists.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/lists');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({
                success: false,
                data: null,
                error: {
                    message: 'Database error',
                    code: 500,
                },
            });
        });
    });

    describe('GET /:name', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should return a list by name', async () => {
            const mockList = {
                id: 1,
                name: 'My List',
                description: 'A great list',
                user: {
                    id: 1,
                    username: 'testuser',
                },
                movies: [],
                likes: [
                    {
                        id: 101,
                        user: { id: 2, username: 'user2' },
                    },
                    {
                        id: 102,
                        user: { id: 3, username: 'user3' },
                    },
                ],
                comments: [
                    {
                        id: 201,
                        content: 'Great list!',
                    },
                ],
                createdAt: new Date('2024-01-01'),
            };

            mockListRepository.findOne.mockResolvedValue(mockList);
            await request(app).get('/lists/My-List');

            expect(mockListRepository.findOne).toHaveBeenCalledWith({
                where: { name: 'My List' }, // Should be "My List" after transformation
                relations: ['user', 'movies', 'likes', 'likes.user', 'comments'],
            });
        });
    });

    describe('POST /', () => {
        it('should create a list successfully', async () => {
            const listData = {
                name: 'My New List',
                description: 'A great list',
                movieIds: [1, 2, 3, 4, 5],
            };

            const createdList = {
                id: 1,
                ...listData,
                user: { id: 1, username: 'testuser' },
                movies: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
            };

            mockListRepository.create.mockReturnValue(createdList);
            mockListRepository.save.mockResolvedValue(createdList);

            const res = await request(app).post('/lists').send(listData);

            expect(res.status).toBe(201);
            expect(res.body.message).toBe('List created successfully');
            expect(res.body.data).toEqual(createdList);
            expect(mockListRepository.create).toHaveBeenCalled();
            expect(mockListRepository.save).toHaveBeenCalled();
        });

        it('should create a list without movieIds', async () => {
            const listData = {
                name: 'My New List',
                description: 'A great list',
            };

            const createdList = {
                id: 1,
                ...listData,
                user: { id: 1, username: 'testuser' },
                movies: [],
            };

            mockListRepository.create.mockReturnValue(createdList);
            mockListRepository.save.mockResolvedValue(createdList);

            const res = await request(app).post('/lists').send(listData);

            expect(res.status).toBe(201);
            expect(mockListRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    movies: [],
                }),
            );
        });

        it('should handle errors during list creation', async () => {
            const listData = {
                name: 'My New List',
                description: 'A great list',
            };

            mockListRepository.create.mockReturnValue({});
            mockListRepository.save.mockRejectedValue(new Error('Database error'));

            const res = await request(app).post('/lists').send(listData);

            expect(res.status).toBe(500);
        });
    });

    describe('GET /:name', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should handle list name with dashes', async () => {
            const list = {
                id: 1,
                name: 'My Favorite Movies',
                description: 'A great list',
                user: { id: 1, username: 'testuser' },
                movies: [],
                'likes.user': [],
                comments: [],
                createdAt: new Date(),
            };

            mockListRepository.findOne.mockResolvedValue(list);

            await request(app).get('/lists/My-Favorite-Movies');

            expect(mockListRepository.findOne).toHaveBeenCalledWith({
                where: { name: 'My Favorite Movies' },
                relations: ['user', 'movies', 'likes', 'likes.user', 'comments'],
            });
        });

        it('should return 404 if list not found', async () => {
            mockListRepository.findOne.mockResolvedValue(null);

            const res = await request(app).get('/lists/NonExistent-List');

            expect(res.status).toBe(404);
            expect(res.body).toEqual({
                success: false,
                data: null,
                error: {
                    message: 'List not found',
                    code: 404,
                },
            });
        });

        it('should handle errors when fetching list by name', async () => {
            mockListRepository.findOne.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/lists/My-List');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({
                success: false,
                data: null,
                error: {
                    message: 'Database error',
                    code: 500,
                },
            });
        });
    });

    describe('GET /:id/comments', () => {
        it('should return comments for a list', async () => {
            const list = {
                id: 1,
                name: 'My List',
                comments: [
                    {
                        id: 1,
                        content: 'Great list!',
                        user: { id: 1, username: 'user1' },
                        createdAt: new Date(),
                    },
                    {
                        id: 2,
                        content: 'Nice collection',
                        user: { id: 2, username: 'user2' },
                        createdAt: new Date(),
                    },
                ],
            };

            mockListRepository.findOne.mockResolvedValue(list);

            const res = await request(app).get('/lists/1/comments');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body[0].content).toBe('Great list!');
            expect(res.body[1].content).toBe('Nice collection');
        });

        it('should return 404 if list not found when fetching comments', async () => {
            mockListRepository.findOne.mockResolvedValue(null);

            const res = await request(app).get('/lists/999/comments');

            expect(res.status).toBe(404);
            expect(res.body).toEqual({
                success: false,
                data: null,
                error: {
                    message: 'List not found',
                    code: 404,
                },
            });
        });

        it('should handle errors when fetching comments', async () => {
            mockListRepository.findOne.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/lists/1/comments');

            expect(res.status).toBe(500);
            expect(res.body).toEqual({
                success: false,
                data: null,
                error: {
                    message: 'Database error',
                    code: 500,
                },
            });
        });
    });

    describe('POST /:id/comments', () => {
        it('should add a comment to a list', async () => {
            const list = {
                id: 1,
                name: 'My List',
            };

            const newComment = {
                id: 1,
                content: 'Great list!',
                user: { id: 1, username: 'testuser' },
                list,
            };

            mockListRepository.findOneBy.mockResolvedValue(list);
            mockCommentRepository.create.mockReturnValue(newComment);
            mockCommentRepository.save.mockResolvedValue(newComment);

            const res = await request(app).post('/lists/1/comments').send({ content: 'Great list!' });

            expect(res.status).toBe(201);
            expect(res.body.message).toBe('Comment added successfully');
            expect(res.body.data.content).toEqual(newComment.content);
            expect(mockCommentRepository.create).toHaveBeenCalled();
            expect(mockCommentRepository.save).toHaveBeenCalled();
        });

        it('should return 404 if list not found when adding comment', async () => {
            mockListRepository.findOneBy.mockResolvedValue(null);

            const res = await request(app).post('/lists/999/comments').send({ content: 'Great list!' });

            expect(res.status).toBe(404);
            expect(res.body).toEqual({
                success: false,
                data: null,
                error: {
                    message: 'List not found',
                    code: 404,
                },
            });
        });

        it('should handle errors when adding comment', async () => {
            const list = {
                id: 1,
                name: 'My List',
            };

            mockListRepository.findOneBy.mockResolvedValue(list);
            mockCommentRepository.create.mockReturnValue({});
            mockCommentRepository.save.mockRejectedValue(new Error('Database error'));

            const res = await request(app).post('/lists/1/comments').send({ content: 'Great list!' });

            expect(res.status).toBe(500);
            expect(res.body).toEqual({
                success: false,
                data: null,
                error: {
                    message: 'Database error',
                    code: 500,
                },
            });
        });
    });
});
