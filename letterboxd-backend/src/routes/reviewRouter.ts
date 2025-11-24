import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Review } from '../entities/Review';

interface Response {
    count: number;
    results: Review[];
}

const reviewRouter = Router();

const reviewRepository = AppDataSource.getRepository(Review);

//GET all reviews
reviewRouter.get("/", async (req, res) => {
    try {
        const reviews = await reviewRepository.find();
        const response: Response = {
            count: reviews.length,
            results: reviews,
        };
        res.send(response);
    } catch (error) {
        console.error("Error fetching genres:", error);
        res.status(500).send({ error: "Internal server error" });
    }
});

export default reviewRouter;