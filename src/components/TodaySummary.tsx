import { ArrowDownRight, ArrowUpRight, CalendarClock, Timer } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { statusTheme } from "@/lib/status";
import { bestAndWorst, stepMinutesFor, todaySummary } from "@/lib/insights";
import { useAllLatest, useHistory } from "@/lib/queries";
import type { Device } from "@/lib/airsense";
import { cn } from "@/lib/utils";

/**
 * Compact strip of today's numbers, computed from the readings already loaded
 * for the selected room plus the live status of every other room.
 */
export function TodaySummary({
  deviceId,
  devices,
}: {
  deviceId: string | null;
  devices: Device[];
}) {
  const { t } = useI18n();
  const { data } = useHistory(deviceId, "24h");
  const summary = todaySummary(data, stepMinutesFor("24h"));
  const latest = useAllLatest(devices.map((d) => d.id));
  const { best, worst } = bestAndWorst(
    latest.map((l) => ({
      deviceId: l.deviceId,
      name: devices.find((d) => d.id === l.deviceId)?.name ?? l.deviceId,
      reading: l.reading,
    })),
  );

  const typicalTheme = summary.typical ? statusTheme[summary.typical] : null;

  return (
    <section className="rounded-3xl border bg-card p-4 sm:p-5">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <CalendarClock className="h-4 w-4 text-primary" />
        {t("today.title")}
      </div>

      {summary.samples === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">{t("today.none")}</p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label={t("today.typical")}>
            <span
              className={cn("flex items-center gap-2 font-display text-xl", typicalTheme?.text)}
            >
              <span className={cn("h-2.5 w-2.5 rounded-full", typicalTheme?.dot)} />
              {typicalTheme ? t(typicalTheme.label) : "—"}
            </span>
          </Stat>

          <Stat label={t("today.episodes")}>
            <span className="font-display text-xl tabular-nums">{summary.poorEpisodes}</span>
          </Stat>

          <Stat label={t("today.duration")}>
            <span className="flex items-center gap-1.5 font-display text-xl tabular-nums">
              <Timer className="h-4 w-4 text-muted-foreground" />
              {summary.poorMinutes}{" "}
              <span className="text-sm font-normal">{t("today.minutes")}</span>
            </span>
          </Stat>

          {best && worst ? (
            <Stat label={`${t("today.best")} / ${t("today.worst")}`}>
              <span className="flex flex-col gap-0.5 text-sm">
                <span className="flex min-w-0 items-center gap-1.5">
                  <ArrowDownRight className="h-3.5 w-3.5 shrink-0 text-good" />
                  <span className="truncate">{best.name}</span>
                </span>
                <span className="flex min-w-0 items-center gap-1.5">
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-poor" />
                  <span className="truncate">{worst.name}</span>
                </span>
              </span>
            </Stat>
          ) : null}
        </div>
      )}
    </section>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-2xl border bg-background/40 p-3">
      <p className="truncate text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
