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

        console.log('Fetched list:', list);

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

// get all comments for a list
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

// TODO: validation middleware
// add a comment to a list
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
