import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Wind,
  Activity,
  HeartPulse,
  UserCheck,
  Radio,
  Thermometer,
  Droplets,
} from "lucide-react";
import { useI18n } from "@/client/lib/i18n";
import { useSelectedDevice, useLatest } from "@/client/lib/queries";
import { statusTheme } from "@/shared/lib/status";
import { cn } from "@/client/lib/utils";

export const Route = createFileRoute("/dashboard/recommendations")({
  head: () => ({
    meta: [
      { title: "Air Quality Recommendations — AirSense" },
      {
        name: "description",
        content: "Contextual guidance for sensitive groups, general health, and activity safety.",
      },
    ],
  }),
  component: RecommendationsPage,
});

function RecommendationsPage() {
  const { t } = useI18n();
  const { deviceId, device } = useSelectedDevice();
  const { data: reading } = useLatest(deviceId);

  const status = reading?.status ?? "good";
  const theme = statusTheme[status];

  const sensitiveGroups = [
    { name: "Children & Infants", tag: "High Risk", icon: "👶" },
    { name: "Asthma & Allergy Patients", tag: "Critical", icon: "🫁" },
    { name: "Elderly (60+ yrs)", tag: "High Risk", icon: "👴" },
    { name: "Pregnant Women", tag: "Moderate", icon: "🤰" },
    { name: "Outdoor Field Workers", tag: "Exposure Alert", icon: "👷" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink sm:text-3xl">{t("rec.title")}</h1>
          <p className="truncate text-sm text-muted-foreground">
            {device?.name ?? "Room Sensor Location"}
          </p>
        </div>
      </div>

      {!reading ? (
        /* Empty State when insufficient real data exists */
        <div className="rounded-3xl border bg-card p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/80 text-muted-foreground">
            <Radio className="h-8 w-8 animate-pulse text-primary" />
          </div>
          <h2 className="mt-4 font-display text-xl font-bold text-foreground">
            Not enough sensor data to generate recommendations.
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Connect your AirSense ESP32 device to this room to receive personalized, real-time
            health and ventilation recommendations.
          </p>
        </div>
      ) : (
        <>
          {/* Current Room Air Banner Callout */}
          <div className={cn("rounded-3xl border p-5 transition-all", theme.soft)}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-2xl text-white",
                    theme.dot,
                  )}
                >
                  <HeartPulse className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    {t("dash.airquality")}
                  </p>
                  <p className={cn("font-display text-xl font-bold", theme.text)}>
                    {t(theme.label)}
                  </p>
                </div>
              </div>
              <div className="max-w-md text-sm text-foreground/80">
                {status === "good" && t("status.good.advice")}
                {status === "moderate" && t("status.moderate.advice")}
                {status === "poor" && t("status.poor.advice")}
              </div>
            </div>
          </div>

          {/* DYNAMIC REAL-DATA RECOMMENDATIONS */}
          <div className="grid gap-5 md:grid-cols-3">
            {/* Column 1: Air Quality Recommendation */}
            <section className="rounded-3xl border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 text-primary">
                <Wind className="h-5 w-5" />
                <h2 className="font-display text-lg">Ventilation & Airflow</h2>
              </div>
              <ul className="mt-5 space-y-3.5 text-sm text-muted-foreground">
                {reading.mq135 >= 700 ? (
                  <li className="flex items-start gap-2.5 text-poor">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <strong>Immediate action:</strong> High air contamination detected (MQ-135:{" "}
                      {reading.mq135}). Open windows or activate exhaust fans immediately.
                    </span>
                  </li>
                ) : reading.mq135 >= 400 ? (
                  <li className="flex items-start gap-2.5 text-moderate">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <strong>Ventilation needed:</strong> Moderate air contamination (MQ-135:{" "}
                      {reading.mq135}). Consider opening a window for fresh air circulation.
                    </span>
                  </li>
                ) : (
                  <li className="flex items-start gap-2.5 text-good">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <strong>Air quality is clean:</strong> MQ-135 reading is low ({reading.mq135}
                      ). Ideal environment for children, students, and sleeping.
                    </span>
                  </li>
                )}
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-good" />
                  <span>
                    Use damp microfiber cloths for dusting to prevent recirculating particles.
                  </span>
                </li>
              </ul>
            </section>

            {/* Column 2: Temperature & Humidity Comfort */}
            <section className="rounded-3xl border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 text-moderate">
                <Thermometer className="h-5 w-5" />
                <h2 className="font-display text-lg">Thermal Comfort</h2>
              </div>
              <ul className="mt-5 space-y-3.5 text-sm text-muted-foreground">
                {reading.temperature > 32 ? (
                  <li className="flex items-start gap-2.5 text-moderate">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <strong>High Temperature ({reading.temperature}°C):</strong> Increase room
                      airflow with fans or air conditioning to reduce heat stress.
                    </span>
                  </li>
                ) : (
                  <li className="flex items-start gap-2.5 text-good">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <strong>Temperature Comfort ({reading.temperature}°C):</strong> Indoor thermal
                      level is within safe bounds.
                    </span>
                  </li>
                )}

                {reading.humidity > 65 ? (
                  <li className="flex items-start gap-2.5 text-moderate">
                    <Droplets className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <strong>High Humidity ({reading.humidity}%):</strong> Excessive moisture can
                      promote mold and allergen accumulation. Keep airflow moving.
                    </span>
                  </li>
                ) : reading.humidity < 35 ? (
                  <li className="flex items-start gap-2.5 text-moderate">
                    <Droplets className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <strong>Low Humidity ({reading.humidity}%):</strong> Dry indoor air may cause
                      throat or nasal irritation.
                    </span>
                  </li>
                ) : (
                  <li className="flex items-start gap-2.5 text-good">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <strong>Balanced Humidity ({reading.humidity}%):</strong> Moisture level is
                      healthy for lungs and skin.
                    </span>
                  </li>
                )}
              </ul>
            </section>

            {/* Column 3: Sensitive Groups Guidance */}
            <section className="rounded-3xl border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 text-primary">
                <ShieldAlert className="h-5 w-5" />
                <h2 className="font-display text-lg">{t("rec.sensitive")}</h2>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Active health alerts based on current indoor reading ({reading.status}):
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {sensitiveGroups.map((g) => (
                  <span
                    key={g.name}
                    className="inline-flex items-center gap-1.5 rounded-full border bg-secondary/60 px-3 py-1.5 text-xs font-medium text-foreground"
                  >
                    <span>{g.icon}</span>
                    <span>{g.name}</span>
                    <span className="rounded-md bg-card px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      {g.tag}
                    </span>
                  </span>
                ))}
              </div>
            </section>
          </div>
        </>
      )}

      {/* AQI Scale Reference Strip */}
      <section className="rounded-3xl border bg-card p-6">
        <h3 className="font-display text-lg">{t("rec.scale")}</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Calibrated threshold bands for MQ-135 sensor readings:
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border bg-good-soft/40 p-4 border-good/30">
            <div className="flex items-center justify-between">
              <span className="font-display text-base font-semibold text-good">Good (బాగుంది)</span>
              <span className="rounded-full bg-good/20 px-2.5 py-0.5 text-xs font-mono text-good">
                &lt; 400
              </span>
            </div>
            <p className="mt-2 text-xs text-foreground/70">
              Clean, breathable indoor air. Ideal for study, focus, and sleeping.
            </p>
          </div>

          <div className="rounded-2xl border bg-moderate-soft/40 p-4 border-moderate/30">
            <div className="flex items-center justify-between">
              <span className="font-display text-base font-semibold text-moderate">
                Moderate (మధ్యస్థం)
              </span>
              <span className="rounded-full bg-moderate/20 px-2.5 py-0.5 text-xs font-mono text-moderate">
                400 – 700
              </span>
            </div>
            <p className="mt-2 text-xs text-foreground/70">
              Acceptable air quality. Consider opening a window for fresh air circulation.
            </p>
          </div>

          <div className="rounded-2xl border bg-poor-soft/40 p-4 border-poor/30">
            <div className="flex items-center justify-between">
              <span className="font-display text-base font-semibold text-poor">Poor (పేలవం)</span>
              <span className="rounded-full bg-poor/20 px-2.5 py-0.5 text-xs font-mono text-poor">
                &gt; 700
              </span>
            </div>
            <p className="mt-2 text-xs text-foreground/70">
              Elevated contaminants/VOCs. Local buzzer sounds. Open windows immediately.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
