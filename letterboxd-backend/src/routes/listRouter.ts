import { Router } from 'express';
import { getLists } from '../services/lists/listService';
import buildPaginatedResponse from './helper/buildPaginatedResponse';

const listRouter = Router();

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

export default listRouter;
