import { Router } from "express";
import { roomEventController } from "../controllers/roomEventController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

// User Activities
router.get("/room-events/activities", requireAuth as any, roomEventController.getActivities);
router.post("/room-events/activities", requireAuth as any, roomEventController.createActivity);
router.patch("/room-events/activities/:id", requireAuth as any, roomEventController.updateActivity);
router.delete("/room-events/activities/:id", requireAuth as any, roomEventController.deleteActivity);

// Detected Sensor Events
router.get("/room-events/detected", requireAuth as any, roomEventController.getDetectedEvents);
router.get("/room-events/detected/:id", requireAuth as any, roomEventController.getDetectedEventById);
router.patch(
  "/room-events/detected/:id/status",
  requireAuth as any,
  roomEventController.updateDetectedEventStatus,
);

// Associations
router.get("/room-events/associations", requireAuth as any, roomEventController.getAssociations);
router.post(
  "/room-events/associations/:id/feedback",
  requireAuth as any,
  roomEventController.updateAssociationFeedback,
);

// Pattern Insights & Evidence
router.get("/room-events/insights", requireAuth as any, roomEventController.getInsights);
router.get("/room-events/evidence", requireAuth as any, roomEventController.getEvidenceData);

export default router;
