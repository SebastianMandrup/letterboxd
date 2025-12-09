import { Router } from 'express';
import { deleteMovieById, getMovieById, getMovieBySlug, getMovies, getMoviesByPartialSlug } from '../services/movies/movieService';
import buildPaginatedResponse from './helper/buildPaginatedResponse';
import { authenticateUser } from '../middleware/authenticateUser';
import { View } from '../entities/View';
import { AppDataSource } from '../startup/data-source';

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
        const movie = await getMovieBySlug(req, slug);

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

movieRouter.post('/:id/view', authenticateUser, async (req, res) => {
    const movieId = Number(req.params.id);
    try {
        const movie = await getMovieById(movieId);

        if (!movie) {
            return res.status(404).send({ error: `Movie with ID ${movieId} not found.` });
        }

        const userId = req.user.id;

        const viewRepository = AppDataSource.getRepository(View);

        const existingView = await viewRepository.findOne({
            where: {
                movie: { id: movieId },
                user: { id: userId },
            },
        });

        if (existingView) {
            await viewRepository.remove(existingView);
            return res.status(200).send({ message: 'Movie view removed successfully' });
        }

        const newView = viewRepository.create({
            movie: movie,
            user: req.user,
        });
        await viewRepository.save(newView);
        return res.status(200).send({ message: 'Movie viewed successfully' });
    } catch (error) {
        console.error(`Error updating view status for movie ID ${movieId}:`, error);
        return res.status(500).send({ error: 'Internal server error' });
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
