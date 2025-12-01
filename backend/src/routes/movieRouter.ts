import { Router } from 'express';
import {
  deleteMovieById,
  getMovieByTitle,
  getMovies,
} from '../services/movies/movieService';
import buildPaginatedResponse from './helper/buildPaginatedResponse';
import validateMovieTitle from '../middleware/validation/validateMovieTitle';

const movieRouter = Router();

movieRouter.get('/', async (req, res) => {
  try {
    const { movies, total } = await getMovies(req);
    const response = buildPaginatedResponse(movies, total, req);
    res.status(200).send(response);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

movieRouter.get('/:title', async (req, res) => {
  let title = req.params.title;

  try {
    title = validateMovieTitle(title);

    const movie = await getMovieByTitle(title);

    console.log(`Fetched movie:`, movie);

    if (!movie) {
      return res
        .status(404)
        .send({ error: `Movie with title ${title} not found.` });
    }

    res.status(200).send(movie);
  } catch (error) {
    console.error(`Error fetching movie with title ${title}:`, error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

movieRouter.delete('/:id', async (req, res) => {
  const movieId = Number(req.params.id);

  try {
    const success = await deleteMovieById(movieId);
    if (success) {
      res
        .status(200)
        .send({ message: `Movie with ID ${movieId} deleted successfully.` });
    } else {
      res.status(404).send({ error: `Movie with ID ${movieId} not found.` });
    }
  } catch (error) {
    console.error(`Error deleting movie with ID ${movieId}:`, error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

export default movieRouter;
