import { Droplets, Thermometer, Wind } from "lucide-react";
import type { AirStatus } from "@/lib/airsense";
import { statusTheme } from "@/lib/status";
import { useI18n } from "@/lib/i18n";
import { BreathingOrb } from "@/components/BreathingOrb";
import { cn } from "@/lib/utils";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";

const sample = Array.from({ length: 28 }, (_, i) => ({
  v: 300 + Math.round(Math.sin(i / 3.2) * 120 + (i > 18 ? (i - 18) * 22 : 0) + (i % 4) * 12),
}));

/** Static, realistic mock of the dashboard used on the landing page. */
export function DashboardPreview({ status = "moderate" as AirStatus }) {
  const { t } = useI18n();
  const theme = statusTheme[status];

  return (
    <div className="rounded-3xl border bg-card p-4 shadow-sm sm:p-6">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className={cn("rounded-2xl p-5 status-transition", theme.soft)}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-foreground/70">{t("dash.airquality")}</span>
            <span className="flex items-center gap-1.5 text-xs text-foreground/60">
              <span className={cn("h-2 w-2 animate-pulse rounded-full", theme.dot)} />
              {t("dash.live")}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-4">
            <BreathingOrb status={status} size="sm" className="shrink-0 !h-28 !w-28" />
            <div className="min-w-0">
              <p className={cn("font-display text-4xl leading-tight", theme.text)}>
                {t(theme.label)}
              </p>
              <p className="mt-1 text-sm text-foreground/60">
                {t("dash.sensorReading")}: <span className="tabular-nums">612</span> ppm
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-foreground/75">{t(theme.advice)}</p>
        </div>

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <MiniStat
              icon={<Thermometer className="h-4 w-4" />}
              label={t("dash.temp")}
              value="31.4°C"
            />
            <MiniStat
              icon={<Droplets className="h-4 w-4" />}
              label={t("dash.humidity")}
              value="58%"
            />
          </div>
          <div className="rounded-2xl border p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wind className="h-4 w-4" /> {t("hist.aqChart")}
            </div>
            <div className="mt-2 h-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sample}>
                  <defs>
                    <linearGradient id="prev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={theme.hex} stopOpacity={0.5} />
                      <stop offset="100%" stopColor={theme.hex} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <YAxis hide domain={[200, 900]} />
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke={theme.hex}
                    strokeWidth={2}
                    fill="url(#prev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
