import { Info } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { statusTheme } from "@/lib/status";
import { useOutdoorAqi } from "@/lib/outdoor";
import type { AirStatus } from "@/lib/airsense";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * Indoor sensor status side by side with the citywide outdoor AQI.
 * The gap between the two is the whole point of the product.
 */
export function IndoorOutdoor({
  indoor,
  compact = false,
  className,
}: {
  indoor: AirStatus | null | undefined;
  compact?: boolean;
  className?: string;
}) {
  const { t, lang } = useI18n();
  const { data: outdoor, isLoading, isError, city } = useOutdoorAqi();

  const indoorTheme = indoor ? statusTheme[indoor] : null;
  const outdoorTheme = outdoor ? statusTheme[outdoor.status] : null;
  const differs = !!indoor && !!outdoor && indoor !== outdoor.status;

  const pill = (label: string, value: string, dot: string, text: string) => (
    <span className="flex min-w-0 items-center gap-1.5">
      <span className={cn("h-2 w-2 shrink-0 rounded-full", dot)} />
      <span className="shrink-0 text-foreground/60">{label}:</span>
      <span className={cn("truncate font-medium", text)}>{value}</span>
    </span>
  );

  return (
    <div className={cn("rounded-2xl border bg-card/60 p-3", compact && "bg-transparent p-0", className)}>
      <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1", compact ? "text-[11px]" : "text-xs")}>
        {pill(
          t("out.indoor"),
          indoorTheme ? t(indoorTheme.label) : "—",
          indoorTheme?.dot ?? "bg-muted",
          indoorTheme?.text ?? "text-muted-foreground",
        )}
        <span className="text-foreground/25">·</span>
        {isLoading ? (
          <span className="text-muted-foreground">{t("out.loading")}</span>
        ) : isError || !outdoor ? (
          <span className="text-muted-foreground">{t("out.unavailable")}</span>
        ) : (
          pill(
            t("out.outdoor"),
            `${t(outdoorTheme!.label)} · ${t("out.aqi")} ${outdoor.aqi}`,
            outdoorTheme!.dot,
            outdoorTheme!.text,
          )
        )}
        <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label={t("out.tooltip")}
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 rounded-full text-muted-foreground transition-colors hover:text-foreground"
            >
              <Info className="h-3.5 w-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-64 text-xs leading-relaxed">{t("out.tooltip")}</TooltipContent>
        </Tooltip>
        </TooltipProvider>
      </div>

      {!compact && (
        <p className="mt-2 text-[11px] text-muted-foreground">
          {city.name[lang]} · {t("out.source")}
          {differs && <> · {t("out.gap")}</>}
        </p>
      )}
    </div>
  );
}
