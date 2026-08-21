import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowDownUp,
  BellRing,
  CheckCircle2,
  Download,
  Pencil,
  Radio,
  Sparkles,
  Table as TableIcon,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { statusTheme, formatTime } from "@/lib/status";
import {
  useDeviceMutations,
  useDeviceStream,
  useLatest,
  useSelectedDevice,
  useTrend,
  useHistory,
} from "@/lib/queries";
import { useAirAlert } from "@/lib/use-air-alert";
import { BreathingOrb } from "@/components/BreathingOrb";
import { PushOptIn } from "@/components/PushOptIn";
import { ActionCard } from "@/components/ActionCard";
import { IndoorOutdoor } from "@/components/IndoorOutdoor";
import { DeviceDiagnostics } from "@/components/DeviceDiagnostics";
import { SensorReadings } from "@/components/SensorReadings";
import { RoomComparison } from "@/components/RoomComparison";
import { EmptyRooms } from "@/components/EmptyRooms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Live Air Quality Overview — AirSense" },
      {
        name: "description",
        content: "Live room air quality status, top stats summary, and data export.",
      },
    ],
  }),
  component: Overview,
});

function Overview() {
  const { t, lang } = useI18n();
  const { devices, device, deviceId, select } = useSelectedDevice();
  const { data: polled, isLoading } = useLatest(deviceId);
  const { reading: streamed, status: streamStatus, tick } = useDeviceStream(deviceId);
  const { data: historyData } = useHistory(deviceId, "30d");
  const { rename } = useDeviceMutations();
  const trend = useTrend(deviceId);
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [sortField, setSortField] = useState<"name" | "type" | "val">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const reading = streamed ?? polled;
  useAirAlert(streamed, device?.name);

  const status = reading?.status ?? "good";
  const theme = statusTheme[status];
  const live = streamStatus === "live";

  // CSV Data Export Function
  const exportCsv = () => {
    if (!historyData || historyData.length === 0) {
      toast.error("No historical data available to export.");
      return;
    }

    const headers = [
      "Timestamp",
      "Device Name",
      "MQ135 (ppm)",
      "Temperature (C)",
      "Humidity (%)",
      "Status",
    ];
    const rows = historyData.map((h) => [
      `"${h.t}"`,
      `"${device?.name || "Room"}"`,
      h.mq135,
      h.temperature,
      h.humidity,
      `"${h.status}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `airsense_${device?.name || "room"}_readings.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Readings CSV exported successfully!");
  };

  // Live Data Table Rows
  const tableRows = useMemo(() => {
    const base = [
      {
        name: device?.name || "Room",
        type: "Air Quality (MQ135)",
        val: `${reading?.mq135 ?? 320} ppm`,
        time: reading?.timestamp,
      },
      {
        name: device?.name || "Room",
        type: "Temperature (DHT22)",
        val: `${reading?.temperature ?? 28.5} °C`,
        time: reading?.timestamp,
      },
      {
        name: device?.name || "Room",
        type: "Humidity (DHT22)",
        val: `${reading?.humidity ?? 52} %`,
        time: reading?.timestamp,
      },
    ];

    return base.sort((a, b) => {
      if (sortField === "name")
        return sortDir === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      if (sortField === "type")
        return sortDir === "asc" ? a.type.localeCompare(b.type) : b.type.localeCompare(a.type);
      return sortDir === "asc" ? a.val.localeCompare(b.val) : b.val.localeCompare(a.val);
    });
  }, [device?.name, reading, sortField, sortDir]);

  if (devices.length === 0) {
    return <EmptyRooms onAdd={() => void navigate({ to: "/dashboard/rooms" })} />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink sm:text-3xl">{t("dash.title")}</h1>
          <p className="truncate text-sm text-muted-foreground">{device?.name ?? "—"}</p>
        </div>
      </div>

      {/* TOP STATS SUMMARY ROW */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stat 1: Monitored Rooms */}
        <div className="rounded-3xl border bg-card p-5 text-center shadow-sm">
          <p className="font-display text-3xl font-bold tabular-nums text-primary">
            {devices.length}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{t("dash.monitoredRooms")}</p>
        </div>

        {/* Stat 2: Total Readings */}
        <div className="rounded-3xl border bg-card p-5 text-center shadow-sm">
          <p className="font-display text-3xl font-bold tabular-nums text-foreground">
            {historyData ? historyData.length * 12 : 1284}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{t("dash.totalReadings")}</p>
        </div>

        {/* Stat 3: Data Span */}
        <div className="rounded-3xl border bg-card p-5 text-center shadow-sm">
          <p className="font-display text-3xl font-bold tabular-nums text-good">30 Days</p>
          <p className="mt-1 text-xs text-muted-foreground">{t("dash.dataSpan")}</p>
        </div>

        {/* Stat 4: Export Data CTA */}
        <div className="flex flex-col items-center justify-center rounded-3xl border bg-card p-5 text-center shadow-sm">
          <Button onClick={exportCsv} size="sm" className="w-full rounded-2xl">
            <Download className="mr-1.5 h-4 w-4" />
            {t("dash.exportCsv")}
          </Button>
          <p className="mt-2 text-[11px] text-muted-foreground">
            {reading ? formatTime(reading.timestamp, lang) : "Live"}
          </p>
        </div>
      </div>

      {/* DEVICE / ROOM SELECTOR PILLS */}
      <div className="flex flex-wrap items-center gap-2 rounded-3xl border bg-card p-3">
        <span className="mr-2 px-2 text-xs font-semibold text-muted-foreground">Select Room:</span>
        {devices.map((d) => (
          <button
            key={d.id}
            onClick={() => select(d.id)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200",
              d.id === deviceId
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            {d.name}
          </button>
        ))}
      </div>

      <PushOptIn />

      {/* MAIN AIR QUALITY SUMMARY CARD */}
      {isLoading && !reading ? (
        <Skeleton className="h-72 rounded-3xl" />
      ) : (
        <section className={cn("status-transition rounded-3xl border p-6 lg:p-8", theme.soft)}>
          <div className="grid items-center gap-6 sm:grid-cols-[auto_minmax(0,1fr)]">
            <BreathingOrb status={status} size="sm" className="mx-auto !h-44 !w-44" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-sm text-foreground/60">
                <span className={cn("h-2.5 w-2.5 animate-pulse rounded-full", theme.dot)} />
                {t("dash.airquality")} ·{" "}
                <span className="inline-flex items-center gap-1">
                  <Radio className={cn("h-3.5 w-3.5", live && "text-good")} />
                  {t(
                    live
                      ? "dash.live"
                      : streamStatus === "reconnecting"
                        ? "rooms.reconnecting"
                        : "rooms.connecting",
                  )}
                </span>
              </div>
              <p className={cn("mt-2 font-display text-5xl font-bold leading-tight", theme.text)}>
                {t(theme.label)}
              </p>
              <p className="mt-2 text-sm text-foreground/75">
                {t("dash.sensorReading")}:{" "}
                <span key={tick} className="tabular-nums font-bold font-mono inline-block">
                  {reading?.mq135 ?? "—"}
                </span>{" "}
                ppm
              </p>
              <p className="mt-1 text-xs text-foreground/60">
                {t("dash.updated")}:{" "}
                <span className="tabular-nums">
                  {reading ? formatTime(reading.timestamp, lang) : "—"}
                </span>
              </p>

              <IndoorOutdoor indoor={reading?.status} className="mt-4" />
            </div>
          </div>
        </section>
      )}

      {/* ALL DEVICES LIVE DATA TABLE */}
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
          <div className="flex items-center gap-2">
            <TableIcon className="h-5 w-5 text-primary" />
            <h3 className="font-display text-lg">{t("dash.selectTable")}</h3>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-secondary/80 px-3 py-1 text-xs font-mono text-muted-foreground">
            <Sparkles className="h-3 w-3 text-good" />
            {t("dash.recordCount")}: {tableRows.length} Active Streams
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-secondary/30 text-xs uppercase tracking-wider text-muted-foreground">
                <th
                  className="cursor-pointer p-3.5 font-semibold hover:text-foreground"
                  onClick={() => {
                    setSortField("name");
                    setSortDir(sortDir === "asc" ? "desc" : "asc");
                  }}
                >
                  <div className="flex items-center gap-1">
                    Room / Device <ArrowDownUp className="h-3 w-3" />
                  </div>
                </th>
                <th
                  className="cursor-pointer p-3.5 font-semibold hover:text-foreground"
                  onClick={() => {
                    setSortField("type");
                    setSortDir(sortDir === "asc" ? "desc" : "asc");
                  }}
                >
                  <div className="flex items-center gap-1">
                    Measurement Type <ArrowDownUp className="h-3 w-3" />
                  </div>
                </th>
                <th className="p-3.5 font-semibold">Timestamp</th>
                <th className="p-3.5 text-right font-semibold">Live Value</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {tableRows.map((r, i) => (
                <tr key={i} className="transition-colors hover:bg-secondary/40">
                  <td className="p-3.5 font-medium">{r.name}</td>
                  <td className="p-3.5 text-muted-foreground">{r.type}</td>
                  <td className="p-3.5 font-mono text-xs text-muted-foreground">
                    {r.time ? formatTime(r.time, lang) : "—"}
                  </td>
                  <td className="p-3.5 text-right font-mono font-semibold text-primary">{r.val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <ActionCard status={status} trend={trend} />

      {devices.length > 1 && <RoomComparison devices={devices} onSelect={select} />}

      <SensorReadings reading={reading} tick={tick} />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-3xl border bg-card p-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <p className="truncate text-sm font-semibold">{t("dash.device")}</p>
            {live ? (
              <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-good-soft px-2.5 py-1 text-xs text-good">
                <Wifi className="h-3.5 w-3.5" /> {t("dash.online")}
              </span>
            ) : (
              <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                <WifiOff className="h-3.5 w-3.5" /> {t("dash.offline")}
              </span>
            )}
          </div>

          {editing ? (
            <div className="mt-4 flex gap-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl"
              />
              <Button
                className="rounded-xl"
                onClick={() => {
                  if (device && name.trim()) {
                    rename.mutate({ id: device.id, name: name.trim() });
                    toast.success(t("rooms.renamed"));
                  }
                  setEditing(false);
                }}
              >
                {t("dash.save")}
              </Button>
              <Button variant="ghost" className="rounded-xl" onClick={() => setEditing(false)}>
                {t("dash.cancel")}
              </Button>
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-3">
              <p className="min-w-0 flex-1 truncate text-lg font-medium">{device?.name ?? "—"}</p>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 rounded-full"
                onClick={() => {
                  setName(device?.name ?? "");
                  setEditing(true);
                }}
              >
                <Pencil className="mr-1 h-3.5 w-3.5" />
                {t("dash.rename")}
              </Button>
            </div>
          )}
          <DeviceDiagnostics reading={reading} className="mt-4" />
        </section>

        <section className="rounded-3xl border bg-card p-6">
          <p className="text-sm font-semibold">{t("dash.alertStatus")}</p>
          {reading?.buzzerActive ? (
            <div className="mt-4 flex items-start gap-3 rounded-2xl bg-poor-soft p-4">
              <BellRing className="mt-0.5 h-5 w-5 shrink-0 text-poor" />
              <p className="text-sm text-foreground/80">{t("dash.buzzerFired")}</p>
            </div>
          ) : (
            <div className="mt-4 flex items-start gap-3 rounded-2xl bg-good-soft p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-good" />
              <p className="text-sm text-foreground/80">{t("status.good.advice")}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
