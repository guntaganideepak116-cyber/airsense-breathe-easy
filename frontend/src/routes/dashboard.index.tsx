import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowDownUp,
  BellRing,
  CheckCircle2,
  Cpu,
  Download,
  Pencil,
  Radio,
  Sparkles,
  Table as TableIcon,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useI18n } from "@/client/lib/i18n";
import { statusTheme, formatTime } from "@/shared/lib/status";
import {
  useDeviceMutations,
  useDeviceStream,
  useLatest,
  useSelectedDevice,
  useTrend,
  useHistory,
} from "@/client/lib/queries";
import { useAirAlert } from "@/shared/lib/use-air-alert";
import { BreathingOrb } from "@/client/components/BreathingOrb";
import { PushOptIn } from "@/client/components/PushOptIn";
import { ActionCard } from "@/client/components/ActionCard";
import { IndoorOutdoor } from "@/client/components/IndoorOutdoor";
import { DeviceDiagnostics } from "@/client/components/DeviceDiagnostics";
import { SensorReadings } from "@/client/components/SensorReadings";
import { RoomComparison } from "@/client/components/RoomComparison";
import { EmptyRooms } from "@/client/components/EmptyRooms";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { Skeleton } from "@/client/components/ui/skeleton";
import { cn } from "@/client/lib/utils";
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
  const live = streamStatus === "live" && Boolean(reading);

  // CSV Data Export Function
  const exportCsv = () => {
    if (!historyData || historyData.length === 0) {
      toast.error("No historical data available to export.");
      return;
    }

    const headers = [
      "Timestamp",
      "Device Name",
      "MQ-135 Sensor Reading",
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
    if (!reading) return [];

    const base = [
      {
        name: device?.name || "Room",
        type: "Air Quality (MQ-135 Raw)",
        val: `${reading.mq135} (Raw Scale 0-1023)`,
        unit: "Raw Sensor Response",
        time: reading.timestamp,
      },
      {
        name: device?.name || "Room",
        type: "Temperature (DHT22)",
        val: `${reading.temperature} °C`,
        unit: "Celsius",
        time: reading.timestamp,
      },
      {
        name: device?.name || "Room",
        type: "Humidity (DHT22)",
        val: `${reading.humidity} %`,
        unit: "Relative Humidity",
        time: reading.timestamp,
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
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {t("dash.title")}
            </h1>
            <span className="rounded-md border border-border/80 bg-secondary/60 px-2 py-0.5 text-xs font-mono text-muted-foreground">
              {device?.name ?? "Node"}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Real-time environmental telemetry stream and node intelligence
          </p>
        </div>
      </div>

      {/* TOP STATS SUMMARY ROW */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {/* Stat 1: Monitored Rooms */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 text-center shadow-sm transition-all hover:border-border">
          <p className="font-display text-2xl sm:text-3xl font-extrabold tabular-nums text-primary">
            {devices.length}
          </p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            {t("dash.monitoredRooms")}
          </p>
        </div>

        {/* Stat 2: Total Real Readings */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 text-center shadow-sm transition-all hover:border-border">
          <p className="font-display text-2xl sm:text-3xl font-extrabold tabular-nums text-foreground">
            {historyData ? historyData.length : reading ? 1 : 0}
          </p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            {t("dash.totalReadings")}
          </p>
        </div>

        {/* Stat 3: Data Span */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 text-center shadow-sm transition-all hover:border-border">
          <p className="font-display text-2xl sm:text-3xl font-extrabold tabular-nums text-good">
            {historyData && historyData.length > 0 ? "30 Days" : "Live Active"}
          </p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">{t("dash.dataSpan")}</p>
        </div>

        {/* Stat 4: Export Data CTA */}
        <div className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-card p-4 sm:p-5 text-center shadow-sm transition-all hover:border-border">
          <Button
            onClick={exportCsv}
            size="sm"
            className="w-full rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border/80 font-medium"
            disabled={!historyData || historyData.length === 0}
          >
            <Download className="mr-1.5 h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="truncate text-xs">{t("dash.exportCsv")}</span>
          </Button>
          <p className="mt-1.5 text-[10px] text-muted-foreground truncate">
            {reading ? formatTime(reading.timestamp, lang) : "Awaiting sensor data"}
          </p>
        </div>
      </div>

      {/* DEVICE / ROOM SELECTOR PILLS */}
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto rounded-2xl border border-border/80 bg-card p-3 shadow-sm">
        <span className="shrink-0 mr-1 px-1 text-xs font-semibold text-muted-foreground whitespace-nowrap">
          Active Room:
        </span>
        {devices.map((d) => (
          <button
            key={d.id}
            onClick={() => select(d.id)}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-xl px-4 py-1.5 text-xs font-semibold transition-all duration-200 min-h-8.5",
              d.id === deviceId
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
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
        <Skeleton className="h-64 rounded-2xl" />
      ) : reading ? (
        <section
          className={cn(
            "status-transition relative overflow-hidden rounded-2xl border border-border/80 p-6 lg:p-8 shadow-md",
            theme.soft,
          )}
        >
          <div className="grid items-center gap-6 sm:grid-cols-[auto_minmax(0,1fr)]">
            <BreathingOrb status={status} size="sm" className="mx-auto h-36 w-36 sm:h-44 sm:w-44" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-medium text-foreground/70">
                <span className={cn("h-2 w-2 animate-pulse rounded-full", theme.dot)} />
                <span className="uppercase tracking-wider font-semibold">
                  {t("dash.airquality")}
                </span>
                <span>·</span>
                <span className="inline-flex items-center gap-1 font-mono">
                  <Radio className={cn("h-3 w-3", live && "text-good")} />
                  {live
                    ? t("dash.live")
                    : streamStatus === "reconnecting"
                      ? t("rooms.reconnecting")
                      : t("rooms.connecting")}
                </span>
              </div>
              <p
                className={cn(
                  "mt-2 font-display text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight",
                  theme.text,
                )}
              >
                {t(theme.label)}
              </p>
              <p className="mt-2 text-xs text-foreground/80">
                MQ-135 Raw Sensor Response:{" "}
                <span
                  key={tick}
                  className="tabular-nums font-bold font-mono text-sm text-foreground"
                >
                  {reading.mq135}
                </span>{" "}
                <span className="text-[11px] text-muted-foreground">(Relative Scale 0–1023)</span>
              </p>
              <p className="mt-1 text-[11px] text-foreground/60">
                {t("dash.updated")}:{" "}
                <span className="tabular-nums">{formatTime(reading.timestamp, lang)}</span>
              </p>

              <IndoorOutdoor indoor={reading.status} className="mt-4" />
            </div>
          </div>
        </section>
      ) : (
        /* Empty State when device exists but no readings received yet */
        <section className="rounded-2xl border border-border/80 bg-card p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/80 text-muted-foreground">
            <Radio className="h-6 w-6 animate-pulse text-primary" />
          </div>
          <h2 className="mt-4 font-display text-xl font-bold text-foreground">
            Waiting for Sensor Data
          </h2>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted-foreground">
            No readings have arrived from device{" "}
            <code className="font-mono text-primary">{device?.name}</code> ({deviceId}) yet. Power
            on your ESP32 hardware and ensure it connects to Wi-Fi.
          </p>
        </section>
      )}

      {/* ALL DEVICES LIVE DATA TABLE */}
      <section className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-4">
          <div className="flex items-center gap-2">
            <TableIcon className="h-4 w-4 text-primary" />
            <h3 className="font-display text-base font-bold text-foreground">
              {t("dash.selectTable")}
            </h3>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-secondary/60 px-3 py-1 text-[11px] font-mono text-muted-foreground">
            <Sparkles className="h-3 w-3 text-good" />
            {tableRows.length > 0
              ? `${tableRows.length} Active Channels`
              : "Waiting for hardware stream"}
          </span>
        </div>

        {tableRows.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No live sensor readings available yet. Once the ESP32 begins transmitting, readings will
            display here.
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/80 bg-secondary/30 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th
                    className="cursor-pointer p-3 font-semibold hover:text-foreground"
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
                    className="cursor-pointer p-3 font-semibold hover:text-foreground"
                    onClick={() => {
                      setSortField("type");
                      setSortDir(sortDir === "asc" ? "desc" : "asc");
                    }}
                  >
                    <div className="flex items-center gap-1">
                      Measurement Channel <ArrowDownUp className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="p-3 font-semibold">Timestamp</th>
                  <th className="p-3 text-right font-semibold">Live Telemetry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-xs">
                {tableRows.map((r, i) => (
                  <tr key={i} className="transition-colors hover:bg-secondary/40">
                    <td className="p-3 font-semibold text-foreground">{r.name}</td>
                    <td className="p-3 text-muted-foreground">{r.type}</td>
                    <td className="p-3 font-mono text-[11px] text-muted-foreground">
                      {r.time ? formatTime(r.time, lang) : "—"}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-primary">{r.val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {reading && <ActionCard status={status} trend={trend} />}

      {devices.length > 1 && <RoomComparison devices={devices} onSelect={select} />}

      <SensorReadings reading={reading} tick={tick} />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" />
              <p className="truncate text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("dash.device")}
              </p>
            </div>
            {device?.online || live ? (
              <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-good-soft px-2.5 py-0.5 text-[11px] font-medium text-good">
                <Wifi className="h-3 w-3" /> {t("dash.online")}
              </span>
            ) : (
              <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                <WifiOff className="h-3 w-3" />{" "}
                {device?.lastSeen ? t("dash.offline") : "Never Connected"}
              </span>
            )}
          </div>

          {editing ? (
            <div className="mt-4 flex gap-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border-border/80 bg-secondary/50"
              />
              <Button
                className="rounded-xl bg-primary text-primary-foreground font-semibold"
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
              <p className="min-w-0 flex-1 truncate text-base font-semibold text-foreground">
                {device?.name ?? "—"}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 rounded-xl border-border/80 bg-secondary/50 hover:bg-secondary text-xs"
                onClick={() => {
                  setName(device?.name ?? "");
                  setEditing(true);
                }}
              >
                <Pencil className="mr-1 h-3 w-3" />
                {t("dash.rename")}
              </Button>
            </div>
          )}
          <DeviceDiagnostics reading={reading} className="mt-4" />
        </section>

        <section className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("dash.alertStatus")}
          </p>
          {reading?.buzzerActive ? (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-poor/30 bg-poor-soft p-4">
              <BellRing className="mt-0.5 h-4 w-4 shrink-0 text-poor" />
              <p className="text-xs text-foreground/90">{t("dash.buzzerFired")}</p>
            </div>
          ) : (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-good/30 bg-good-soft p-4">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-good" />
              <p className="text-xs text-foreground/90">
                {reading ? t("status.good.advice") : "Awaiting hardware readings"}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
