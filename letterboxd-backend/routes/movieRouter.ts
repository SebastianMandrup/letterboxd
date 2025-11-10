import { Router } from "express";
import { getMoviesQueryBuilder } from '../services/movieService';

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

export default movieRouter;
