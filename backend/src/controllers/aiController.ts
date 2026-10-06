import type { Request, Response } from "express";
import { generateAirQualityRecommendations } from "../services/aiService.js";

export const aiController = {
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

  analyzeAir(req: Request, res: Response) {
    const { mq135 = 350, temperature = 24, humidity = 50, outdoorAqi = 45, roomName = "Indoor Room" } = req.body || {};
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
