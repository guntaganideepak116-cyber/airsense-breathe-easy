import type { Request, Response } from "express";
import { getLiveWeatherAndAqi } from "../services/weatherService.js";

export const weatherController = {
  async getWeather(req: Request, res: Response) {
    const lat = (req.query["lat"] as string) || "16.5062";
    const lon = (req.query["lon"] as string) || "80.6480";

    try {
      const data = await getLiveWeatherAndAqi(lat, lon);
      res.json(data);
    } catch (err: unknown) {
      res.status(502).json({
        error: "Failed to connect to weather API",
        details: err instanceof Error ? err.message : String(err),
      });
    }
  },
};
