import { Router } from "express";
import { userController } from "../controllers/userController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();
router.get("/user/alert-preferences", requireAuth as any, userController.getPreferences);
router.patch("/user/alert-preferences", requireAuth as any, userController.updatePreferences);

export default router;
