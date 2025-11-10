import { Router } from "express";
import { deleteMovieById, getMoviesQueryBuilder } from '../services/movieService';

const movieRouter = Router();

movieRouter.get("/", async (req, res) => {
    try {
        const queryBuilder = await getMoviesQueryBuilder(req);
        const movies = await queryBuilder.getMany();

        res.status(200).send({
            count: movies.length,
            results: movies
        });
    } catch (error) {
        console.error("Error fetching movies:", error);
        res.status(500).send({ error: "Internal server error" });
    }
});

movieRouter.delete("/:id", async (req, res) => {
    const movieId = Number(req.params.id);

    try {
        await deleteMovieById(movieId);
        res.status(200).send({ message: `Movie with ID ${movieId} deleted successfully.` });
    } catch (error) {
        console.error(`Error deleting movie with ID ${movieId}:`, error);
        res.status(500).send({ error: "Internal server error" });
    }
});

export default movieRouter;
