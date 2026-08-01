import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { statusTheme } from "@/lib/status";
import { useDeviceMutations, useSelectedDevice } from "@/lib/queries";
import { classify, type Device } from "@/lib/airsense";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/airsense";
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
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/rooms")({
  head: () => ({
    meta: [
      { title: "All rooms — AirSense" },
      { name: "description", content: "Every monitored room at a glance with its current air quality status." },
      { property: "og:title", content: "All rooms — AirSense" },
      { property: "og:description", content: "Multi-room air quality overview for schools, homes and hostels." },
      { name: "robots", content: "noindex" },
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

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <h1 className="truncate font-display text-2xl text-ink sm:text-3xl">{t("rooms.title")}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="shrink-0 rounded-full">
              <Plus className="mr-1 h-4 w-4" />
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
              <Input id="room" value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl" />
            </div>
            <DialogFooter>
              <Button
                className="rounded-xl"
                onClick={() => {
                  if (!name.trim()) return;
                  create.mutate(name.trim());
                  toast.success(t("rooms.created"));
                  setName("");
                  setOpen(false);
                }}
              >
                {t("dash.save")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {devices.map((d) => (
          <RoomCard key={d.id} device={d} onOpen={() => select(d.id)} />
        ))}
      </div>
    </div>
  );
}

function RoomCard({ device, onOpen }: { device: Device; onOpen: () => void }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { data } = useQuery({
    queryKey: ["latest", device.id],
    queryFn: () => api.latest(device.id),
    refetchInterval: 10000,
  });
  const status = data?.status ?? classify(350);
  const theme = statusTheme[status];

  return (
    <button
      onClick={() => {
        onOpen();
        navigate({ to: "/dashboard" });
      }}
      className={cn(
        "status-transition rounded-3xl border p-5 text-left transition-shadow hover:shadow-md",
        theme.soft,
      )}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <p className="min-w-0 truncate font-semibold">{device.name}</p>
        <span
          className={cn(
            "flex shrink-0 items-center gap-1 rounded-full bg-card/70 px-2 py-0.5 text-[11px]",
            device.online ? "text-good" : "text-muted-foreground",
          )}
        >
          {device.online ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
          {t(device.online ? "dash.online" : "dash.offline")}
        </span>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <span className={cn("h-3 w-3 animate-pulse rounded-full", theme.dot)} />
        <p className={cn("font-display text-2xl", theme.text)}>{t(theme.label)}</p>
      </div>
      <p className="mt-2 text-xs text-foreground/60">
        {t("dash.sensorReading")}: <span className="tabular-nums">{data?.mq135 ?? "—"}</span> ppm
      </p>
      <p className="mt-4 text-xs font-medium text-primary">{t("dash.viewRoom")} →</p>
    </button>
  );
}
