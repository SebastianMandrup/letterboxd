import { Router } from "express";
import { deleteMovieById, getMovies } from '../services/movieService';

const movieRouter = Router();

interface MoviesResponse {
    count: number;        // total movies matching filters
    next: string | null;  // URL of next page
    previous: string | null; // URL of previous page
    results: any[];       // movies on this page
}

const buildMoviesResponse = (movies: any[], total: number, req: any): MoviesResponse => {
    const page = req.query.page ? Number(req.query.page) : 1;
    let pageSize = req.query.page_size ? Number(req.query.page_size) : 20;

    if (pageSize > 40) pageSize = 40;

    const totalPages = Math.ceil(total / pageSize);

    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;

    const buildPageLink = (pageNum: number) =>
        `${baseUrl}?page=${pageNum}&page_size=${pageSize}`;

    return {
        count: total,
        next: page < totalPages ? buildPageLink(page + 1) : null,
        previous: page > 1 ? buildPageLink(page - 1) : null,
        results: movies,
    };
};

movieRouter.get("/", async (req, res) => {
    try {
        const { movies, total } = await getMovies(req);

        const response = buildMoviesResponse(movies, total, req);
        res.status(200).send(response);
    } catch (error) {
        console.error("Error fetching movies:", error);
        res.status(500).send({ error: "Internal server error" });
    }
});

movieRouter.delete("/:id", async (req, res) => {
    const movieId = Number(req.params.id);

    try {
        const success = await deleteMovieById(movieId);
        if (success) {
            res.status(200).send({ message: `Movie with ID ${movieId} deleted successfully.` });
        } else {
            res.status(404).send({ error: `Movie with ID ${movieId} not found.` });
        }
    } catch (error) {
        console.error(`Error deleting movie with ID ${movieId}:`, error);
        res.status(500).send({ error: "Internal server error" });
    }
});

export default movieRouter;
