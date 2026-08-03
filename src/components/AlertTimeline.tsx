import { useI18n } from "@/lib/i18n";
import { statusTheme, formatTime } from "@/lib/status";
import { timelineSegments } from "@/lib/insights";
import type { HistoryPoint } from "@/lib/airsense";
import { cn } from "@/lib/utils";

/** Coloured strip of Good/Moderate/Poor periods — scannable in a glance. */
export function AlertTimeline({ points }: { points: HistoryPoint[] | undefined }) {
  const { t, lang } = useI18n();
  const segments = timelineSegments(points);
  const total = segments.reduce((s, x) => s + x.span, 0) || 1;

  return (
    <section className="rounded-3xl border bg-card p-5">
      <p className="text-sm font-semibold">{t("tl.title")}</p>
      <p className="mt-1 text-xs text-muted-foreground">{t("tl.desc")}</p>

      {segments.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">{t("hist.noEvents")}</p>
      ) : (
        <>
          <div className="mt-4 flex h-6 w-full overflow-hidden rounded-full border">
            {segments.map((s, i) => (
              <span
                key={`${s.start}-${i}`}
                title={`${t(statusTheme[s.status].label)} · ${formatTime(s.start, lang)}`}
                style={{ width: `${(s.span / total) * 100}%` }}
                className={cn("h-full", statusTheme[s.status].bg)}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[11px] tabular-nums text-muted-foreground">
            <span>{formatTime(segments[0]!.start, lang)}</span>
            <span>{formatTime(segments[segments.length - 1]!.end, lang)}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
            {(["good", "moderate", "poor"] as const).map((s) => (
              <span key={s} className="flex items-center gap-1.5">
                <span className={cn("h-2 w-4 rounded-full", statusTheme[s].bg)} />
                {t(statusTheme[s].label)}
              </span>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
