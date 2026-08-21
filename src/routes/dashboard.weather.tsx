import { createFileRoute } from "@tanstack/react-router";
import { CloudSun, Droplets, Gauge, Thermometer, Wind } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useSelectedDevice, useLatest } from "@/lib/queries";
import { statusTheme, formatTime } from "@/lib/status";
import { BreathingOrb } from "@/components/BreathingOrb";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/weather")({
  head: () => ({
    meta: [
      { title: "Weather & Regional AQI — AirSense" },
      {
        name: "description",
        content:
          "Weather status, humidity, temperature and outdoor regional AQI for AP & Telangana.",
      },
    ],
  }),
  component: WeatherPage,
});

function WeatherPage() {
  const { t, lang } = useI18n();
  const { deviceId, device } = useSelectedDevice();
  const { data: reading } = useLatest(deviceId);

  const status = reading?.status ?? "good";
  const theme = statusTheme[status];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink sm:text-3xl">{t("weather.title")}</h1>
          <p className="truncate text-sm text-muted-foreground">
            {device?.name ?? "Room Sensor Location"}
          </p>
        </div>
      </div>

      {/* Weather-Style Main Banner Card */}
      <section className={cn("status-transition rounded-3xl border p-6 lg:p-8", theme.soft)}>
        <div className="grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
          <BreathingOrb status={status} size="sm" className="mx-auto h-36! w-36! lg:mx-0" />
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CloudSun className="h-4 w-4 text-primary" />
              <span>Indoor Comfort Index</span>
            </div>
            <p className={cn("mt-1 font-display text-4xl font-bold lg:text-5xl", theme.text)}>
              {t(theme.label)}
            </p>
            <p className="mt-2 text-sm text-foreground/80">
              Dominant Factor:{" "}
              <span className="font-semibold text-foreground">
                Traffic Dust & PM2.5 (AP/Telangana Season)
              </span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("dash.updated")}:{" "}
              <span className="tabular-nums font-mono">
                {reading ? formatTime(reading.timestamp, lang) : "—"}
              </span>
            </p>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border bg-card/70 p-4 text-center">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              MQ135 Reading
            </span>
            <span className="mt-1 font-display text-3xl font-bold tabular-nums text-primary">
              {reading?.mq135 ?? 320}{" "}
              <span className="text-sm font-normal text-muted-foreground">ppm</span>
            </span>
          </div>
        </div>
      </section>

      {/* Supporting Weather Stat Tiles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Tile 1: Temperature */}
        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{t("dash.temp")}</span>
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-moderate-soft text-moderate">
              <Thermometer className="h-5 w-5" />
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold tabular-nums">
            {reading?.temperature ?? 28.5}{" "}
            <span className="text-sm font-normal text-muted-foreground">°C</span>
          </p>
          <p className="mt-1 text-xs text-good">{t("dash.comfort.ok")}</p>
        </div>

        {/* Tile 2: Humidity */}
        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{t("dash.humidity")}</span>
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-good-soft text-good">
              <Droplets className="h-5 w-5" />
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold tabular-nums">
            {reading?.humidity ?? 52}{" "}
            <span className="text-sm font-normal text-muted-foreground">%</span>
          </p>
          <p className="mt-1 text-xs text-good">{t("dash.comfort.ok")}</p>
        </div>

        {/* Tile 3: Outdoor Regional AQI */}
        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Regional Outdoor AQI</span>
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-soft text-primary">
              <Gauge className="h-5 w-5" />
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold tabular-nums text-moderate">
            142 <span className="text-sm font-normal text-muted-foreground">AQI</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Vijayawada / Visakhapatnam Station</p>
        </div>

        {/* Tile 4: Air Circulation */}
        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Air Circulation</span>
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-soft text-primary">
              <Wind className="h-5 w-5" />
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold tabular-nums">
            8.5 <span className="text-sm font-normal text-muted-foreground">km/h</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Gentle Indoor Airflow</p>
        </div>
      </div>
    </div>
  );
}
