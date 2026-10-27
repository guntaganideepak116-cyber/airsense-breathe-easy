import type { Request, Response } from "express";
import { dbService } from "../services/dbService.js";
import { generateAirQualityRecommendation } from "../services/aiRecommendationService.js";
import { generateAirQualityRecommendations } from "../services/aiService.js";

export const aiController = {
  /**
   * GET /api/ai/recommendation?deviceId=...
   * Fetches latest REAL sensor reading from database and runs the AI recommendation engine.
   * Strictly enforces real sensor data, device status, and fallback states.
   */
  async getDeviceRecommendation(req: Request, res: Response) {
    const deviceId = (req.query["deviceId"] as string)?.trim();
    const forceRefresh = req.query["refresh"] === "true";

    if (!deviceId) {
      res.status(400).json({ error: "Missing deviceId query parameter" });
      return;
    }

    try {
      const device = await dbService.getDeviceById(deviceId);
      let reading = await dbService.getLatestReading(deviceId);

      // Support fallback telemetry from active client session (resilient across server restarts)
      const qMq135 = parseFloat(req.query["mq135"] as string);
      const qTemp = parseFloat(req.query["temperature"] as string);
      const qHum = parseFloat(req.query["humidity"] as string);
      const qRoom = (req.query["roomName"] as string)?.trim();

      if (!reading && !isNaN(qMq135) && !isNaN(qTemp) && !isNaN(qHum)) {
        reading = {
          deviceId,
          roomName: qRoom || device?.name || "Indoor Room",
          mq135: Math.round(qMq135),
          temperature: qTemp,
          humidity: qHum,
          status: qMq135 < 400 ? "good" : qMq135 < 700 ? "moderate" : "poor",
          buzzerActive: qMq135 >= 700,
          timestamp: new Date(),
        };
      }

      if (!reading) {
        res.json({
          available: false,
          state: "no_data",
          message: "AI recommendations are unavailable because no recent sensor data is available.",
          deviceId,
        });
        return;
      }

      // Check online heartbeat (active within 15 minutes)
      const now = Date.now();
      const lastSeenAge = device?.lastSeen ? now - new Date(device.lastSeen).getTime() : Infinity;
      const readingAge = now - new Date(reading.timestamp).getTime();
      const isOnline = lastSeenAge < 15 * 60 * 1000 || readingAge < 15 * 60 * 1000;

      if (!isOnline && readingAge > 30 * 60 * 1000) {
        res.json({
          available: false,
          state: "offline",
          message: "Unable to analyze because the device is offline.",
          deviceId,
          lastSeen: device?.lastSeen
            ? new Date(device.lastSeen).toISOString()
            : new Date(reading.timestamp).toISOString(),
        });
        return;
      }

      // Generate recommendation with real sensor data
      try {
        const recommendation = await generateAirQualityRecommendation(
          {
            deviceId: reading.deviceId,
            roomName: device?.name || reading.roomName || qRoom || "Indoor Room",
            mq135: reading.mq135,
            temperature: reading.temperature,
            humidity: reading.humidity,
            timestamp: reading.timestamp,
          },
          { forceRefresh, userId: device?.userId },
        );

        res.json({
          available: true,
          state: "success",
          data: recommendation,
        });
      } catch (aiErr) {
        console.warn("[aiController] AI generation error:", aiErr instanceof Error ? aiErr.message : aiErr);
        res.json({
          available: false,
          state: "ai_unavailable",
          message: "AI recommendations are temporarily unavailable.",
          deviceId,
        });
      }
    } catch (err) {
      console.error("[aiController] Unexpected error:", err);
      res.status(500).json({
        available: false,
        state: "ai_unavailable",
        message: "AI recommendations are temporarily unavailable.",
      });
    }
  },

  /**
   * Backwards-compatible legacy route
   * GET /api/ai/recommendations
   */
  getRecommendations(req: Request, res: Response) {
    const mq135 = parseFloat(req.query["mq135"] as string) || 350;
    const temp = parseFloat(req.query["temperature"] as string) || 24;
    const humidity = parseFloat(req.query["humidity"] as string) || 50;
    const outdoorAqi = parseFloat(req.query["outdoorAqi"] as string) || 45;
    const roomName = (req.query["roomName"] as string) || "Indoor Room";

    const result = generateAirQualityRecommendations({
      mq135,
      temperature: temp,
      humidity,
      outdoorAqi,
      roomName,
    });

    res.json(result);
  },

  /**
   * Backwards-compatible legacy route
   * POST /api/ai/analyze
   */
  analyzeAir(req: Request, res: Response) {
    const { mq135 = 350, temperature = 24, humidity = 50, outdoorAqi = 45, roomName = "Indoor Room" } =
      req.body || {};
    const result = generateAirQualityRecommendations({
      mq135,
      temperature,
      humidity,
      outdoorAqi,
      roomName,
    });
    res.json(result);
  },
};
