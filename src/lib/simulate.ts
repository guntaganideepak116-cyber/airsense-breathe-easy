/**
 * Shared, dependency-free air-quality simulation.
 * Used by the SSE stream on the server and by the client fallback,
 * so both agree on the same deterministic diurnal curve.
 */
export type AirStatus = "good" | "moderate" | "poor";

export function classify(mq135: number): AirStatus {
  if (mq135 < 400) return "good";
  if (mq135 < 700) return "moderate";
  return "poor";
}

export function noise(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export function baseFor(deviceId: string) {
  return deviceId.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 120;
}

/** Diurnal curve: worse in the late afternoon (traffic + crop burning). */
export function mq135At(deviceId: string, date: Date, bucket: number) {
  const hour = date.getHours() + date.getMinutes() / 60;
  const evening = Math.exp(-Math.pow(hour - 17, 2) / 6) * 380;
  const morning = Math.exp(-Math.pow(hour - 8, 2) / 8) * 180;
  const base = 280 + baseFor(deviceId);
  return Math.round(base + evening + morning + noise(bucket + baseFor(deviceId)) * 120 - 40);
}

export function makeReading(deviceId: string) {
  const now = new Date();
  const bucket = Math.floor(now.getTime() / 15000);
  const mq135 = mq135At(deviceId, now, bucket);
  const status = classify(mq135);
  const lastPoor = new Date(now.getTime() - (2 + noise(bucket) * 20) * 3600_000);
  return {
    deviceId,
    status,
    mq135,
    temperature: Math.round((28 + noise(bucket + 1) * 6) * 10) / 10,
    humidity: Math.round(42 + noise(bucket + 2) * 30),
    timestamp: now.toISOString(),
    buzzerActive: status === "poor",
    lastPoorAt: lastPoor.toISOString(),
    online: true,
  };
}
