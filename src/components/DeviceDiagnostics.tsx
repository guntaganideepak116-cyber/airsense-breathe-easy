import { useState } from "react";
import { ChevronDown, Cpu } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatTime } from "@/lib/status";
import type { Reading } from "@/lib/airsense";
import { cn } from "@/lib/utils";

function formatUptime(seconds: number | undefined, lang: string) {
  if (!seconds && seconds !== 0) return null;
  const h = Math.floor(seconds / 3600);
  const d = Math.floor(h / 24);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return lang === "te" ? `${d} రోజులు ${h % 24} గం` : `${d}d ${h % 24}h`;
  if (h > 0) return lang === "te" ? `${h} గం ${m} ని` : `${h}h ${m}m`;
  return lang === "te" ? `${m} ని` : `${m}m`;
}

/** Secondary technical detail, collapsed by default so it never crowds the status. */
export function DeviceDiagnostics({ reading, className }: { reading: Reading | null | undefined; className?: string }) {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const na = t("diag.na");

  const rows: { label: string; value: string }[] = [
    { label: t("diag.raw"), value: reading ? `${reading.mq135} ppm` : na },
    { label: t("diag.wifi"), value: reading?.rssi != null ? `${reading.rssi} dBm` : na },
    { label: t("diag.uptime"), value: formatUptime(reading?.uptimeSec, lang) ?? na },
    { label: t("diag.firmware"), value: reading?.firmware ? `v${reading.firmware}` : na },
    { label: t("diag.lastData"), value: reading ? formatTime(reading.timestamp, lang) : na },
  ];

  return (
    <div className={cn("rounded-2xl border bg-card/50", className)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-[11px] text-muted-foreground transition-colors hover:text-foreground"
      >
        <span className="flex items-center gap-1.5">
          <Cpu className="h-3.5 w-3.5" />
          {t("diag.title")}
        </span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <dl className="space-y-1.5 border-t px-3 py-2.5 text-[11px]">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between gap-3">
              <dt className="truncate text-muted-foreground">{r.label}</dt>
              <dd className="shrink-0 font-mono tabular-nums">{r.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
