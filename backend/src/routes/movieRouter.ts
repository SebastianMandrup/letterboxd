import { Router } from 'express';
import { getMovieById, getMovieBySlug, getMovies, getMoviesByPartialSlug } from '../services/movies/movieService';
import buildPaginatedResponse from './helper/buildPaginatedResponse';
import { authenticateUser } from '../middleware/authenticateUser';
import { View } from '../entities/View';
import { AppDataSource } from '../startup/data-source';
import { ApiError } from '../interfaces/ApiError';

const movieRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Movie management and discovery endpoints
 */

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get all movies with pagination
 *     description: Returns a paginated list of movies with optional sorting and filtering
 *     operationId: getMovies
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of items per page (max 100)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [popularity, releaseDate, voteAverage, title]
 *           default: popularity
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order (ascending or descending)
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter by genre name
 *         example: Action
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter by release year
 *         example: 2024
 *     responses:
 *       200:
 *         description: Paginated list of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 1000
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 20
 *                     totalPages:
 *                       type: integer
 *                       example: 50
 *                     hasNext:
 *                       type: boolean
 *                       example: true
 *                     hasPrev:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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

/**
 * @swagger
 * /movies/{slug}:
 *   get:
 *     summary: Get a movie by slug
 *     description: Returns a single movie by its slug with all related data including cast, genres, lists, and user viewing status
 *     operationId: getMovieBySlug
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$'
 *         description: Movie slug (URL-friendly identifier)
 *         example: the-dark-knight-2008
 *       - in: query
 *         name: includeRelated
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Include related entities (cast, genres, lists, etc.)
 *     responses:
 *       200:
 *         description: Movie object with all related data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 2873
 *                 slug:
 *                   type: string
 *                   example: three-heroes-daily-tales-2
 *                 title:
 *                   type: string
 *                   example: Three Heroes. Daily Tales 2
 *                 originalTitle:
 *                   type: string
 *                   example: Три богатыря. Ни дня без подвига 2
 *                 adult:
 *                   type: boolean
 *                   example: false
 *                 overview:
 *                   type: string
 *                   example: Three heroes - that's why they are heroes, because every day they are ready for new fairy-tale feats...
 *                 posterPath:
 *                   type: string
 *                   nullable: true
 *                   example: /wlmb01GQ4uGZbhZWzmXJqdBNSZb.jpg
 *                 backdropPath:
 *                   type: string
 *                   nullable: true
 *                 releaseDate:
 *                   type: string
 *                   format: date
 *                   example: 2025-06-12
 *                 voteAverage:
 *                   type: number
 *                   format: float
 *                   example: 10
 *                 voteCount:
 *                   type: integer
 *                   example: 1
 *                 popularity:
 *                   type: number
 *                   format: float
 *                   example: 1.2294
 *                 budget:
 *                   type: string
 *                   example: "0"
 *                 revenue:
 *                   type: string
 *                   example: "0"
 *                 runtime:
 *                   type: integer
 *                   example: 0
 *                 tagline:
 *                   type: string
 *                   example: ""
 *                 homepage:
 *                   type: string
 *                   example: ""
 *                 imdbId:
 *                   type: string
 *                   example: ""
 *                 status:
 *                   type: string
 *                   example: Released
 *                 castMembers:
 *                   type: array
 *                   items:
 *                     type: object
 *                 genres:
 *                   type: array
 *                   items:
 *                     type: object
 *                 lists:
 *                   type: array
 *                   items:
 *                     type: object
 *                 isViewed:
 *                   type: boolean
 *                   example: false
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /movies/like/{partialSlug}:
 *   get:
 *     summary: Search movies by partial slug
 *     description: Returns movies whose slugs contain the provided partial string (case-insensitive search)
 *     operationId: searchMoviesByPartialSlug
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: partialSlug
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *         description: Partial slug to search for (minimum 2 characters)
 *         example: dark-knight
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Maximum number of movies to return
 *       - in: query
 *         name: exactMatch
 *         schema:
 *           type: boolean
 *           default: false
 *         description: If true, only returns movies where slug exactly matches (not partial)
 *     responses:
 *       200:
 *         description: Array of movies matching the partial slug
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   slug:
 *                     type: string
 *                   title:
 *                     type: string
 *       400:
 *         description: Invalid search parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: No movies found matching the search
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /movies/{id}/view:
 *   post:
 *     summary: Toggle view status for a movie
 *     description: Adds a view record for the authenticated user if not viewed, removes it if already viewed (toggle functionality)
 *     operationId: toggleMovieView
 *     tags: [Movies]
 *     security:
 *       - session: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: Movie ID
 *         example: 2873
 *     responses:
 *       200:
 *         description: View status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Movie viewed successfully
 *                 viewed:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized - User not logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
            return res.status(200).send({
                message: 'Movie view removed successfully',
                viewed: false,
            });
        }

        const newView = viewRepository.create({
            movie: movie,
            user: req.user,
        });
        await viewRepository.save(newView);
        return res.status(200).send({
            message: 'Movie viewed successfully',
            viewed: true,
        });
    } catch (error) {
        console.error(`Error updating view status for movie ID ${movieId}:`, error);
        next(error);
    }
});

export default movieRouter;
