/**
 * MQ-135 Air Quality Sensor Value presentation helpers.
 *
 * The MQ-135 gives a single raw analog value (0–4095 on a 12-bit ADC) that
 * represents overall air contamination — not a per-gas breakdown. We map that
 * raw value onto a 0–100 index with min–max normalisation against calibration reference points.
 */

/** ADC reading in calibrated clean/dry air. */
export const ADC_CLEAN = 450;
/** ADC reading at the calibrated "poor air" reference point. */
export const ADC_POOR = 3200;

/** Raw sensor value reported by the firmware, converted to an estimated ADC count. */
export function adcFromSensorValue(mq135: number) {
  const cleanRef = 250;
  const poorRef = 900;
  const ratio = (mq135 - cleanRef) / (poorRef - cleanRef);
  return Math.max(0, Math.min(4095, Math.round(ADC_CLEAN + ratio * (ADC_POOR - ADC_CLEAN))));
}

// Backward compatible alias
export const adcFromPpm = adcFromSensorValue;

/** Min–max normalised 0–100 index. Higher means more contaminated air. */
export function aqiScoreFromAdc(adc: number) {
  const raw = ((adc - ADC_CLEAN) / (ADC_POOR - ADC_CLEAN)) * 100;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

export function aqiScoreFromSensorValue(mq135: number) {
  return aqiScoreFromAdc(adcFromSensorValue(mq135));
}

// Backward compatible alias
export const aqiScoreFromPpm = aqiScoreFromSensorValue;

/**
 * Maps raw MQ-135 sensor signal to an equivalent Indoor AQI (0–500 scale)
 * aligned with standard environmental US AQI bands for direct indoor vs outdoor comparison:
 * - Clean Baseline (MQ <= 400): AQI 15–50 (Good 🟢)
 * - Moderate (400 < MQ <= 700): AQI 51–100 (Moderate 🟡)
 * - Poor / Smoke (700 < MQ <= 1500): AQI 101–300 (Poor / Contaminated 🔴)
 * - Extreme (> 1500): AQI 301–500 (Hazardous 🔴)
 */
export function indoorAqiFromMq135(mq135: number | null | undefined): number | null {
  if (mq135 == null || isNaN(mq135) || mq135 <= 0) return null;
  if (mq135 <= 400) {
    const norm = Math.max(0, (mq135 - 200) / (400 - 200));
    return Math.round(15 + norm * 35);
  }
  if (mq135 <= 700) {
    const norm = (mq135 - 400) / (700 - 400);
    return Math.round(51 + norm * 49);
  }
  if (mq135 <= 1500) {
    const norm = (mq135 - 700) / (1500 - 700);
    return Math.round(101 + norm * 199);
  }
  const norm = Math.min(1, (mq135 - 1500) / 2500);
  return Math.round(300 + norm * 200);
}

export type Band = "low" | "ok" | "high";

export function tempBand(c: number): Band {
  if (c < 18) return "low";
  if (c > 32) return "high";
  return "ok";
}

export function humidityBand(h: number): Band {
  if (h < 30) return "low";
  if (h > 65) return "high";
  return "ok";
}

export const TEMP_MIN = 15;
export const TEMP_MAX = 45;
