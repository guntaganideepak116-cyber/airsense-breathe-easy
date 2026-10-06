import { Router } from "express";
import { deviceController } from "../controllers/deviceController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

// User-authenticated management
router.get("/devices", requireAuth as any, deviceController.getDevices);
router.post("/devices", requireAuth as any, deviceController.createDevice);
router.patch("/devices/:id", requireAuth as any, deviceController.updateDevice);
router.delete("/devices/:id", requireAuth as any, deviceController.deleteDevice);

// ESP32 Telemetry endpoints (Protected via Device API Key)
router.post("/devices/data", deviceController.ingestData);
router.post("/device/data", deviceController.ingestData);

// Public / Client reading queries
router.get("/device/latest", deviceController.getLatest);
router.get("/device/history", deviceController.getHistory);
router.get("/device/:id/stream", deviceController.streamDevice);

export default router;
