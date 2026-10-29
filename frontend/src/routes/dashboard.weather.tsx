import { createFileRoute } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowDownUp,
  ChevronRight,
  Droplets,
  Gauge,
  Radio,
  Thermometer,
  Wind,
} from "lucide-react";
import { useI18n } from "@/client/lib/i18n";
import { useSelectedDevice, useDevices, useLatest, useDeviceStream } from "@/client/lib/queries";
import { useOutdoorWeather } from "@/client/lib/outdoor";
import { statusTheme, formatTime } from "@/shared/lib/status";
import { indoorAqiFromMq135 } from "@/shared/lib/aqi";
import { BreathingOrb } from "@/client/components/BreathingOrb";
import { Skeleton } from "@/client/components/ui/skeleton";
import { cn } from "@/client/lib/utils";

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
  const { deviceId, device, select: setDeviceId } = useSelectedDevice();
  const { data: devicesList } = useDevices();

  // Instant real-time SSE stream with polling fallback
  const { data: polled } = useLatest(deviceId);
  const { reading: streamed, status: streamStatus } = useDeviceStream(deviceId);
  const reading = streamed ?? polled;

  const {
    data: outdoor,
    isLoading: isOutdoorLoading,
    isError: isOutdoorError,
  } = useOutdoorWeather();

  const indoorStatus = reading?.status ?? "good";
  const indoorTheme = statusTheme[indoorStatus];

  // Derived real-time Indoor AQI
  const indoorAqi = indoorAqiFromMq135(reading?.mq135);
  const outdoorAqi = outdoor?.aqi ?? null;
  const isIndoorWorse = indoorAqi != null && outdoorAqi != null && indoorAqi > outdoorAqi;

  return (
    <div className="space-y-6">
      {/* Top Header with Room Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink sm:text-3xl">{t("weather.title")}</h1>
          <p className="truncate text-sm text-muted-foreground">
            {device?.name
              ? `${device.name} · Indoor vs Outdoor Comparison`
              : "Indoor vs Outdoor Regional Meteorology"}
          </p>
        </div>

        {/* Room / Device Selector */}
        {devicesList && devicesList.length > 0 && (
          <div className="relative">
            <select
              value={deviceId || ""}
              onChange={(e) => setDeviceId(e.target.value)}
              className="appearance-none rounded-xl border bg-card px-3.5 py-2 pr-9 text-xs font-semibold text-foreground shadow-sm hover:bg-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
            >
              {devicesList.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.id})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <ChevronRight className="h-3.5 w-3.5 rotate-90" />
            </div>
          </div>
        )}
      </div>

      {/* INDOOR SENSOR BANNER CARD */}
      <section
        className={cn(
          "status-transition rounded-3xl border p-6 lg:p-8",
          reading ? indoorTheme.soft : "bg-card",
        )}
      >
        <div className="grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
          <BreathingOrb status={indoorStatus} size="sm" className="mx-auto h-36 w-36 lg:mx-0" />
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Radio className="h-4 w-4 text-primary animate-pulse" />
              <span>
                Indoor Hardware Sensor (MQ-135 + DHT22){" "}
                {streamStatus === "live" && (
                  <span className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wider ml-1">
                    • Live Stream
                  </span>
                )}
              </span>
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

          {/* Right Banner Badges: Indoor AQI + Raw MQ-135 */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <div className="flex flex-col items-center justify-center rounded-2xl border bg-card/80 p-3.5 text-center min-w-[110px] shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Indoor AQI
              </span>
              <span
                className={cn(
                  "mt-0.5 font-display text-3xl font-bold tabular-nums",
                  reading ? indoorTheme.text : "text-muted-foreground",
                )}
              >
                {indoorAqi ?? "—"}
              </span>
              <span
                className={cn(
                  "text-[10px] font-semibold uppercase mt-0.5",
                  reading ? indoorTheme.text : "text-muted-foreground",
                )}
              >
                {reading ? t(indoorTheme.label) : "US AQI Eq."}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl border bg-card/80 p-3.5 text-center min-w-[110px] shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                MQ-135 Signal
              </span>
              <span className="mt-0.5 font-display text-3xl font-bold tabular-nums text-foreground">
                {reading?.mq135 ?? "—"}
              </span>
              <span className="text-[10px] text-muted-foreground">Raw Sensor ADC</span>
            </div>
          </div>
        </div>
      </section>

      {/* INDOOR METRICS TILES */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Indoor Hardware Readings
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Indoor Air Quality (AQI) */}
          <div className="rounded-3xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Indoor Air Quality (AQI)
              </span>
              <span className={cn("grid h-9 w-9 place-items-center rounded-xl", indoorTheme.soft)}>
                <Gauge className={cn("h-5 w-5", indoorTheme.text)} />
              </span>
            </div>
            <p
              className={cn(
                "mt-3 font-display text-3xl font-bold tabular-nums",
                reading ? indoorTheme.text : "text-foreground",
              )}
            >
              {indoorAqi != null ? indoorAqi : "—"}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                {reading ? t(indoorTheme.label) : "US AQI Eq."}
              </span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {reading
                ? `Derived from MQ-135 (${reading.mq135} signal)`
                : "Awaiting hardware packet"}
            </p>
          </div>

          {/* Card 2: Indoor Temperature */}
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

          {/* Card 3: Indoor Humidity */}
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

          {/* Card 4: Hardware Status */}
          <div className="rounded-3xl border bg-card p-5 shadow-sm">
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

      {/* LIVE INDOOR VS OUTDOOR COMPARISON CARD */}
      <div
        className={cn(
          "rounded-3xl border p-5 shadow-sm transition-all",
          isIndoorWorse ? "border-poor/40 bg-poor-soft/30" : "border-border/80 bg-card/70",
        )}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div
              className={cn(
                "grid h-11 w-11 shrink-0 place-items-center rounded-2xl border",
                isIndoorWorse
                  ? "bg-poor-soft text-poor border-poor/30"
                  : "bg-good-soft text-good border-good/30",
              )}
            >
              <ArrowDownUp className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-bold text-foreground">
                  Live Indoor vs Outdoor Comparison
                </h3>
                {isIndoorWorse && (
                  <span className="rounded-full bg-poor px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider animate-pulse">
                    Smoke / Gas Alert
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isIndoorWorse
                  ? "⚠️ Smoke or high gas concentration detected indoors! Indoor air quality is worse than outside air. Ventilation / exhaust fan recommended."
                  : outdoorAqi != null && indoorAqi != null
                    ? "✅ Indoor air quality is cleaner or comparable to outdoor regional meteorology."
                    : "Connect your ESP32 hardware to compare live room air quality directly against regional outdoor atmosphere."}
              </p>
            </div>
          </div>

          {/* Side-by-Side Values */}
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            <div className="flex items-center gap-2 rounded-2xl border bg-card px-3.5 py-2 text-xs shadow-sm">
              <span className="text-muted-foreground">Indoor:</span>
              <span className={cn("font-bold tabular-nums", indoorTheme.text)}>
                {indoorAqi ?? "—"} AQI ({reading ? t(indoorTheme.label) : "Offline"})
              </span>
            </div>
            <span className="text-xs font-mono text-muted-foreground">vs</span>
            <div className="flex items-center gap-2 rounded-2xl border bg-card px-3.5 py-2 text-xs shadow-sm">
              <span className="text-muted-foreground">Outdoor:</span>
              <span className="font-bold tabular-nums text-moderate">
                {outdoor?.aqi ?? "—"} AQI
              </span>
            </div>
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
