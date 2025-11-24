import { Router } from "express";
import { AppDataSource } from "../data-source";
import { View } from '../entities/View';

const viewRouter = Router();

const viewRepository = AppDataSource.getRepository(View);

//GET all views
viewRouter.get("/", async (req, res) => {
    try {
        const totalViews = await viewRepository.count();
        res.send(totalViews);
    } catch (error) {
        console.error("Error fetching genres:", error);
        res.status(500).send({ error: "Internal server error" });
    }
});

export default viewRouter;