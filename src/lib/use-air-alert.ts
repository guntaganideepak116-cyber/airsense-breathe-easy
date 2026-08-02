import { useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { showAirAlert } from "@/lib/push";
import type { Reading } from "@/lib/airsense";

/**
 * Fires a localized notification the first time a room's air turns poor.
 * Language follows the app preference — Telugu by default.
 */
export function useAirAlert(reading: Reading | null | undefined, deviceName: string | undefined) {
  const { t, lang } = useI18n();
  const previous = useRef<string | null>(null);

  useEffect(() => {
    if (!reading) return;
    const was = previous.current;
    previous.current = reading.status;
    if (reading.status !== "poor" || was === "poor" || was === null) return;

    void showAirAlert({
      title: `${deviceName ?? t("dash.device")} — ${t("status.poor")}`,
      body: `${t("dash.sensorReading")}: ${reading.mq135} ppm · ${t("status.poor.advice")}`,
      deviceId: reading.deviceId,
      lang,
    });
  }, [reading, deviceName, t, lang]);
}
