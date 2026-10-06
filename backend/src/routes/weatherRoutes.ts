import { Router } from "express";
import { weatherController } from "../controllers/weatherController.js";

const router = Router();
router.get("/weather", weatherController.getWeather);

export default router;
