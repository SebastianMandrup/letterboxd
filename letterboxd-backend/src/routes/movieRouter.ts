import { Router } from "express";
import { deleteMovieById, getMovies } from '../services/movies/movieService';
import buildMoviesResponse from "./helper/buildMoviesResponse";

const movieRouter = Router();

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
