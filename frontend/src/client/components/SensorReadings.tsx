import { useState } from "react";
import { ChevronDown, Droplets, Info, Thermometer, Wind } from "lucide-react";
import { useI18n } from "@/client/lib/i18n";
import { statusTheme } from "@/shared/lib/status";
import type { Reading } from "@/client/lib/airsense";
import {
  ADC_CLEAN,
  ADC_POOR,
  TEMP_MAX,
  TEMP_MIN,
  adcFromPpm,
  aqiScoreFromAdc,
  humidityBand,
  tempBand,
} from "@/shared/lib/aqi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/client/components/ui/tooltip";
import { cn } from "@/client/lib/utils";

/** Smooth green → amber → red ramp across the 0–100 index. */
function indexColor(score: number) {
  if (score <= 50) {
    return `color-mix(in srgb, var(--moderate) ${Math.round((score / 50) * 100)}%, var(--good))`;
  }
  return `color-mix(in srgb, var(--poor) ${Math.round(((score - 50) / 50) * 100)}%, var(--moderate))`;
}

function Ring({
  value,
  color,
  size = 176,
  stroke = 14,
  children,
}: {
  value: number;
  color: string;
  size?: number;
  stroke?: number;
  children: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="stroke-secondary/80"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke={color}
          strokeDasharray={c}
          strokeDashoffset={c - (Math.max(0, Math.min(100, value)) / 100) * c}
          style={{
            transition: "stroke-dashoffset 700ms cubic-bezier(.22,1,.36,1), stroke 700ms ease",
          }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}

function BandStrip({
  active,
  labels,
}: {
  active: "low" | "ok" | "high";
  labels: [string, string, string];
}) {
  const keys = ["low", "ok", "high"] as const;
  const tone = {
    low: "bg-sky-soft text-cyan-400 border border-cyan-500/20",
    ok: "bg-good-soft text-good border border-emerald-500/20",
    high: "bg-moderate-soft text-moderate border border-amber-500/20",
  };
  return (
    <div className="mt-4 grid grid-cols-3 gap-1.5 text-center text-[11px] font-medium">
      {keys.map((k, i) => (
        <span
          key={k}
          className={cn(
            "truncate rounded-lg px-2 py-1 transition-colors",
            active === k ? tone[k] : "bg-secondary/40 text-muted-foreground/60",
          )}
        >
          {labels[i]}
        </span>
      ))}
    </div>
  );
}

/**
 * SensorReadings: Dedicated telemetry presentation for MQ-135 and DHT22 hardware.
 * Clearly labels raw ADC & relative sensor response index without unsupported claims.
 */
export function SensorReadings({
  reading,
  tick,
  className,
}: {
  reading: Reading | null | undefined;
  tick?: number;
  className?: string;
}) {
  const { t } = useI18n();
  const [rawOpen, setRawOpen] = useState(false);

  const adc = reading ? adcFromPpm(reading.mq135) : null;
  const score = adc != null ? aqiScoreFromAdc(adc) : 0;
  const status = reading?.status ?? "good";
  const theme = statusTheme[status];

  const temp = reading?.temperature ?? null;
  const tBand = tempBand(temp ?? 24);
  const tPct =
    temp == null
      ? 0
      : Math.max(0, Math.min(100, ((temp - TEMP_MIN) / (TEMP_MAX - TEMP_MIN)) * 100));

  const hum = reading?.humidity ?? null;
  const hBand = humidityBand(hum ?? 45);

  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
            {t("sens.title")}
          </h2>
          <p className="text-xs text-muted-foreground">{t("sens.desc")}</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-border/80 bg-secondary/50 px-2.5 py-1 text-[11px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span>Active Telemetry Matrix</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Sensor 1: MQ-135 Relative Air Contaminant Response */}
        <article className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all hover:border-border">
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Wind className="h-4 w-4" />
                </span>
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  {t("sens.aqi")}
                </span>
              </div>
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label={t("sens.aqiInfo")}
                      className="shrink-0 text-muted-foreground/80 transition-colors hover:text-foreground"
                    >
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-64 text-xs leading-relaxed">
                    {t("sens.aqiInfo")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="mt-5">
              <Ring value={score} color={indexColor(score)}>
                <div key={tick} className="value-pulse">
                  <p
                    className="font-display text-4xl font-extrabold tabular-nums"
                    style={{ color: reading ? indexColor(score) : "var(--muted-foreground)" }}
                  >
                    {reading ? score : "—"}
                    {reading && <span className="text-xl font-normal">%</span>}
                  </p>
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Relative Response Index
                  </p>
                </div>
              </Ring>
            </div>

            {reading ? (
              <p
                className={cn(
                  "mt-4 text-center font-display text-2xl font-bold uppercase tracking-wide",
                  theme.text,
                )}
              >
                {t(theme.label)}
              </p>
            ) : (
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Waiting for sensor data...
              </p>
            )}
          </div>

          <div className="mt-5 rounded-xl border border-border/60 bg-secondary/30">
            <button
              type="button"
              aria-expanded={rawOpen}
              onClick={() => setRawOpen((v) => !v)}
              className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="font-medium">{t("sens.raw")}</span>
              <ChevronDown
                className={cn("h-3.5 w-3.5 transition-transform", rawOpen && "rotate-180")}
              />
            </button>
            {rawOpen && (
              <dl className="space-y-1.5 border-t border-border/60 px-3 py-2.5 text-[11px]">
                <div className="flex items-center justify-between gap-3">
                  <dt className="truncate text-muted-foreground">{t("sens.rawAdc")}</dt>
                  <dd className="shrink-0 font-mono font-semibold tabular-nums text-foreground">
                    {adc ?? "—"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="truncate text-muted-foreground">MQ-135 Output Reading</dt>
                  <dd className="shrink-0 font-mono font-semibold tabular-nums text-foreground">
                    {reading?.mq135 ?? "—"} PPM
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="truncate text-muted-foreground">{t("sens.rawIndex")}</dt>
                  <dd className="shrink-0 font-mono font-semibold tabular-nums text-foreground">
                    {reading ? `${score}%` : "—"}
                  </dd>
                </div>
                <p className="pt-1 font-mono text-[10px] leading-relaxed text-muted-foreground/80">
                  {t("sens.rawFormula")
                    .replace(/\{clean\}/g, String(ADC_CLEAN))
                    .replace(/\{poor\}/g, String(ADC_POOR))}
                </p>
              </dl>
            )}
          </div>
        </article>

        {/* Sensor 2: DHT22 Temperature */}
        <article className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all hover:border-border">
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Thermometer className="h-4 w-4" />
                </span>
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  {t("dash.temp")}
                </span>
              </div>
              <span className="rounded-md bg-secondary/80 px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                DHT22
              </span>
            </div>

            <div className="mt-8 flex items-end justify-center gap-6">
              <div className="relative h-36 w-5 overflow-hidden rounded-full bg-secondary/80 border border-border/60">
                <div
                  className="absolute inset-x-0 bottom-0 rounded-full bg-linear-to-t from-primary via-teal-400 to-amber-400"
                  style={{
                    height: `${tPct}%`,
                    transition: "height 700ms cubic-bezier(.22,1,.36,1)",
                  }}
                />
              </div>
              <div key={tick} className="value-pulse text-left">
                <p className="font-display text-4xl font-extrabold tabular-nums text-foreground">
                  {temp != null ? `${temp}°` : "—"}
                </p>
                <p className="text-xs text-muted-foreground">Celsius (°C)</p>
                <p className="mt-1 text-[11px] font-medium text-muted-foreground/80">
                  Range: 0°C – 50°C
                </p>
              </div>
            </div>
          </div>

          <BandStrip
            active={tBand}
            labels={[t("sens.temp.low"), t("sens.temp.ok"), t("sens.temp.high")]}
          />
        </article>

        {/* Sensor 3: DHT22 Relative Humidity */}
        <article className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all hover:border-border">
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Droplets className="h-4 w-4" />
                </span>
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  {t("dash.humidity")}
                </span>
              </div>
              <span className="rounded-md bg-secondary/80 px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                DHT22
              </span>
            </div>

            <div className="mt-6">
              <Ring value={hum ?? 0} color="var(--primary)" size={144} stroke={12}>
                <div key={tick} className="value-pulse">
                  <p className="font-display text-3xl font-extrabold tabular-nums text-primary">
                    {hum != null ? hum : "—"}
                    <span className="text-lg font-normal">%</span>
                  </p>
                  <p className="text-[11px] font-medium text-muted-foreground">Relative RH</p>
                </div>
              </Ring>
            </div>
          </div>

          <BandStrip
            active={hBand}
            labels={[t("sens.hum.low"), t("sens.hum.ok"), t("sens.hum.high")]}
          />
        </article>
      </div>
    </section>
  );
}
