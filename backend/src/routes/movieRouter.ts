import { Router } from 'express';
import { deleteMovieById, getMovieBySlug, getMovies, getMoviesByPartialSlug } from '../services/movies/movieService';
import buildPaginatedResponse from './helper/buildPaginatedResponse';

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

movieRouter.get('/:slug', async (req, res) => {
    const slug = req.params.slug;

    try {
        const movie = await getMovieBySlug(slug);

        if (!movie) {
            return res.status(404).send({ error: `Movie with slug ${slug} not found.` });
        }

        res.status(200).send(movie);
    } catch (error) {
        console.error(`Error fetching movie with slug ${slug}:`, error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

movieRouter.get('/like/:partialSlug', async (req, res) => {
    const partialSlug = req.params.partialSlug;

    try {
        const movies = await getMoviesByPartialSlug(partialSlug);

        if (movies.length === 0) {
            return res.status(404).send({ error: `No movies found matching ${partialSlug}.` });
        }

        res.status(200).send(movies);
    } catch (error) {
        console.error(`Error fetching movies like ${partialSlug}:`, error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

movieRouter.delete('/:id', async (req, res) => {
    const movieId = Number(req.params.id);

    try {
        const success = await deleteMovieById(movieId);
        if (success) {
            res.status(200).send({
                message: `Movie with ID ${movieId} deleted successfully.`,
            });
        } else {
            res.status(404).send({
                error: `Movie with ID ${movieId} not found.`,
            });
        }
    } catch (error) {
        console.error(`Error deleting movie with ID ${movieId}:`, error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

export default movieRouter;
