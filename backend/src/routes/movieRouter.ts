import { Router } from 'express';
import { deleteMovieById, getMovieById, getMovieBySlug, getMovies, getMoviesByPartialSlug } from '../services/movies/movieService';
import buildPaginatedResponse from './helper/buildPaginatedResponse';
import { authenticateUser } from '../middleware/authenticateUser';
import { View } from '../entities/View';
import { AppDataSource } from '../startup/data-source';
import { ApiError } from '../interfaces/ApiError';

const movieRouter = Router();

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get all movies with pagination
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 */
movieRouter.get('/', async (req, res, next) => {
    try {
        const { movies, total } = await getMovies(req);
        const response = buildPaginatedResponse(movies, total, req);
        res.status(200).send(response);
    } catch (error) {
        console.error('Error fetching movies:', error);
        next(error);
    }
});

movieRouter.get('/:slug', async (req, res, next) => {
    const slug = req.params.slug;

    try {
        const movie = await getMovieBySlug(req, slug);

        if (!movie) {
            throw new ApiError(`Movie with slug ${slug} not found.`, 404);
        }

        res.status(200).send(movie);
    } catch (error) {
        console.error(`Error fetching movie with slug ${slug}:`, error);
        next(error);
    }
});

movieRouter.get('/like/:partialSlug', async (req, res, next) => {
    const partialSlug = req.params.partialSlug;

    try {
        const movies = await getMoviesByPartialSlug(partialSlug);

        if (movies.length === 0) {
            throw new ApiError(`No movies found matching ${partialSlug}.`, 404);
        }

        res.status(200).send(movies);
    } catch (error) {
        console.error(`Error fetching movies like ${partialSlug}:`, error);
        next(error);
    }
});

movieRouter.post('/:id/view', authenticateUser, async (req, res, next) => {
    const movieId = Number(req.params.id);
    try {
        const movie = await getMovieById(movieId);

        if (!movie) {
            throw new ApiError(`Movie with ID ${movieId} not found.`, 404);
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
        next(error);
    }
});

movieRouter.delete('/:id', async (req, res, next) => {
    try {
        const movieId = Number(req.params.id);

        const success = await deleteMovieById(movieId);

        if (!success) {
            throw new ApiError(`Movie with ID ${movieId} not found.`, 404);
        }

        res.status(200).send({
            message: `Movie with ID ${movieId} deleted successfully.`,
        });
    } catch (error) {
        console.error(`Error deleting movie with ID ${req.params.id}:`, error);
        next(error);
    }
});

export default movieRouter;
