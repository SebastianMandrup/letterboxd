import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Review } from '../entities/Review';
import Response from "../DTO/Response";

const reviewRouter = Router();

const reviewRepository = AppDataSource.getRepository(Review);

reviewRouter.get("/", async (req, res) => {
    try {
        const reviews = await reviewRepository.find();
        const response = {
            count: reviews.length,
            results: reviews,
        };
        res.send(response);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).send({ error: "Internal server error" });
    }
});

export default reviewRouter;