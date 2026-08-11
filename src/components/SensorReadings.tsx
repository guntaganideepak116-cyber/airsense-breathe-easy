import { useState } from "react";
import { ChevronDown, Droplets, Info, Thermometer } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { statusTheme } from "@/lib/status";
import type { Reading } from "@/lib/airsense";
import {
  ADC_CLEAN,
  ADC_POOR,
  TEMP_MAX,
  TEMP_MIN,
  adcFromPpm,
  aqiScoreFromAdc,
  humidityBand,
  tempBand,
} from "@/lib/aqi";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/** Smooth green → amber → red ramp across the 0–100 index. */
function indexColor(score: number) {
  if (score <= 50) {
    return `color-mix(in oklab, var(--moderate) ${Math.round((score / 50) * 100)}%, var(--good))`;
  }
  return `color-mix(in oklab, var(--poor) ${Math.round(((score - 50) / 50) * 100)}%, var(--moderate))`;
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
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-muted" />
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
          style={{ transition: "stroke-dashoffset 700ms cubic-bezier(.22,1,.36,1), stroke 700ms ease" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}

function BandStrip({ active, labels }: { active: "low" | "ok" | "high"; labels: [string, string, string] }) {
  const keys = ["low", "ok", "high"] as const;
  const tone = { low: "bg-sky-soft text-primary", ok: "bg-good-soft text-good", high: "bg-moderate-soft text-moderate" };
  return (
    <div className="mt-4 grid grid-cols-3 gap-1 text-center text-[11px]">
      {keys.map((k, i) => (
        <span
          key={k}
          className={cn(
            "truncate rounded-full px-2 py-1 transition-colors",
            active === k ? tone[k] : "bg-muted/50 text-muted-foreground/60",
          )}
        >
          {labels[i]}
        </span>
      ))}
    </div>
  );
}

/**
 * Only what the hardware genuinely measures: one MQ135 contamination index
 * plus DHT22 temperature and relative humidity.
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
  const tPct = temp == null ? 0 : Math.max(0, Math.min(100, ((temp - TEMP_MIN) / (TEMP_MAX - TEMP_MIN)) * 100));

  const hum = reading?.humidity ?? null;
  const hBand = humidityBand(hum ?? 45);

  return (
    <section className={cn("space-y-4", className)}>
      <div>
        <h2 className="font-display text-xl text-ink">{t("sens.title")}</h2>
        <p className="text-sm text-muted-foreground">{t("sens.desc")}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)]">
        {/* Air Quality Index — MQ135 */}
        <article className="rounded-3xl border bg-card p-6">
          <div className="flex items-center gap-2">
            <p className="min-w-0 truncate text-sm font-semibold">{t("sens.aqi")}</p>
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label={t("sens.aqiInfo")}
                    className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Info className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-64 text-xs leading-relaxed">{t("sens.aqiInfo")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="mt-5">
            <Ring value={score} color={indexColor(score)}>
              <div key={tick} className="value-pulse">
                <p className="font-display text-4xl tabular-nums" style={{ color: indexColor(score) }}>
                  {reading ? score : "—"}
                  <span className="text-xl">%</span>
                </p>
                <p className="text-[11px] text-muted-foreground">{t("sens.mq")}</p>
              </div>
            </Ring>
          </div>

          <p className={cn("mt-5 text-center font-display text-3xl status-transition", theme.text)}>{t(theme.label)}</p>

          <div className="mt-5 rounded-2xl border bg-card/50">
            <button
              type="button"
              aria-expanded={rawOpen}
              onClick={() => setRawOpen((v) => !v)}
              className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("sens.raw")}
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", rawOpen && "rotate-180")} />
            </button>
            {rawOpen && (
              <dl className="space-y-1.5 border-t px-3 py-2.5 text-[11px]">
                <div className="flex items-center justify-between gap-3">
                  <dt className="truncate text-muted-foreground">{t("sens.rawAdc")}</dt>
                  <dd className="shrink-0 font-mono tabular-nums">{adc ?? "—"}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="truncate text-muted-foreground">{t("sens.rawIndex")}</dt>
                  <dd className="shrink-0 font-mono tabular-nums">{reading ? `${score}%` : "—"}</dd>
                </div>
                <p className="pt-1 font-mono text-[10px] leading-relaxed text-muted-foreground">
                  {t("sens.rawFormula").replace(/\{clean\}/g, String(ADC_CLEAN)).replace(/\{poor\}/g, String(ADC_POOR))}
                </p>
              </dl>
            )}
          </div>
        </article>

        {/* Temperature — DHT22 */}
        <article className="rounded-3xl border bg-card p-6">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Thermometer className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{t("dash.temp")}</span>
          </div>

          <div className="mt-6 flex items-end justify-center gap-5">
            <div className="relative h-40 w-6 overflow-hidden rounded-full bg-muted">
              <div
                className="absolute inset-x-0 bottom-0 rounded-full bg-gradient-to-t from-primary via-good to-moderate"
                style={{ height: `${tPct}%`, transition: "height 700ms cubic-bezier(.22,1,.36,1)" }}
              />
            </div>
            <div key={tick} className="value-pulse">
              <p className="font-display text-4xl tabular-nums">{temp != null ? `${temp}°` : "—"}</p>
              <p className="text-xs text-muted-foreground">°C · {t("sens.dht")}</p>
            </div>
          </div>

          <BandStrip active={tBand} labels={[t("sens.temp.low"), t("sens.temp.ok"), t("sens.temp.high")]} />
        </article>

        {/* Humidity — DHT22 */}
        <article className="rounded-3xl border bg-card p-6">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Droplets className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{t("dash.humidity")}</span>
          </div>

          <div className="mt-6">
            <Ring value={hum ?? 0} color="var(--primary)" size={140} stroke={12}>
              <div key={tick} className="value-pulse">
                <p className="font-display text-3xl tabular-nums text-primary">
                  {hum != null ? hum : "—"}
                  <span className="text-lg">%</span>
                </p>
                <p className="text-[11px] text-muted-foreground">{t("sens.dht")}</p>
              </div>
            </Ring>
          </div>

          <BandStrip active={hBand} labels={[t("sens.hum.low"), t("sens.hum.ok"), t("sens.hum.high")]} />
        </article>
      </div>
    </section>
  );
}
