/**
 * Air quality classification utility based on MQ-135 sensor threshold boundaries.
 * All fake simulation logic (noise, diurnal curves, mock generators) has been removed.
 */
export type AirStatus = "good" | "moderate" | "poor";

export function classify(mq135: number): AirStatus {
  if (mq135 < 400) return "good";
  if (mq135 < 700) return "moderate";
  return "poor";
}
