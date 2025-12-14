import { Router, NextFunction } from 'express';
import { getLists } from '../services/listService';
import buildPaginatedResponse from './helper/buildPaginatedResponse';
import { AppDataSource } from '../startup/data-source';
import { List } from '../entities/List';
import { Comment } from '../entities/Comment';
import { authenticateUser } from '../middleware/authenticateUser';
import { validateListCreation } from '../middleware/listValidation';
import { ApiError } from '../interfaces/ApiError';
import validateId from '../middleware/validation/validateId';
import { ListLike } from '../entities/ListLike';

const listRouter = Router();

const listRepository = AppDataSource.getRepository(List);

/**
 * @swagger
 * /lists:
 *   get:
 *     summary: Get all lists with pagination
 *     tags: [Lists]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paginated lists response
 */
listRouter.get('/', async (req, res, next) => {
    try {
        const { lists, total } = await getLists(req);
        const response = buildPaginatedResponse(lists, total, req);
        res.status(200).send(response);
    } catch (error) {
        console.error('Error fetching lists:', error);
        next(error);
    }
});

/**
 * @swagger
 * /lists:
 *   post:
 *     summary: Create a new list
 *     tags: [Lists]
 *     security:
 *       - session: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               movieIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: List created successfully
 *       401:
 *         description: Unauthorized
 */
listRouter.post('/', authenticateUser, validateListCreation, async (req, res, next: NextFunction) => {
    try {
        const { name, description, movieIds } = req.body;

        const newList = listRepository.create({
            name,
            description,
            user: req.user,
            movies: movieIds ? movieIds.map((id: number) => ({ id })) : [],
        });

        await listRepository.save(newList);

        res.status(201).send({ message: 'List created successfully', data: newList });
    } catch (error) {
        console.error('Error creating new list:', error);
        next(error);
    }
});

/**
 * @swagger
 * /lists/{name}:
 *   get:
 *     summary: Get a list by name
 *     tags: [Lists]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List details
 *       404:
 *         description: List not found
 */
listRouter.get('/:name', async (req, res, next) => {
    try {
        let name = req.params.name;
        name = name.replace(/-/g, ' ');

        const list = await listRepository.findOne({
            where: { name },
            relations: ['user', 'movies', 'likes', 'likes.user', 'comments'],
        });

        if (!list) {
            throw new ApiError('List not found', 404);
        }

        const currentUserId = req.session.user ? req.session.user.id : null;

        const listDto = {
            id: list.id,
            name: list.name,
            description: list.description,
            user: {
                id: list.user.id,
                username: list.user.username,
            },
            movies: list.movies,
            likeCount: list.likes.length,
            commentCount: list.comments.length,
            createdAt: list.createdAt,
            isLiked: currentUserId ? list.likes.some((like) => like.user.id === currentUserId) : false,
        };

        res.status(200).send(listDto);
    } catch (error) {
        console.error('Error fetching list by title:', error);
        next(error);
    }
});

/**
 * @swagger
 * /lists/{id}:
 *   delete:
 *     summary: Delete a specific list
 *     description: |
 *       Delete a list by ID.
 *       - User must be authenticated
 *       - User can only delete their own lists
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the list to delete
 *         schema:
 *           type: integer
 *           example: 42
 *     responses:
 *       '200':
 *         description: List deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "List deleted successfully"
 *       '401':
 *         description: Unauthorized - Authentication required
 *       '403':
 *         description: Forbidden - User doesn't own this list
 *       '404':
 *         description: List not found
 *       '500':
 *         description: Internal server error
 */
listRouter.delete('/:id', authenticateUser, async (req, res, next) => {
    try {
        const listId = parseInt(req.params.id, 10);
        validateId(listId);

        const list = await listRepository.findOne({
            where: { id: listId },
            relations: ['user'],
        });

        if (!list) {
            throw new ApiError('List not found', 404);
        }

        if (list.user.id !== req.user.id) {
            throw new ApiError('Unauthorized to delete this list', 403);
        }

        await listRepository.remove(list);
        res.status(200).send({ message: 'List deleted successfully' });
    } catch (error) {
        console.error('Error deleting list:', error);
        next(error);
    }
});

/**
 * @swagger
 * /lists/{id}/comments:
 *   get:
 *     summary: Get all comments for a list
 *     tags: [Lists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List comments
 *       404:
 *         description: List not found
 */
listRouter.get('/:id/comments', async (req, res, next) => {
    try {
        const listId = parseInt(req.params.id, 10);
        validateId(listId);

        const list = await listRepository.findOne({
            where: { id: listId },
            relations: ['comments', 'comments.user'],
        });

        if (!list) {
            throw new ApiError('List not found', 404);
        }

        const commentsDto = list.comments.map((comment) => ({
            id: comment.id,
            content: comment.content,
            user: {
                id: comment.user.id,
                username: comment.user.username,
            },
            createdAt: comment.createdAt,
        }));

        res.status(200).send(commentsDto);
    } catch (error) {
        console.error('Error fetching comments for list:', error);
        next(error);
    }
});

/**
 * @swagger
 * /lists/{id}/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment from a list
 *     tags: [Lists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: List ID
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Comment ID to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment deleted successfully"
 *       404:
 *         description: List or comment not found
 */
listRouter.delete('/comments/:commentId', authenticateUser, async (req, res, next) => {
    try {
        const commentId = parseInt(req.params.commentId, 10);
        validateId(commentId);

        const commentRepository = AppDataSource.getRepository(Comment);

        const comment = await commentRepository.findOne({
            where: { id: commentId },
            relations: ['user'],
        });

        if (!comment) {
            throw new ApiError('Comment not found', 404);
        }

        if (comment.user.id !== req.user.id) {
            throw new ApiError('Unauthorized to delete this comment', 403);
        }

        await commentRepository.remove(comment);
        res.status(200).send({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error fetching comments for list:', error);
        next(error);
    }
});

/**
 * @swagger
 * /lists/{id}/like:
 *   post:
 *     summary: Toggle like on a list
 *     tags: [Lists]
 *     security:
 *       - session: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List unliked
 *       201:
 *         description: List liked
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: List not found
 */
listRouter.post('/:id/like', authenticateUser, async (req, res, next) => {
    try {
        const listId = parseInt(req.params.id, 10);
        validateId(listId);

        const list = await listRepository.findOne({
            where: { id: listId },
            relations: ['likes', 'likes.user'],
        });

        if (!list) {
            throw new ApiError('List not found', 404);
        }

        const existingLike = list.likes.find((like) => like.user.id === req.user.id);

        if (existingLike) {
            // Unlike the list
            list.likes = list.likes.filter((like) => like.user.id !== req.user.id);
            await listRepository.save(list);
            res.status(200).send({ message: 'List unliked successfully', likeCount: list.likes.length, isLiked: false });
        } else {
            // Like the list
            const likeRepository = AppDataSource.getRepository(ListLike);

            const newLike = likeRepository.create({
                user: req.user,
                list,
            });

            await likeRepository.save(newLike);

            res.status(201).send({ message: 'List liked successfully', likeCount: list.likes.length + 1, isLiked: true });
        }
    } catch (error) {
        console.error('Error liking/unliking list:', error);
        next(error);
    }
});

/**
 * @swagger
 * /lists/{id}/comments:
 *   post:
 *     summary: Add a comment to a list
 *     tags: [Lists]
 *     security:
 *       - session: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added
 *       400:
 *         description: Invalid comment content
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: List not found
 */
listRouter.post('/:id/comments', authenticateUser, async (req, res, next) => {
    try {
        const listId = parseInt(req.params.id, 10);
        validateId(listId);

        const { content } = req.body;

        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            throw new ApiError('Invalid comment content', 400);
        }

        const list = await listRepository.findOneBy({ id: listId });

        if (!list) {
            throw new ApiError('List not found', 404);
        }

        const commentRepository = AppDataSource.getRepository(Comment);

        const newComment = commentRepository.create({
            content,
            user: req.user,
            list,
        });

        await commentRepository.save(newComment);

        const newCommentDto = {
            id: newComment.id,
            content: newComment.content,
            user: {
                id: req.user.id,
                username: req.user.username,
            },
            createdAt: newComment.createdAt,
        };

        res.status(201).send({ message: 'Comment added successfully', data: newCommentDto });
    } catch (error) {
        console.error('Error adding comment to list:', error);
        next(error);
    }
});

export default listRouter;
