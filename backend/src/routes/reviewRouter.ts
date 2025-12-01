import { Router, Request, Response } from 'express';
import { getReviews } from '../services/reviewService';

const reviewRouter = Router();

reviewRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { reviews, total } = await getReviews(req);

    const response = {
      count: total,
      results: reviews,
    };
    res.send(response);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

export default reviewRouter;
