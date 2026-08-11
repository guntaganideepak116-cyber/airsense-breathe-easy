import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BellRing, CheckCircle2, Pencil, Radio, Wifi, WifiOff } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { statusTheme, formatTime } from "@/lib/status";
import { useDeviceMutations, useDeviceStream, useLatest, useSelectedDevice, useTrend } from "@/lib/queries";
import { useAirAlert } from "@/lib/use-air-alert";
import { BreathingOrb } from "@/components/BreathingOrb";
import { PushOptIn } from "@/components/PushOptIn";
import { TodaySummary } from "@/components/TodaySummary";
import { ActionCard } from "@/components/ActionCard";
import { IndoorOutdoor } from "@/components/IndoorOutdoor";
import { DeviceDiagnostics } from "@/components/DeviceDiagnostics";
import { WeeklyInsight } from "@/components/WeeklyInsight";
import { RoomComparison } from "@/components/RoomComparison";
import { EmptyRooms } from "@/components/EmptyRooms";
import { SensorReadings } from "@/components/SensorReadings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Live air quality — AirSense dashboard" },
      { name: "description", content: "Live air quality, temperature and humidity for the room you monitor." },
      { property: "og:title", content: "Live air quality — AirSense" },
      { property: "og:description", content: "Current status, sensor readings and what to do right now." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Overview,
});

function Overview() {
  const { t, lang } = useI18n();
  const { devices, device, deviceId, select } = useSelectedDevice();
  const { data: polled, isLoading } = useLatest(deviceId);
  const { reading: streamed, status: streamStatus, tick } = useDeviceStream(deviceId);
  const { rename } = useDeviceMutations();
  const trend = useTrend(deviceId);
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");

  const reading = streamed ?? polled;
  useAirAlert(streamed, device?.name);

  const status = reading?.status ?? "good";
  const theme = statusTheme[status];
  const live = streamStatus === "live";



  if (devices.length === 0) {
    return <EmptyRooms onAdd={() => void navigate({ to: "/dashboard/rooms" })} />;
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl text-ink sm:text-3xl">{t("dash.title")}</h1>
          <p className="truncate text-sm text-muted-foreground">{device?.name ?? "—"}</p>
        </div>
        {devices.length > 1 && (
          <Select {...(deviceId ? { value: deviceId } : {})} onValueChange={select}>
            <SelectTrigger className="w-44 rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {devices.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <PushOptIn />

      <TodaySummary deviceId={deviceId} devices={devices} />

      {isLoading && !reading ? (
        <Skeleton className="h-72 rounded-3xl" />
      ) : (
        <section className={cn("status-transition rounded-3xl border p-6", theme.soft)}>
          <div className="grid items-center gap-6 sm:grid-cols-[auto_minmax(0,1fr)]">
            <BreathingOrb status={status} size="sm" className="mx-auto !h-44 !w-44" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-sm text-foreground/60">
                <span className={cn("h-2 w-2 animate-pulse rounded-full", theme.dot)} />
                {t("dash.airquality")} ·{" "}
                <span className="inline-flex items-center gap-1">
                  <Radio className={cn("h-3 w-3", live && "text-good")} />
                  {t(live ? "dash.live" : streamStatus === "reconnecting" ? "rooms.reconnecting" : "rooms.connecting")}
                </span>
              </div>
              <p className={cn("mt-2 font-display text-5xl leading-tight status-transition", theme.text)}>
                {t(theme.label)}
              </p>
              <p className="mt-2 text-sm text-foreground/70">
                {t("dash.sensorReading")}:{" "}
                <span key={tick} className="tabular-nums value-pulse inline-block">
                  {reading?.mq135 ?? "—"}
                </span>{" "}
                ppm
              </p>
              <p className="mt-1 text-xs text-foreground/60">
                {t("dash.updated")}:{" "}
                <span className="tabular-nums">{reading ? formatTime(reading.timestamp, lang) : "—"}</span>
              </p>

              <IndoorOutdoor indoor={reading?.status} className="mt-4" />
            </div>
          </div>
        </section>
      )}


      <ActionCard status={status} trend={trend} />

      <WeeklyInsight deviceId={deviceId} />

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
              <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl" />
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
          <p className="mt-3 text-xs text-muted-foreground">
            {t("dash.updated")}:{" "}
            <span className="tabular-nums">{reading ? formatTime(reading.timestamp, lang) : "—"}</span>
          </p>

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
          <p className="mt-4 text-xs text-muted-foreground">
            {t("dash.lastPoor")}:{" "}
            <span className="tabular-nums">
              {reading?.lastPoorAt ? formatTime(reading.lastPoorAt, lang) : t("dash.noPoor")}
            </span>
          </p>
        </section>
      </div>
    </div>
  );
}

