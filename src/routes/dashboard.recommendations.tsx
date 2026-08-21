import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Wind,
  Activity,
  HeartPulse,
  UserCheck,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useSelectedDevice, useLatest } from "@/lib/queries";
import { statusTheme } from "@/lib/status";
import { cn } from "@/lib/utils";

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
          <p className="truncate text-sm text-muted-foreground">{device?.name ?? "All Rooms"}</p>
        </div>
      </div>

      {/* Current Room Air Banner Callout */}
      <div className={cn("rounded-3xl border p-5 transition-all", theme.soft)}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className={cn("grid h-10 w-10 place-items-center rounded-2xl text-white", theme.dot)}
            >
              <HeartPulse className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {t("dash.airquality")}
              </p>
              <p className={cn("font-display text-xl font-bold", theme.text)}>{t(theme.label)}</p>
            </div>
          </div>
          <div className="max-w-md text-sm text-foreground/80">
            {status === "good" && t("status.good.advice")}
            {status === "moderate" && t("status.moderate.advice")}
            {status === "poor" && t("status.poor.advice")}
          </div>
        </div>
      </div>

      {/* 3-Column Recommendations Cards */}
      <div className="grid gap-5 md:grid-cols-3">
        {/* Column 1: General Guidance */}
        <section className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-primary">
            <UserCheck className="h-5 w-5" />
            <h2 className="font-display text-lg">{t("rec.general")}</h2>
          </div>
          <ul className="mt-5 space-y-3.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-good" />
              <span>
                Keep indoor rooms ventilated during morning hours when outdoor AQI is low.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-good" />
              <span>
                Use damp microfiber cloths for dusting rather than dry sweeping to prevent particle
                recirculation.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-moderate" />
              <span>Avoid burning mosquito coils or incense sticks inside closed bedrooms.</span>
            </li>
          </ul>
        </section>

        {/* Column 2: Sensitive Groups */}
        <section className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-moderate">
            <ShieldAlert className="h-5 w-5" />
            <h2 className="font-display text-lg">{t("rec.sensitive")}</h2>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Priority protection groups in AP & Telangana during high dust & smog days:
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

        {/* Column 3: Activity Guidance */}
        <section className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-good">
            <Activity className="h-5 w-5" />
            <h2 className="font-display text-lg">{t("rec.activity")}</h2>
          </div>
          <ul className="mt-5 space-y-3.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-good" />
              <span>
                <strong>Morning Yoga & Exercise:</strong> Safe outdoors between 6:00 AM – 9:00 AM.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-moderate" />
              <span>
                <strong>Classroom Sports:</strong> Shift sports to covered indoor halls if PM2.5
                crosses 400.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Wind className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                <strong>Ventilation:</strong> Open windows between 10:00 AM and 3:00 PM for airflow.
              </span>
            </li>
          </ul>
        </section>
      </div>

      {/* AQI Scale Reference Strip */}
      <section className="rounded-3xl border bg-card p-6">
        <h3 className="font-display text-lg">{t("rec.scale")}</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Threshold scale guidelines for MQ135 sensor readings (ppm):
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border bg-good-soft/40 p-4 border-good/30">
            <div className="flex items-center justify-between">
              <span className="font-display text-base font-semibold text-good">Good (బాగుంది)</span>
              <span className="rounded-full bg-good/20 px-2.5 py-0.5 text-xs font-mono text-good">
                &lt; 400 ppm
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
                400 – 700 ppm
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
                &gt; 700 ppm
              </span>
            </div>
            <p className="mt-2 text-xs text-foreground/70">
              Stuffy air with high VOC/dust. Local buzzer sounds. Open windows immediately.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
