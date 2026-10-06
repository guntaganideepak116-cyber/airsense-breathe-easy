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
