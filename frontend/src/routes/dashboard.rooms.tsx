import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Plus, Radio, Trash2, Wifi, WifiOff, X } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/client/lib/i18n";
import { statusTheme, formatTime } from "@/shared/lib/status";
import { useDeviceMutations, useDeviceStream, useSelectedDevice } from "@/client/lib/queries";
import { useAirAlert } from "@/shared/lib/use-air-alert";
import type { Device } from "@/client/lib/airsense";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { Label } from "@/client/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/client/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/client/components/ui/alert-dialog";
import {
  DeviceCredentialsDialog,
  type Credentials,
} from "@/client/components/DeviceCredentialsDialog";
import { cn } from "@/client/lib/utils";

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
  const { t, lang } = useI18n();
  const { devices, select } = useSelectedDevice();
  const { create, remove } = useDeviceMutations();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [activeRoom, setActiveRoom] = useState<Device | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Device | null>(null);

  const submit = () => {
    const value = name.trim();
    if (!value) return;
    create.mutate(value, {
      onSuccess: ({ device, apiKey }) => {
        setCredentials({ deviceId: device.id, apiKey });
        toast.success(t("dev.created"));
      },
      onError: () => {
        toast.error("Failed to create room. Make sure your backend is connected.");
      },
    });
    setName("");
    setOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget.id;
    const targetName = deleteTarget.name;
    remove.mutate(targetId, {
      onSuccess: () => {
        toast.success(`"${targetName}" has been deleted.`);
        if (activeRoom?.id === targetId) setActiveRoom(null);
      },
      onError: () => {
        toast.error(`Failed to delete "${targetName}". Please try again.`);
      },
    });
    setDeleteTarget(null);
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
                placeholder="e.g. Living Room, Lab 4B..."
                className="rounded-xl"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                className="rounded-xl"
                disabled={create.isPending || !name.trim()}
                onClick={submit}
              >
                {create.isPending ? "Creating..." : t("dash.save")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Empty state */}
      {devices.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed bg-card py-16 text-center">
          <MapPin className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="font-display text-lg text-foreground">No rooms registered yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Click &quot;+ Add Room&quot; to register your first sensor location.
          </p>
          <Button className="mt-5 rounded-full" onClick={() => setOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add your first room
          </Button>
        </div>
      )}

      {devices.length > 0 && (
        <>
          {/* Main Split: Floor Plan Map Visual (Left) & Sensor Status Panel (Right) */}
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Floor Plan Map Visual */}
            <section className="relative overflow-hidden rounded-3xl border bg-card p-6 lg:col-span-7">
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="font-display text-lg">Building Floor Plan</h2>
                <span className="text-xs text-muted-foreground">
                  Click a pin to view room details
                </span>
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
                    { top: "50%", left: "50%" },
                    { top: "20%", left: "60%" },
                  ][i % 6] || { top: "50%", left: "50%" };

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
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg">Sensor Status List</h2>
                <span className="text-xs text-muted-foreground">
                  {devices.length} room{devices.length !== 1 ? "s" : ""}
                </span>
              </div>
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
                    onDelete={() => setDeleteTarget(d)}
                    isDeleting={remove.isPending && deleteTarget?.id === d.id}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Sensor Details Panel */}
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
                <h3 className="font-display text-xl font-bold">
                  Sensor Details — {activeRoom.name}
                </h3>
              </div>

              <div className="mt-5 grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border bg-secondary/30 p-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Basic Information
                  </h4>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li className="flex justify-between border-b pb-1.5">
                      <span className="text-muted-foreground">Device ID</span>
                      <span className="font-mono text-primary font-bold">{activeRoom.id}</span>
                    </li>
                    <li className="flex justify-between border-b pb-1.5">
                      <span className="text-muted-foreground">Assigned Location</span>
                      <span>{activeRoom.name}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Created At</span>
                      <span className="font-mono text-xs">
                        {activeRoom.createdAt
                          ? formatTime(activeRoom.createdAt, lang)
                          : "Registered"}
                      </span>
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
                      <span
                        className={cn(
                          "flex items-center gap-1 font-medium",
                          activeRoom.online ? "text-good" : "text-muted-foreground",
                        )}
                      >
                        {activeRoom.online ? (
                          <Wifi className="h-3.5 w-3.5" />
                        ) : (
                          <WifiOff className="h-3.5 w-3.5" />
                        )}
                        {activeRoom.online
                          ? "Online (Live stream)"
                          : activeRoom.lastSeen
                            ? "Offline"
                            : "Never Connected"}
                      </span>
                    </li>
                    <li className="flex justify-between border-b pb-1.5">
                      <span className="text-muted-foreground">Last Seen</span>
                      <span className="font-mono text-xs">
                        {activeRoom.lastSeen ? formatTime(activeRoom.lastSeen, lang) : "Never"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">API Data Endpoint</span>
                      <span className="font-mono text-xs text-primary">POST /api/devices/data</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Delete from details panel */}
              <div className="mt-4 flex justify-end">
                <Button
                  variant="destructive"
                  size="sm"
                  className="rounded-xl gap-2"
                  onClick={() => setDeleteTarget(activeRoom)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete This Room
                </Button>
              </div>
            </section>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &quot;{deleteTarget?.name}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the room and all its sensor history, readings, and
              detected events from AirSense. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              {remove.isPending ? "Deleting..." : "Yes, Delete Room"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DeviceCredentialsDialog credentials={credentials} onClose={() => setCredentials(null)} />
    </div>
  );
}

function RoomCard({
  device,
  isSelected,
  onSelect,
  onDelete,
  isDeleting,
}: {
  device: Device;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { reading, status: streamStatus, tick } = useDeviceStream(device.id);
  useAirAlert(reading, device.name);

  const hasReading = Boolean(reading);
  const status = reading?.status ?? "good";
  const theme = statusTheme[status];
  const live = (streamStatus === "live" || device.online) && hasReading;

  return (
    <div
      onClick={onSelect}
      className={cn(
        "status-transition cursor-pointer rounded-2xl sm:rounded-3xl border p-4 sm:p-5 transition-all hover:shadow-md",
        hasReading ? theme.soft : "bg-card",
        isSelected && "ring-2 ring-primary shadow-sm",
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b pb-2.5">
        <p className="min-w-0 truncate font-display font-semibold text-base text-foreground">
          {device.name}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className={cn(
              "flex shrink-0 items-center gap-1 rounded-full border bg-card/90 px-2.5 py-0.5 text-[11px] font-medium",
              live ? "text-good border-good/30" : "text-muted-foreground border-border",
            )}
          >
            {live ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {live ? t("dash.online") : device.lastSeen ? t("dash.offline") : "Never Connected"}
          </span>
          {/* Delete button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            disabled={isDeleting}
            title="Delete room"
            className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {hasReading ? (
            <>
              <span className={cn("h-3 w-3 animate-pulse rounded-full shrink-0", theme.dot)} />
              <p className={cn("font-display text-lg sm:text-xl font-bold", theme.text)}>
                {t(theme.label)}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground font-medium">Waiting for sensor data</p>
          )}
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
            MQ-135
          </span>
          <p className="font-mono text-base font-bold text-foreground tabular-nums">
            <span key={tick} className="value-pulse inline-block">
              {reading?.mq135 ?? "—"}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground border-t pt-2.5">
        <span className="flex items-center gap-1 truncate text-[11px]">
          <Radio className={cn("h-3 w-3 shrink-0", live && "text-good")} />
          <span className="truncate">
            {live
              ? t("rooms.live")
              : streamStatus === "reconnecting"
                ? t("rooms.reconnecting")
                : t("rooms.connecting")}
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
