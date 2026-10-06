import { createFileRoute } from "@tanstack/react-router";
import { CloudSun, Droplets, Gauge, Thermometer, Wind, Radio, AlertCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useSelectedDevice, useLatest } from "@/lib/queries";
import { useOutdoorWeather } from "@/lib/outdoor";
import { statusTheme, formatTime } from "@/lib/status";
import { BreathingOrb } from "@/components/BreathingOrb";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/weather")({
  head: () => ({
    meta: [
      { title: "Weather & Regional AQI — AirSense" },
      {
        name: "description",
        content:
          "Live weather status, outdoor regional AQI, and indoor sensor comparison for AP & Telangana.",
      },
    ],
  }),
  component: WeatherPage,
});

function WeatherPage() {
  const { t, lang } = useI18n();
  const { deviceId, device } = useSelectedDevice();
  const { data: reading, isLoading: isReadingLoading } = useLatest(deviceId);
  const {
    data: outdoor,
    isLoading: isOutdoorLoading,
    isError: isOutdoorError,
  } = useOutdoorWeather();

  const indoorStatus = reading?.status ?? "good";
  const indoorTheme = statusTheme[indoorStatus];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink sm:text-3xl">{t("weather.title")}</h1>
          <p className="truncate text-sm text-muted-foreground">
            {device?.name
              ? `${device.name} · Indoor vs Outdoor Comparison`
              : "Indoor vs Outdoor Regional Meteorology"}
          </p>
        </div>
      </div>

      {/* INDOOR SENSOR BANNER CARD */}
      <section
        className={cn(
          "status-transition rounded-3xl border p-6 lg:p-8",
          reading ? indoorTheme.soft : "bg-card",
        )}
      >
        <div className="grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
          <BreathingOrb status={indoorStatus} size="sm" className="mx-auto h-36! w-36! lg:mx-0" />
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Radio className="h-4 w-4 text-primary animate-pulse" />
              <span>Indoor Hardware Sensor (MQ-135 + DHT22)</span>
            </div>
            <p
              className={cn(
                "mt-1 font-display text-4xl font-bold lg:text-5xl",
                reading ? indoorTheme.text : "text-foreground",
              )}
            >
              {reading ? t(indoorTheme.label) : "Waiting for Sensor Data"}
            </p>
            <p className="mt-2 text-sm text-foreground/80">
              Assigned Room:{" "}
              <span className="font-semibold text-foreground">
                {device?.name ?? "No room selected"}
              </span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("dash.updated")}:{" "}
              <span className="tabular-nums font-mono">
                {reading ? formatTime(reading.timestamp, lang) : "No readings recorded yet"}
              </span>
            </p>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border bg-card/70 p-4 text-center">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              MQ-135 Reading
            </span>
            <span className="mt-1 font-display text-3xl font-bold tabular-nums text-primary">
              {reading?.mq135 ?? "—"}
            </span>
            <span className="text-[11px] text-muted-foreground">Raw Sensor Value</span>
          </div>
        </div>
      </section>

      {/* INDOOR METRICS TILES */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Indoor Hardware Readings
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {t("dash.temp")} (Indoor)
              </span>
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-moderate-soft text-moderate">
                <Thermometer className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tabular-nums">
              {reading?.temperature != null ? `${reading.temperature} °C` : "—"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {reading ? "DHT22 Hardware" : "Awaiting hardware packet"}
            </p>
          </div>

          <div className="rounded-3xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {t("dash.humidity")} (Indoor)
              </span>
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-good-soft text-good">
                <Droplets className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tabular-nums">
              {reading?.humidity != null ? `${reading.humidity} %` : "—"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {reading ? "DHT22 Hardware" : "Awaiting hardware packet"}
            </p>
          </div>

          <div className="rounded-3xl border bg-card p-5 shadow-sm sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Hardware Status</span>
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-soft text-primary">
                <Radio className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-3 font-display text-2xl font-bold tabular-nums">
              {reading?.online ? "Device Online" : "Device Offline"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {reading ? "ESP32 Wi-Fi Transmission" : "Waiting for ESP32 connection"}
            </p>
          </div>
        </div>
      </div>

      {/* OUTDOOR METEOROLOGY & REGIONAL AQI SECTION */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Outdoor Regional Weather & AQI (Open-Meteo Live API)
          </h2>
          {outdoor && (
            <span className="text-xs text-muted-foreground font-mono">{outdoor.station}</span>
          )}
        </div>

        {isOutdoorLoading ? (
          <Skeleton className="h-44 rounded-3xl" />
        ) : isOutdoorError ? (
          <div className="flex items-center gap-3 rounded-3xl border border-destructive/20 bg-destructive/10 p-5 text-sm text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>
              Outdoor weather and AQI service is currently unavailable. Indoor sensor monitoring
              remains active.
            </p>
          </div>
        ) : outdoor ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Regional Outdoor AQI
                </span>
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-soft text-primary">
                  <Gauge className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-3 font-display text-3xl font-bold tabular-nums text-moderate">
                {outdoor.aqi ?? "—"}{" "}
                <span className="text-sm font-normal text-muted-foreground">US AQI</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                PM2.5: {outdoor.pm25 ?? "—"} μg/m³ · PM10: {outdoor.pm10 ?? "—"} μg/m³
              </p>
            </div>

            <div className="rounded-3xl border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Outdoor Temperature
                </span>
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-moderate-soft text-moderate">
                  <Thermometer className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-3 font-display text-3xl font-bold tabular-nums">
                {outdoor.temperature != null ? `${outdoor.temperature} °C` : "—"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Open-Meteo Regional Station</p>
            </div>

            <div className="rounded-3xl border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Outdoor Humidity</span>
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-good-soft text-good">
                  <Droplets className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-3 font-display text-3xl font-bold tabular-nums">
                {outdoor.humidity != null ? `${outdoor.humidity} %` : "—"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Regional Atmosphere</p>
            </div>

            <div className="rounded-3xl border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Wind & Airflow</span>
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-soft text-primary">
                  <Wind className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-3 font-display text-3xl font-bold tabular-nums">
                {outdoor.windSpeed != null ? `${outdoor.windSpeed} km/h` : "—"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Surface Wind Velocity</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
