import type { Response } from "express";
import { z } from "zod";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { dbService } from "../services/dbService.js";

const patchSchema = z.object({
  phoneNumber: z.string().trim().max(20).optional(),
  whatsappNumber: z.string().trim().max(20).optional(),
  email: z.string().trim().email().max(100).optional().or(z.literal("")),
  alertChannels: z
    .object({
      sms: z.boolean().optional(),
      whatsapp: z.boolean().optional(),
      email: z.boolean().optional(),
    })
    .optional(),
  threshold: z.number().min(400).max(1000).optional(),
});

export const userController = {
  async getPreferences(req: AuthenticatedRequest, res: Response) {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const prefs = await dbService.getUserPreferences(req.userId);
    res.json(prefs);
  },

  async updatePreferences(req: AuthenticatedRequest, res: Response) {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const parseResult = patchSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: "Invalid preference data",
        details: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const updated = await dbService.updateUserPreferences(req.userId, parseResult.data);
    res.json(updated);
  },
};
