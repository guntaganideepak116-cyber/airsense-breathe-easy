import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { statusTheme, formatTime } from "@/lib/status";
import { statusRank } from "@/lib/insights";
import { useAllLatest } from "@/lib/queries";
import type { Device } from "@/lib/airsense";
import { cn } from "@/lib/utils";

type SortKey = "status" | "name";

/** Every room in one sortable table, worst air first by default. */
export function RoomComparison({ devices, onSelect }: { devices: Device[]; onSelect?: (id: string) => void }) {
  const { t, lang } = useI18n();
  const [sort, setSort] = useState<SortKey>("status");
  const latest = useAllLatest(devices.map((d) => d.id));

  const rows = devices
    .map((d) => ({ device: d, reading: latest.find((l) => l.deviceId === d.id)?.reading ?? null }))
    .sort((a, b) => {
      if (sort === "name") return a.device.name.localeCompare(b.device.name);
      const ra = a.reading ? statusRank(a.reading.status) : -1;
      const rb = b.reading ? statusRank(b.reading.status) : -1;
      return rb - ra || (b.reading?.mq135 ?? 0) - (a.reading?.mq135 ?? 0);
    });

  return (
    <section className="rounded-3xl border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold">{t("cmp.title")}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t("cmp.desc")}</p>
        </div>
        <button
          type="button"
          onClick={() => setSort((s) => (s === "status" ? "name" : "status"))}
          className="flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowUpDown className="h-3.5 w-3.5" />
          {t("cmp.sortBy")}: {t(sort === "status" ? "cmp.sortStatus" : "cmp.sortName")}
        </button>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="pb-2 font-medium">{t("cmp.room")}</th>
              <th className="pb-2 font-medium">{t("cmp.status")}</th>
              <th className="pb-2 font-medium">{t("cmp.reading")}</th>
              <th className="pb-2 font-medium">{t("cmp.climate")}</th>
              <th className="pb-2 text-right font-medium">{t("cmp.updated")}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map(({ device, reading }) => {
              const theme = reading ? statusTheme[reading.status] : null;
              return (
                <tr
                  key={device.id}
                  onClick={() => onSelect?.(device.id)}
                  className={cn("align-middle", onSelect && "cursor-pointer transition-colors hover:bg-secondary/50")}
                >
                  <td className="max-w-40 truncate py-3 pr-3 font-medium">{device.name}</td>
                  <td className="py-3 pr-3">
                    <span className={cn("flex items-center gap-2", theme?.text ?? "text-muted-foreground")}>
                      <span className={cn("h-2 w-2 rounded-full", theme?.dot ?? "bg-muted")} />
                      {theme ? t(theme.label) : "—"}
                    </span>
                  </td>
                  <td className="py-3 pr-3 tabular-nums">{reading ? `${reading.mq135} ppm` : "—"}</td>
                  <td className="py-3 pr-3 tabular-nums text-muted-foreground">
                    {reading ? `${reading.temperature}°C · ${reading.humidity}%` : "—"}
                  </td>
                  <td className="py-3 text-right text-xs tabular-nums text-muted-foreground">
                    {reading ? formatTime(reading.timestamp, lang) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
