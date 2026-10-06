import { Router } from "express";
import { alertController } from "../controllers/alertController.js";

const router = Router();
router.post("/mock-alert", alertController.mockAlert);

export default router;
