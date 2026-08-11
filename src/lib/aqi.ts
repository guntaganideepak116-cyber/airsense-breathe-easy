/**
 * MQ135 → Air Quality Index presentation helpers.
 *
 * The MQ135 gives a single raw analog value (0–4095 on a 12-bit ADC) that
 * represents overall air contamination — not a per-gas breakdown. We map that
 * raw value onto a 0–100 index with min–max normalisation against the two
 * calibration reference points captured during setup.
 */

/** ADC reading in calibrated clean/dry air. */
export const ADC_CLEAN = 450;
/** ADC reading at the calibrated "poor air" reference point. */
export const ADC_POOR = 3200;

/** ppm value reported by the firmware, converted back to the raw ADC count. */
export function adcFromPpm(mq135: number) {
  const ppmClean = 250;
  const ppmPoor = 900;
  const ratio = (mq135 - ppmClean) / (ppmPoor - ppmClean);
  return Math.max(0, Math.min(4095, Math.round(ADC_CLEAN + ratio * (ADC_POOR - ADC_CLEAN))));
}

/** Min–max normalised 0–100 index. Higher means more contaminated air. */
export function aqiScoreFromAdc(adc: number) {
  const raw = ((adc - ADC_CLEAN) / (ADC_POOR - ADC_CLEAN)) * 100;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

export function aqiScoreFromPpm(mq135: number) {
  return aqiScoreFromAdc(adcFromPpm(mq135));
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
