import { Cpu, Droplets, Radio, Thermometer, Wind } from "lucide-react";
import type { AirStatus } from "@/client/lib/airsense";
import { statusTheme } from "@/shared/lib/status";
import { useI18n } from "@/client/lib/i18n";
import { BreathingOrb } from "@/client/components/BreathingOrb";
import { cn } from "@/client/lib/utils";
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";

const sample = Array.from({ length: 28 }, (_, i) => ({
  t: `${10 + Math.floor(i / 2)}:${i % 2 === 0 ? "00" : "30"}`,
  v: 310 + Math.round(Math.sin(i / 3.2) * 110 + (i > 18 ? (i - 18) * 20 : 0) + (i % 4) * 10),
}));

/** Static, high-fidelity preview of the real AirSense dashboard used on the landing page. */
export function DashboardPreview({ status = "moderate" as AirStatus }) {
  const { t } = useI18n();
  const theme = statusTheme[status];

  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xl transition-all">
      {/* Console Topbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 bg-secondary/50 px-5 py-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="grid h-5 w-5 place-items-center rounded-md bg-primary/20 text-primary">
            <Cpu className="h-3 w-3" />
          </span>
          <span className="font-semibold text-foreground">AirSense Node-01</span>
          <span className="text-border">|</span>
          <span className="truncate">ESP32 · MQ-135 · DHT22</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-2.5 py-0.5 font-medium text-foreground">
            <span className={cn("h-1.5 w-1.5 animate-pulse rounded-full", theme.dot)} />
            <Radio className="h-3 w-3 text-primary" />
            <span>{t("dash.live")}</span>
          </span>
          <span className="text-muted-foreground/80 tabular-nums">Telemetry synced</span>
        </div>
      </div>

      {/* Main Preview Grid */}
      <div className="p-4 sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          {/* Primary Air Quality Card */}
          <div
            className={cn(
              "relative overflow-hidden rounded-xl border border-border/70 p-5 transition-all",
              theme.soft,
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("dash.airquality")}
              </span>
              <span
                className={cn(
                  "rounded-md px-2 py-0.5 text-xs font-semibold uppercase tracking-wide",
                  theme.text,
                )}
              >
                {t(theme.label)}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-4">
              <BreathingOrb
                status={status}
                size="sm"
                className="h-24 w-24 shrink-0 sm:h-28 sm:w-28"
              />
              <div className="min-w-0">
                <p
                  className={cn(
                    "font-display text-3xl font-bold leading-tight sm:text-4xl",
                    theme.text,
                  )}
                >
                  {t(theme.label)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  MQ-135 Raw Sensor Response:{" "}
                  <span className="font-semibold tabular-nums text-foreground">612</span>{" "}
                  <span className="text-[11px] text-muted-foreground/80">(Scale: 0–1023)</span>
                </p>
              </div>
            </div>

            <p className="mt-4 rounded-lg border border-border/40 bg-background/50 p-3 text-xs leading-relaxed text-foreground/85">
              {t(theme.advice)}
            </p>
          </div>

          {/* Environmental Telemetry & Trend */}
          <div className="grid gap-3.5">
            <div className="grid grid-cols-2 gap-3.5">
              <MiniStat
                icon={<Thermometer className="h-4 w-4 text-cyan-400" />}
                label={t("dash.temp")}
                value="31.4°C"
                sub="DHT22 Sensor"
              />
              <MiniStat
                icon={<Droplets className="h-4 w-4 text-emerald-400" />}
                label={t("dash.humidity")}
                value="58%"
                sub="Relative Humidity"
              />
            </div>

            {/* Micro Chart */}
            <div className="rounded-xl border border-border/70 bg-secondary/30 p-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <Wind className="h-3.5 w-3.5 text-primary" /> {t("hist.aqChart")}
                </span>
                <span className="text-[11px] text-muted-foreground">Past 12 Hours</span>
              </div>
              <div className="mt-3 h-24 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sample} margin={{ top: 2, right: 2, left: 2, bottom: 0 }}>
                    <defs>
                      <linearGradient id="previewAqGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={theme.hex} stopOpacity={0.4} />
                        <stop offset="100%" stopColor={theme.hex} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <YAxis hide domain={[200, 900]} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-md border border-border bg-card px-2 py-1 text-[11px] shadow-md">
                              <span className="font-semibold text-foreground">
                                {payload[0]?.value}
                              </span>{" "}
                              <span className="text-muted-foreground">MQ-135</span>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke={theme.hex}
                      strokeWidth={2}
                      fill="url(#previewAqGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-secondary/40 p-4 transition-all hover:bg-secondary/60">
      <div className="flex items-center justify-between gap-1 text-xs text-muted-foreground">
        <span className="truncate font-medium">{label}</span>
        <span className="grid h-6 w-6 place-items-center rounded-md bg-background/50">{icon}</span>
      </div>
      <p className="mt-2 font-display text-2xl font-bold tabular-nums text-foreground">{value}</p>
      <p className="mt-0.5 text-[10px] text-muted-foreground/75 truncate">{sub}</p>
    </div>
  );
}
