import { Router } from 'express';
import { getLists } from '../services/listService';
import buildPaginatedResponse from './helper/buildPaginatedResponse';
import { AppDataSource } from '../startup/data-source';
import { List } from '../entities/List';
import { Comment } from '../entities/Comment';
import { authenticateUser } from '../middleware/authenticateUser';
import { validateListCreation } from '../middleware/listValidation';

const listRouter = Router();

const listRepository = AppDataSource.getRepository(List);

listRouter.get('/', async (req, res) => {
    try {
        const { lists, total } = await getLists(req);
        const response = buildPaginatedResponse(lists, total, req);
        res.status(200).send(response);
    } catch (error) {
        console.error('Error fetching lists:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

listRouter.post('/', authenticateUser, validateListCreation, async (req, res, next) => {
    try {
        const { name, description, movieIds } = req.body;

        const newList = listRepository.create({
            name,
            description,
            user: req.user,
            movies: movieIds ? movieIds.map((id: number) => ({ id })) : [],
        });

        await listRepository.save(newList);

        res.status(201).send({ message: 'List created successfully', list: newList });
    } catch (error) {
        next(error);
    }
});

listRouter.get('/:name', async (req, res) => {
    try {
        let name = req.params.name;
        name = name.replace(/-/g, ' ');

        const list = await listRepository.findOne({
            where: { name },
            relations: ['user', 'movies', 'likes', 'comments'],
        });

        if (!list) {
            return res.status(404).send({ error: 'List not found' });
        }

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
        };

        res.status(200).send(listDto);
    } catch (error) {
        console.error('Error fetching list by title:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// get all comments for a list
listRouter.get('/:id/comments', async (req, res) => {
    try {
        const listId = parseInt(req.params.id, 10);
        const list = await listRepository.findOne({
            where: { id: listId },
            relations: ['comments', 'comments.user'],
        });

        if (!list) {
            return res.status(404).send({ error: 'List not found' });
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
        res.status(500).send({ error: 'Internal server error' });
    }
});

// add a comment to a list
listRouter.post('/:id/comments', authenticateUser, async (req, res) => {
    try {
        const listId = parseInt(req.params.id, 10);
        const { content } = req.body;
        const list = await listRepository.findOneBy({ id: listId });

        // validate the list
        if (!list) {
            return res.status(404).send({ error: 'List not found' });
        }

        const commentRepository = AppDataSource.getRepository(Comment);

        const newComment = commentRepository.create({
            content,
            user: req.user,
            list,
        });

        await commentRepository.save(newComment);

        res.status(201).send({ message: 'Comment added successfully', comment: newComment });
    } catch (error) {
        console.error('Error adding comment to list:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

export default listRouter;
