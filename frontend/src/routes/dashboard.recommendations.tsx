import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Wind,
  HeartPulse,
  Radio,
  Thermometer,
  Droplets,
  Sparkles,
  Bot,
  RefreshCw,
  AlertCircle,
  WifiOff,
  Clock,
} from "lucide-react";
import { useI18n } from "@/client/lib/i18n";
import {
  useSelectedDevice,
  useLatest,
  useAiRecommendation,
  useRefreshAiRecommendation,
} from "@/client/lib/queries";
import { statusTheme, formatTime } from "@/shared/lib/status";
import { Button } from "@/client/components/ui/button";
import { cn } from "@/client/lib/utils";
import { toast } from "sonner";
import type { AiStatus, AiPriority } from "@/client/lib/airsense";

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

function getAiStatusBadge(status: AiStatus) {
  switch (status) {
    case "critical":
      return {
        label: "CRITICAL",
        classes: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
        dot: "bg-red-500",
      };
    case "warning":
      return {
        label: "WARNING",
        classes: "bg-poor/15 text-poor border-poor/30",
        dot: "bg-poor",
      };
    case "attention":
      return {
        label: "ATTENTION",
        classes: "bg-moderate/15 text-moderate border-moderate/30",
        dot: "bg-moderate",
      };
    case "good":
    default:
      return {
        label: "GOOD",
        classes: "bg-good/15 text-good border-good/30",
        dot: "bg-good",
      };
  }
}

function getAiPriorityBadge(priority: AiPriority) {
  switch (priority) {
    case "high":
      return {
        label: "HIGH PRIORITY",
        classes: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
      };
    case "medium":
      return {
        label: "MEDIUM PRIORITY",
        classes: "bg-moderate/10 text-moderate border-moderate/20",
      };
    case "low":
    default:
      return {
        label: "LOW PRIORITY",
        classes: "bg-secondary text-muted-foreground border-border",
      };
  }
}

function RecommendationsPage() {
  const { t, lang } = useI18n();
  const { deviceId, device } = useSelectedDevice();
  const { data: reading } = useLatest(deviceId);
  const {
    data: aiResponse,
    isLoading: isAiLoading,
    isRefetching: isAiRefetching,
  } = useAiRecommendation(deviceId, reading);
  const refreshAi = useRefreshAiRecommendation();

  const status = reading?.status ?? "good";
  const theme = statusTheme[status];

  const sensitiveGroups = [
    { name: "Children & Infants", tag: "High Risk", icon: "👶" },
    { name: "Asthma & Allergy Patients", tag: "Critical", icon: "🫁" },
    { name: "Elderly (60+ yrs)", tag: "High Risk", icon: "👴" },
    { name: "Pregnant Women", tag: "Moderate", icon: "🤰" },
    { name: "Outdoor Field Workers", tag: "Exposure Alert", icon: "👷" },
  ];

  const handleRefresh = () => {
    if (!deviceId) return;
    refreshAi.mutate(
      { deviceId, reading },
      {
        onSuccess: (res) => {
          if (res?.available) {
            toast.success("AI Recommendation updated with real sensor measurements.");
          } else if (res?.message) {
            toast.info(res.message);
          }
        },
        onError: () => {
          toast.error("Failed to connect to recommendation service.");
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink sm:text-3xl">{t("rec.title")}</h1>
          <p className="truncate text-sm text-muted-foreground">
            {device?.name ?? "Room Sensor Location"}
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 1. AI AIRSENSE RECOMMENDATION SECTION                       */}
      {/* ============================================================ */}
      <section className="rounded-3xl border bg-card p-6 shadow-sm transition-all">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Bot className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-semibold text-foreground">
                  AI AirSense Recommendation
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full border bg-secondary/60 px-2 py-0.5 text-[10px] font-medium text-primary">
                  <Sparkles className="h-3 w-3" /> Real Data
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Environmental guidance generated exclusively from live sensor measurements
              </p>
            </div>
          </div>

          {deviceId && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshAi.isPending || isAiLoading || isAiRefetching}
              className="rounded-xl text-xs"
            >
              <RefreshCw
                className={cn(
                  "mr-1.5 h-3.5 w-3.5",
                  (refreshAi.isPending || isAiRefetching) && "animate-spin",
                )}
              />
              <span>Re-analyze</span>
            </Button>
          )}
        </div>

        <div className="mt-5">
          {/* STATE 1: LOADING */}
          {(isAiLoading && !aiResponse) || refreshAi.isPending ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="relative mb-3 flex h-10 w-10 items-center justify-center">
                <div className="absolute h-10 w-10 animate-ping rounded-full bg-primary/20" />
                <Bot className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <p className="font-medium text-sm text-foreground">Analyzing current conditions...</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Evaluating real-time sensor measurements through the AirSense engine.
              </p>
            </div>
          ) : !reading || aiResponse?.state === "no_data" ? (
            /* STATE 2: NO DATA */
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
                <Radio className="h-5 w-5 animate-pulse text-muted-foreground" />
              </div>
              <p className="font-medium text-sm text-foreground">
                No recent sensor data available.
              </p>
              <p className="mt-1 max-w-md text-xs text-muted-foreground">
                AI recommendations require real sensor readings. Transmit measurements from your
                ESP32 hardware to activate recommendations.
              </p>
            </div>
          ) : aiResponse?.state === "offline" ? (
            /* STATE 3: OFFLINE */
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <WifiOff className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="font-medium text-sm text-foreground">
                Unable to analyze because the device is offline.
              </p>
              <p className="mt-1 max-w-md text-xs text-muted-foreground">
                Ensure your AirSense hardware is powered on and connected to Wi-Fi to resume
                real-time environmental guidance.
              </p>
            </div>
          ) : !aiResponse?.available || aiResponse.state === "ai_unavailable" ? (
            /* STATE 4: AI UNAVAILABLE */
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="font-medium text-sm text-foreground">
                AI recommendations are temporarily unavailable.
              </p>
              <p className="mt-1 max-w-md text-xs text-muted-foreground">
                Hardware sensor monitoring, local buzzers, and deterministic safety alerts remain
                fully active.
              </p>
              {deviceId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={refreshAi.isPending}
                  className="mt-3 rounded-xl text-xs"
                >
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                  Retry AI Analysis
                </Button>
              )}
            </div>
          ) : (
            /* STATE 5: SUCCESS */
            (() => {
              const data = aiResponse.data;
              const statusBadge = getAiStatusBadge(data.status);
              const priorityBadge = getAiPriorityBadge(data.priority);

              return (
                <div className="space-y-4">
                  {/* Status, Priority, and Sensor Tags */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider",
                        statusBadge.classes,
                      )}
                    >
                      <span className={cn("h-2 w-2 rounded-full", statusBadge.dot)} />
                      Status: {statusBadge.label}
                    </span>

                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                        priorityBadge.classes,
                      )}
                    >
                      {priorityBadge.label}
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full border bg-secondary/50 px-2.5 py-1 text-[11px] font-mono text-muted-foreground">
                      <span>MQ-135: <strong>{data.sensorData.mq135}</strong></span>
                      <span>·</span>
                      <span>{data.sensorData.temperature}°C</span>
                      <span>·</span>
                      <span>{data.sensorData.humidity}%</span>
                    </span>

                    {data.cached && (
                      <span className="inline-flex items-center gap-1 rounded-full border bg-muted/60 px-2 py-0.5 text-[10px] text-muted-foreground">
                        <Clock className="h-3 w-3" /> Cached
                      </span>
                    )}
                  </div>

                  {/* AI Summary */}
                  <div className="rounded-2xl border bg-secondary/20 p-4">
                    <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">
                      Summary
                    </p>
                    <p className="text-sm font-medium leading-relaxed text-foreground">
                      {data.summary}
                    </p>
                  </div>

                  {/* Recommended Actions */}
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2">
                      Recommended Actions
                    </p>
                    <ul className="space-y-2">
                      {data.recommendations.map((action, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 rounded-xl border bg-card p-3 text-xs sm:text-sm text-foreground/85 shadow-2xs"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Last Analyzed Timestamp */}
                  <div className="flex items-center justify-between border-t pt-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Last analyzed:{" "}
                      <span className="font-medium text-foreground">
                        {formatTime(data.analyzedAt, lang)}
                      </span>
                    </span>
                    <span>Environmental guidance only · Non-medical</span>
                  </div>
                </div>
              );
            })()
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. EXISTING RECOMMENDATIONS CONTENT                          */}
      {/* ============================================================ */}
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
