import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Movie } from '../entities/Movie';

interface Response {
    count: number;
    results: Movie[];
}

const movieRouter = Router();

const movieRepository = AppDataSource.getRepository(Movie);

//GET all movies
movieRouter.get("/", async (req, res) => {
    try {
        const movies = await movieRepository.find();
        const response: Response = {
            count: movies.length,
            results: movies,
        };
        res.send(response);
    } catch (error) {
        console.error("Error fetching genres:", error);
        res.status(500).send({ error: "Internal server error" });
    }
});

export default movieRouter;
