import type { Response } from "express";
import { z } from "zod";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { dbService } from "../services/dbService.js";
import { roomEventService } from "../services/roomEventService.js";
import type { UserActivityDoc } from "../models/types.js";

const activitySchema = z.object({
  deviceId: z.string().trim().min(1, "Device ID is required"),
  category: z.string().trim().min(1, "Category is required"),
  title: z.string().trim().min(1, "Title is required").max(100),
  notes: z.string().max(500).optional(),
  startAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid startAt timestamp",
  }),
  endAt: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid endAt timestamp",
    }),
});

export const roomEventController = {
  // GET /api/room-events/activities
  async getActivities(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId || "anonymous";
    const deviceId = req.query["deviceId"] as string | undefined;
    const limit = req.query["limit"] ? parseInt(req.query["limit"] as string, 10) : 100;

    const activities = await dbService.getUserActivities(userId, deviceId, limit);
    res.json({
      success: true,
      count: activities.length,
      activities,
    });
  },

  // POST /api/room-events/activities
  async createActivity(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId || "anonymous";

    const parseResult = activitySchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: "Validation failed",
        details: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { deviceId, category, title, notes, startAt, endAt } = parseResult.data;
    const startDate = new Date(startAt);
    const endDate = endAt ? new Date(endAt) : null;

    if (endDate && endDate.getTime() < startDate.getTime()) {
      res.status(400).json({
        error: "Validation failed",
        details: { endAt: ["End time cannot be earlier than start time"] },
      });
      return;
    }

    const now = new Date();
    const newActivity: UserActivityDoc = {
      userId,
      deviceId,
      category,
      title,
      notes: notes?.trim() || undefined,
      startAt: startDate,
      endAt: endDate,
      createdAt: now,
      updatedAt: now,
    };

    const saved = await dbService.saveUserActivity(newActivity);

    // Link newly created activity with nearby sensor events
    const associations = await roomEventService.linkActivityWithNearbyEvents(saved);

    res.status(201).json({
      success: true,
      activity: saved,
      associationsFound: associations.length,
    });
  },

  // PATCH /api/room-events/activities/:id
  async updateActivity(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId || "anonymous";
    const id = req.params["id"];
    if (!id) {
      res.status(400).json({ error: "Missing activity ID" });
      return;
    }

    const existing = await dbService.getUserActivityById(id, userId);
    if (!existing) {
      res.status(404).json({ error: "Activity not found or unauthorized" });
      return;
    }

    const { category, title, notes, startAt, endAt } = req.body || {};
    const updates: Partial<UserActivityDoc> = {};

    if (category) updates.category = category;
    if (title) updates.title = title.trim();
    if (notes !== undefined) updates.notes = notes ? notes.trim() : "";
    if (startAt) {
      const sDate = new Date(startAt);
      if (isNaN(sDate.getTime())) {
        res.status(400).json({ error: "Invalid startAt" });
        return;
      }
      updates.startAt = sDate;
    }
    if (endAt !== undefined) {
      if (endAt === null || endAt === "") {
        updates.endAt = null;
      } else {
        const eDate = new Date(endAt);
        if (isNaN(eDate.getTime())) {
          res.status(400).json({ error: "Invalid endAt" });
          return;
        }
        const sTime = updates.startAt?.getTime() || new Date(existing.startAt).getTime();
        if (eDate.getTime() < sTime) {
          res.status(400).json({ error: "End time cannot be earlier than start time" });
          return;
        }
        updates.endAt = eDate;
      }
    }

    const success = await dbService.updateUserActivity(id, userId, updates);
    if (!success) {
      res.status(500).json({ error: "Failed to update activity" });
      return;
    }

    const updated = await dbService.getUserActivityById(id, userId);
    res.json({ success: true, activity: updated });
  },

  // DELETE /api/room-events/activities/:id
  async deleteActivity(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId || "anonymous";
    const id = req.params["id"];
    if (!id) {
      res.status(400).json({ error: "Missing activity ID" });
      return;
    }

    const success = await dbService.deleteUserActivity(id, userId);
    if (!success) {
      res.status(404).json({ error: "Activity not found or unauthorized" });
      return;
    }

    res.json({ success: true, message: "Activity deleted successfully" });
  },

  // GET /api/room-events/detected
  async getDetectedEvents(req: AuthenticatedRequest, res: Response) {
    const deviceId = req.query["deviceId"] as string;
    if (!deviceId) {
      res.status(400).json({ error: "Missing deviceId query parameter" });
      return;
    }

    const limit = req.query["limit"] ? parseInt(req.query["limit"] as string, 10) : 100;
    const events = await dbService.getDetectedEvents(deviceId, limit);

    res.json({
      success: true,
      deviceId,
      count: events.length,
      events,
    });
  },

  // GET /api/room-events/detected/:id
  async getDetectedEventById(req: AuthenticatedRequest, res: Response) {
    const id = req.params["id"];
    if (!id) {
      res.status(400).json({ error: "Missing event ID" });
      return;
    }

    const event = await dbService.getDetectedEventById(id);
    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    res.json({ success: true, event });
  },

  // PATCH /api/room-events/detected/:id/status
  async updateDetectedEventStatus(req: AuthenticatedRequest, res: Response) {
    const id = req.params["id"];
    const { status } = req.body || {};

    if (!id || !["detected", "user_confirmed", "dismissed"].includes(status)) {
      res.status(400).json({ error: "Invalid status value" });
      return;
    }

    const success = await dbService.updateDetectedEventStatus(id, status);
    if (!success) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    res.json({ success: true, status });
  },

  // GET /api/room-events/associations
  async getAssociations(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId || "anonymous";
    const deviceId = req.query["deviceId"] as string | undefined;

    const associations = await dbService.getAssociations(userId, deviceId);
    res.json({
      success: true,
      count: associations.length,
      associations,
    });
  },

  // POST /api/room-events/associations/:id/feedback
  async updateAssociationFeedback(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId || "anonymous";
    const id = req.params["id"];
    const { associationStatus, userFeedback } = req.body || {};

    if (!id || !["candidate", "confirmed", "dismissed", "unlikely"].includes(associationStatus)) {
      res.status(400).json({ error: "Invalid associationStatus value" });
      return;
    }

    const success = await dbService.updateAssociationFeedback(id, userId, {
      associationStatus,
      userFeedback,
    });

    if (!success) {
      res.status(404).json({ error: "Association not found or unauthorized" });
      return;
    }

    res.json({ success: true, message: "Feedback recorded successfully" });
  },

  // GET /api/room-events/insights
  async getInsights(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId || "anonymous";
    const deviceId = req.query["deviceId"] as string;
    if (!deviceId) {
      res.status(400).json({ error: "Missing deviceId query parameter" });
      return;
    }

    const days = req.query["days"] ? parseInt(req.query["days"] as string, 10) : 14;

    // Run fresh pattern analysis to ensure up-to-date transparent insights
    const insights = await roomEventService.analyzePatterns(userId, deviceId, days);

    res.json({
      success: true,
      deviceId,
      count: insights.length,
      insights,
    });
  },

  // GET /api/room-events/evidence
  // Fetches readings surrounding a target timestamp (+/- 45 minutes) for deep evidence inspection
  async getEvidenceData(req: AuthenticatedRequest, res: Response) {
    const deviceId = req.query["deviceId"] as string;
    const timestampStr = req.query["timestamp"] as string;

    if (!deviceId || !timestampStr) {
      res.status(400).json({ error: "Missing deviceId or timestamp query parameter" });
      return;
    }

    const targetTime = new Date(timestampStr).getTime();
    if (isNaN(targetTime)) {
      res.status(400).json({ error: "Invalid timestamp format" });
      return;
    }

    // 45 minutes before and after
    const windowMs = 45 * 60 * 1000;
    const since = new Date(targetTime - windowMs);
    const until = new Date(targetTime + windowMs);

    const history = await dbService.getHistory(deviceId, since);
    const readingsInWindow = history.filter((r) => {
      const t = new Date(r.timestamp).getTime();
      return t >= since.getTime() && t <= until.getTime();
    });

    res.json({
      success: true,
      deviceId,
      targetTime: new Date(targetTime).toISOString(),
      readingsCount: readingsInWindow.length,
      readings: readingsInWindow,
    });
  },
};
