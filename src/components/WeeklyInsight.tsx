import { CalendarRange } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatHour, weeklyPattern } from "@/lib/insights";
import { useHistory } from "@/lib/queries";

/** Plain time-bucket aggregation over the last seven days — stated as such. */
export function WeeklyInsight({ deviceId }: { deviceId: string | null }) {
  const { t, lang } = useI18n();
  const { data } = useHistory(deviceId, "7d");
  const pattern = weeklyPattern(data);

  const text =
    pattern.kind === "clean"
      ? t("week.clean")
      : pattern.kind === "window"
        ? lang === "te"
          ? `ఈ గదిలో గాలి సాధారణంగా ${formatHour(pattern.startHour, lang)}–${formatHour(pattern.endHour, lang)} మధ్య ఎక్కువ పాడవుతోంది (${pattern.poorEpisodes} సంఘటనలు).`
          : `Air quality in this room tends to be worse between ${formatHour(pattern.startHour, lang)} and ${formatHour(pattern.endHour, lang)} (${pattern.poorEpisodes} poor episodes).`
        : t("week.none");

  return (
    <section className="rounded-3xl border bg-card p-5">
      <p className="flex items-center gap-2 text-sm font-semibold">
        <CalendarRange className="h-4 w-4 text-primary" />
        {t("week.title")}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-foreground/80">{text}</p>
      <p className="mt-2 text-[11px] text-muted-foreground">{t("week.note")}</p>
    </section>
  );
}
