import { Router } from "express";
import { pushController } from "../controllers/pushController.js";

const router = Router();
router.post("/push/subscribe", pushController.subscribe);
router.delete("/push/subscribe", pushController.unsubscribe);
router.get("/push/vapid", pushController.getVapidKey);

export default router;
