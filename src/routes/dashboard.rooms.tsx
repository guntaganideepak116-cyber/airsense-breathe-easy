import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BatteryCharging, MapPin, Plus, Radio, Signal, Wifi, WifiOff, X } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { statusTheme, formatTime } from "@/lib/status";
import { useDeviceMutations, useDeviceStream, useSelectedDevice } from "@/lib/queries";
import { useAirAlert } from "@/lib/use-air-alert";
import { classify, type Device } from "@/lib/airsense";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DeviceCredentialsDialog, type Credentials } from "@/components/DeviceCredentialsDialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/rooms")({
  head: () => ({
    meta: [
      { title: "Sensor Locations & Floor Plan — AirSense" },
      {
        name: "description",
        content: "Interactive floor plan pins and sensor hardware diagnostics.",
      },
    ],
  }),
  component: RoomsPage,
});

function RoomsPage() {
  const { t } = useI18n();
  const { devices, select } = useSelectedDevice();
  const { create } = useDeviceMutations();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [activeRoom, setActiveRoom] = useState<Device | null>(null);

  const submit = () => {
    const value = name.trim();
    if (!value) return;
    create.mutate(value, {
      onSuccess: ({ device, apiKey }) => {
        setCredentials({ deviceId: device.id, apiKey });
        toast.success(t("dev.created"));
      },
    });
    setName("");
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink sm:text-3xl">{t("dash.rooms")}</h1>
          <p className="text-sm text-muted-foreground">
            Interactive room locations and sensor hardware status.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full">
              <Plus className="mr-1.5 h-4 w-4" />
              {t("rooms.add")}
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl">
            <DialogHeader>
              <DialogTitle>{t("rooms.add")}</DialogTitle>
              <DialogDescription>{t("rooms.addDesc")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="room">{t("rooms.name")}</Label>
              <Input
                id="room"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                className="rounded-xl"
              />
            </div>
            <DialogFooter>
              <Button className="rounded-xl" disabled={create.isPending} onClick={submit}>
                {t("dash.save")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Split: Floor Plan Map Visual (Left) & Sensor Status Panel (Right) */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Floor Plan Map Visual */}
        <section className="relative overflow-hidden rounded-3xl border bg-card p-6 lg:col-span-7">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="font-display text-lg">Building Floor Plan</h2>
            <span className="text-xs text-muted-foreground">Click a pin to view room details</span>
          </div>

          <div className="relative mt-4 grid h-80 w-full place-items-center rounded-2xl border bg-secondary/20 p-4 grain-panel">
            {/* SVG Floorplan Graphic */}
            <svg viewBox="0 0 500 320" className="h-full w-full opacity-60" role="img">
              <rect
                x="20"
                y="20"
                width="460"
                height="280"
                rx="16"
                fill="none"
                stroke="var(--border)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <line x1="180" y1="20" x2="180" y2="300" stroke="var(--border)" strokeWidth="2" />
              <line x1="340" y1="20" x2="340" y2="300" stroke="var(--border)" strokeWidth="2" />
              <line x1="20" y1="160" x2="480" y2="160" stroke="var(--border)" strokeWidth="2" />
              <text x="70" y="100" fill="var(--muted-foreground)" fontSize="14">
                Classroom A
              </text>
              <text x="230" y="100" fill="var(--muted-foreground)" fontSize="14">
                Classroom B
              </text>
              <text x="390" y="100" fill="var(--muted-foreground)" fontSize="14">
                Hostel Hall
              </text>
              <text x="70" y="240" fill="var(--muted-foreground)" fontSize="14">
                Bedroom 1
              </text>
              <text x="230" y="240" fill="var(--muted-foreground)" fontSize="14">
                Common Area
              </text>
              <text x="390" y="240" fill="var(--muted-foreground)" fontSize="14">
                Staff Room
              </text>
            </svg>

            {/* Pinned Room Map Buttons */}
            {devices.map((d, i) => {
              const coords = [
                { top: "28%", left: "24%" },
                { top: "68%", left: "55%" },
                { top: "35%", left: "78%" },
                { top: "72%", left: "22%" },
              ][i % 4] || { top: "50%", left: "50%" };

              return (
                <button
                  key={d.id}
                  style={{ top: coords.top, left: coords.left }}
                  onClick={() => {
                    select(d.id);
                    setActiveRoom(d);
                  }}
                  className={cn(
                    "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border bg-card px-3 py-1.5 shadow-lg transition-all duration-200 hover:scale-110",
                    d.id === activeRoom?.id && "ring-2 ring-primary ring-offset-2",
                  )}
                >
                  <span className="flex items-center gap-1.5 text-xs font-semibold">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span>{d.name}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Sensor Status Panel */}
        <section className="space-y-4 lg:col-span-5">
          <h2 className="font-display text-lg">Sensor Status List</h2>
          <div className="space-y-3">
            {devices.map((d) => (
              <RoomCard
                key={d.id}
                device={d}
                isSelected={d.id === activeRoom?.id}
                onSelect={() => {
                  select(d.id);
                  setActiveRoom(d);
                }}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Sensor Details Panel Modal/Drawer */}
      {activeRoom && (
        <section className="relative rounded-3xl border bg-card p-6 shadow-md transition-all">
          <button
            onClick={() => setActiveRoom(null)}
            className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-secondary text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 text-primary">
            <MapPin className="h-5 w-5" />
            <h3 className="font-display text-xl font-bold">Sensor Details — {activeRoom.name}</h3>
          </div>

          <div className="mt-5 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border bg-secondary/30 p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Basic Information
              </h4>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Device ID</span>
                  <span className="font-mono">{activeRoom.id}</span>
                </li>
                <li className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Assigned Location</span>
                  <span>{activeRoom.name}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Firmware Version</span>
                  <span className="font-mono">v1.4.2</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border bg-secondary/30 p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Current Hardware Status
              </h4>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Connection State</span>
                  <span className="flex items-center gap-1 text-good">
                    <Wifi className="h-3.5 w-3.5" /> Online (Live SSE)
                  </span>
                </li>
                <li className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Signal Strength (RSSI)</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Signal className="h-3.5 w-3.5 text-primary" /> -58 dBm
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Power Source</span>
                  <span className="flex items-center gap-1 text-good">
                    <BatteryCharging className="h-3.5 w-3.5" /> 5V DC Plugged
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

      <DeviceCredentialsDialog credentials={credentials} onClose={() => setCredentials(null)} />
    </div>
  );
}

function RoomCard({
  device,
  isSelected,
  onSelect,
}: {
  device: Device;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { reading, status: streamStatus, tick } = useDeviceStream(device.id);
  useAirAlert(reading, device.name);

  const status = reading?.status ?? classify(350);
  const theme = statusTheme[status];
  const live = streamStatus === "live";

  return (
    <div
      onClick={onSelect}
      className={cn(
        "status-transition cursor-pointer rounded-2xl sm:rounded-3xl border p-4 sm:p-5 transition-all hover:shadow-md",
        theme.soft,
        isSelected && "ring-2 ring-primary shadow-sm",
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b pb-2.5">
        <p className="min-w-0 truncate font-display font-semibold text-base text-foreground">
          {device.name}
        </p>
        <span
          className={cn(
            "flex shrink-0 items-center gap-1 rounded-full border bg-card/90 px-2.5 py-0.5 text-[11px] font-medium",
            live ? "text-good border-good/30" : "text-muted-foreground border-border",
          )}
        >
          {live ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
          {t(live ? "dash.online" : "dash.offline")}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={cn("h-3 w-3 animate-pulse rounded-full shrink-0", theme.dot)} />
          <p className={cn("font-display text-lg sm:text-xl font-bold", theme.text)}>
            {t(theme.label)}
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
            MQ-135
          </span>
          <p className="font-mono text-base font-bold text-foreground tabular-nums">
            <span key={tick} className="value-pulse inline-block">
              {reading?.mq135 ?? "—"}
            </span>{" "}
            <span className="text-xs font-normal text-muted-foreground">ppm</span>
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground border-t pt-2.5">
        <span className="flex items-center gap-1 truncate text-[11px]">
          <Radio className={cn("h-3 w-3 shrink-0", live && "text-good")} />
          <span className="truncate">
            {t(
              live
                ? "rooms.live"
                : streamStatus === "reconnecting"
                  ? "rooms.reconnecting"
                  : "rooms.connecting",
            )}
          </span>
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
            void navigate({ to: "/dashboard" });
          }}
          className="shrink-0 font-semibold text-primary hover:underline text-xs flex items-center gap-1"
        >
          {t("dash.viewRoom")} →
        </button>
      </div>
    </div>
  );
}
