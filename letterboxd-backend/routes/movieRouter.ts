import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Movie } from '../entities/Movie';
import { In } from 'typeorm';

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
        console.error("Error fetching movies:", error);
        res.status(500).send({ error: "Internal server error" });
    }
});

movieRouter.get("/featured", async (req, res) => {
    try {
        const FEATURED_MOVIE_IDS = [1, 2, 3, 4, 5, 6];
        const featuredMovies = await movieRepository.find({
            where: { id: In(FEATURED_MOVIE_IDS) }
        });
        const response: Response = {
            count: featuredMovies.length,
            results: featuredMovies,
        };
        res.send(response);
    } catch (error) {
        console.error("Error fetching featured movies:", error);
        res.status(500).send({ error: "Internal server error" });
    }
});


export default movieRouter;
