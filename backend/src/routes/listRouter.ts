import { Router } from 'express';
import { getLists } from '../services/listService';
import buildPaginatedResponse from './helper/buildPaginatedResponse';
import { AppDataSource } from '../startup/data-source';
import { List } from '../entities/List';

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

export default listRouter;
