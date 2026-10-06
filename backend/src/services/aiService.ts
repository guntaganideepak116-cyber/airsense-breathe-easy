import type { AirStatus } from "../models/types.js";

export interface AIRecommendationRequest {
  mq135: number;
  temperature: number;
  humidity: number;
  outdoorAqi?: number | null;
  roomName?: string;
}

export interface AIRecommendationResponse {
  overallHealthScore: number; // 0 - 100
  status: AirStatus;
  primaryAdvice: string;
  ventilationStrategy: "open_windows" | "keep_closed_run_purifier" | "run_dehumidifier" | "normal";
  sensitiveGroupGuidance: {
    children: string;
    asthma: string;
    elderly: string;
    pregnancy: string;
  };
  smartActions: string[];
  generatedAt: string;
}

export function generateAirQualityRecommendations(
  data: AIRecommendationRequest,
): AIRecommendationResponse {
  const { mq135, temperature, humidity, outdoorAqi = 45, roomName = "Monitored Space" } = data;

  let status: AirStatus = "good";
  let score = 95;

  if (mq135 >= 700) {
    status = "poor";
    score = Math.max(20, Math.round(100 - (mq135 / 1000) * 60));
  } else if (mq135 >= 400) {
    status = "moderate";
    score = Math.round(85 - ((mq135 - 400) / 300) * 25);
  }

  let ventilation: "open_windows" | "keep_closed_run_purifier" | "run_dehumidifier" | "normal" =
    "normal";
  let primaryAdvice = "Air quality is pristine. Normal ventilation and activity recommended.";

  if (status === "poor") {
    if (outdoorAqi && outdoorAqi < 100) {
      ventilation = "open_windows";
      primaryAdvice = `Elevated indoor contamination detected in ${roomName}. Outdoor air is relatively clean (AQI: ${outdoorAqi}); open windows to dilute pollutants immediately.`;
    } else {
      ventilation = "keep_closed_run_purifier";
      primaryAdvice = `Poor indoor air and high outdoor pollution. Keep windows sealed and operate an air purifier or HEPA ventilation.`;
    }
  } else if (status === "moderate") {
    primaryAdvice = `Moderate air quality detected in ${roomName}. Ensure gentle air exchange or periodic window opening.`;
  }

  if (humidity > 70) {
    ventilation = "run_dehumidifier";
    primaryAdvice += " High relative humidity may promote mold and dust mites.";
  }

  return {
    overallHealthScore: score,
    status,
    primaryAdvice,
    ventilationStrategy: ventilation,
    sensitiveGroupGuidance: {
      children:
        status === "poor"
          ? "Keep children away from dusty/cooking zones; limit vigorous indoor play."
          : "Safe for regular activity and study sessions.",
      asthma:
        status === "poor"
          ? "CRITICAL: Keep rescue inhaler nearby; air contains irritants."
          : "Low respiratory trigger risk.",
      elderly:
        status === "poor"
          ? "Ensure comfortable seating in a well-ventilated secondary room."
          : "Favorable conditions for relaxation.",
      pregnancy:
        status === "poor"
          ? "Avoid prolonged exposure in this room until pollutants dissipate."
          : "Normal indoor conditions.",
    },
    smartActions: [
      status === "poor" ? "Open cross-ventilation windows" : "Maintain normal airflow",
      humidity > 65 ? "Turn on AC or exhaust fan to lower humidity" : "Maintain current moisture level",
      temperature > 30 ? "Cool room temperature to prevent heat stress" : "Room temperature is comfortable",
      "Ensure sensors remain unobstructed by curtains or walls",
    ],
    generatedAt: new Date().toISOString(),
  };
}
