export type AirStatus = "good" | "moderate" | "poor";

export function classifyAirQuality(mq135: number): AirStatus {
  const moderateThreshold = Number(process.env.MODERATE_THRESHOLD || 400);
  const poorThreshold = Number(process.env.POOR_THRESHOLD || 700);

  if (mq135 < moderateThreshold) return "good";
  if (mq135 < poorThreshold) return "moderate";
  return "poor";
}
