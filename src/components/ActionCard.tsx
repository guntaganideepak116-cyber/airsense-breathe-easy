import { Minus, TrendingDown, TrendingUp, Wind } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { statusTheme } from "@/lib/status";
import { actionKey, type Trend } from "@/lib/insights";
import type { AirStatus } from "@/lib/airsense";
import { cn } from "@/lib/utils";

/** Guidance that changes with the live status and the direction of the trend. */
export function ActionCard({ status, trend }: { status: AirStatus; trend: Trend }) {
  const { t } = useI18n();
  const theme = statusTheme[status];
  const key = actionKey(status, trend);

  const trendIcon =
    trend === "rising" ? (
      <TrendingUp className="h-3.5 w-3.5" />
    ) : trend === "falling" ? (
      <TrendingDown className="h-3.5 w-3.5" />
    ) : (
      <Minus className="h-3.5 w-3.5" />
    );

  return (
    <section className={cn("status-transition rounded-3xl border p-6", theme.soft)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Wind className={cn("h-4 w-4", theme.text)} />
          {t("action.title")}
        </p>
        <span
          className={cn(
            "flex items-center gap-1.5 rounded-full bg-card/70 px-2.5 py-1 text-[11px]",
            trend === "rising"
              ? "text-poor"
              : trend === "falling"
                ? "text-good"
                : "text-muted-foreground",
          )}
        >
          {trendIcon}
          {t(`action.trend.${trend}`)}
        </span>
      </div>

      <p className={cn("mt-3 text-base leading-relaxed", theme.text)}>{t(key)}</p>
      <p className="mt-3 text-[11px] leading-relaxed text-foreground/50">
        {t("action.disclaimer")}
      </p>
    </section>
  );
}
