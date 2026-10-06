import { Router } from "express";
import { aiController } from "../controllers/aiController.js";

const router = Router();
router.get("/ai/recommendations", aiController.getRecommendations);
router.post("/ai/analyze", aiController.analyzeAir);

export default router;
