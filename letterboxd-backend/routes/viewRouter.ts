import { Router } from "express";
import { AppDataSource } from "../data-source";
import { View } from '../entities/View';

interface Response {
    count: number;
    results: View[];
}

const viewRouter = Router();

const viewRepository = AppDataSource.getRepository(View);

//GET all views
viewRouter.get("/", async (req, res) => {
    try {
        const views = await viewRepository.find();
        const response: Response = {
            count: views.length,
            results: views,
        };
        res.send(response);
    } catch (error) {
        console.error("Error fetching genres:", error);
        res.status(500).send({ error: "Internal server error" });
    }
});

export default viewRouter;