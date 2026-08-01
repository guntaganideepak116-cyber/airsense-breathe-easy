import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AlertTriangle, Lightbulb } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useI18n } from "@/lib/i18n";
import { formatTime } from "@/lib/status";
import { useHistory, useSelectedDevice } from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";
import type { Range } from "@/lib/airsense";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/history")({
  head: () => ({
    meta: [
      { title: "History & trends — AirSense" },
      { name: "description", content: "Air quality, temperature and humidity trends with a log of every poor-air event." },
      { property: "og:title", content: "History & trends — AirSense" },
      { property: "og:description", content: "24-hour, 7-day and 30-day indoor air quality trends." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: HistoryPage,
});

const ranges: Range[] = ["24h", "7d", "30d"];

function HistoryPage() {
  const { t, lang } = useI18n();
  const [range, setRange] = useState<Range>("24h");
  const { deviceId, device } = useSelectedDevice();
  const { data, isLoading } = useHistory(deviceId, range);

  const chartData = useMemo(
    () =>
      (data ?? []).map((p) => ({
        ...p,
        label: new Date(p.t).toLocaleString(lang === "te" ? "te-IN" : "en-IN", {
          hour: range === "24h" ? "2-digit" : undefined,
          minute: range === "24h" ? "2-digit" : undefined,
          day: range === "24h" ? undefined : "numeric",
          month: range === "24h" ? undefined : "short",
        }),
      })),
    [data, lang, range],
  );

  const events = useMemo(() => {
    const out: { t: string; mq135: number }[] = [];
    (data ?? []).forEach((p, i) => {
      const prev = data?.[i - 1];
      if (p.status === "poor" && prev && prev.status !== "poor") out.push({ t: p.t, mq135: p.mq135 });
    });
    return out.reverse();
  }, [data]);

  const insight = useMemo(() => {
    if (!data?.length) return null;
    const buckets = new Map<number, { sum: number; n: number }>();
    data.forEach((p) => {
      const h = new Date(p.t).getHours();
      const b = buckets.get(h) ?? { sum: 0, n: 0 };
      buckets.set(h, { sum: b.sum + p.mq135, n: b.n + 1 });
    });
    let worst = -1;
    let worstAvg = 0;
    buckets.forEach((v, h) => {
      const avg = v.sum / v.n;
      if (avg > worstAvg) {
        worstAvg = avg;
        worst = h;
      }
    });
    if (worst < 0) return null;
    return lang === "te"
      ? `సాధారణంగా ${worst}:00–${(worst + 2) % 24}:00 మధ్య గాలి నాణ్యత తగ్గుతోంది.`
      : `Air quality tends to worsen between ${worst}:00 and ${(worst + 2) % 24}:00.`;
  }, [data, lang]);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-4">
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl text-ink sm:text-3xl">{t("hist.title")}</h1>
          <p className="truncate text-sm text-muted-foreground">{device?.name ?? "—"}</p>
        </div>
        <div className="flex w-fit shrink-0 rounded-full border bg-card p-1">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs transition-colors",
                range === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t(`hist.${r}` as "hist.24h")}
            </button>
          ))}
        </div>
      </div>

      {insight && (
        <div className="flex items-start gap-3 rounded-3xl border bg-sky-soft p-5">
          <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="min-w-0">
            <p className="text-sm font-semibold">{t("hist.insight")}</p>
            <p className="mt-1 text-sm text-foreground/75">{insight}</p>
          </div>
        </div>
      )}

      <section className="rounded-3xl border bg-card p-5">
        <p className="text-sm font-semibold">{t("hist.aqChart")}</p>
        {isLoading ? (
          <Skeleton className="mt-4 h-64 rounded-2xl" />
        ) : (
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="aq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} minTickGap={24} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" width={40} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="mq135" stroke="var(--primary)" strokeWidth={2} fill="url(#aq)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className="rounded-3xl border bg-card p-5">
        <p className="text-sm font-semibold">{t("hist.thChart")}</p>
        {isLoading ? (
          <Skeleton className="mt-4 h-56 rounded-2xl" />
        ) : (
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} minTickGap={24} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" width={40} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    fontSize: 12,
                  }}
                />
                <Line type="monotone" dataKey="temperature" stroke="var(--moderate)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="humidity" stroke="var(--good)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-4 rounded-full bg-moderate" /> {t("dash.temp")}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-4 rounded-full bg-good" /> {t("dash.humidity")}
          </span>
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-5">
        <p className="text-sm font-semibold">{t("hist.events")}</p>
        {events.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">{t("hist.noEvents")}</p>
        ) : (
          <ul className="mt-4 divide-y">
            {events.map((e) => (
              <li key={e.t} className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 py-3 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-poor-soft text-poor">
                  <AlertTriangle className="h-4 w-4" />
                </span>
                <span className="min-w-0 text-sm">{t("hist.eventPoor")}</span>
                <span className="col-start-2 shrink-0 text-xs tabular-nums text-muted-foreground sm:col-start-auto">
                  {formatTime(e.t, lang)} · {e.mq135} ppm
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
