import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BellRing, LogOut, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { useDeviceMutations, useDevices } from "@/lib/queries";
import { formatTime } from "@/lib/status";
import { disablePush, enablePush, pushPreference, pushState } from "@/lib/push";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AirSense" },
      { name: "description", content: "Manage push alerts, alert thresholds, devices and language for AirSense." },
      { property: "og:title", content: "Settings — AirSense" },
      { property: "og:description", content: "Notification preferences, device management and Telugu/English toggle." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { t, lang, setLang } = useI18n();
  const { data: devices } = useDevices();
  const { rename, remove } = useDeviceMutations();
  const [push, setPush] = useState(false);
  const [supported, setSupported] = useState(true);
  const [threshold, setThreshold] = useState(700);

  useEffect(() => {
    const state = pushState();
    setSupported(state !== "unsupported");
    setPush(state === "granted" && pushPreference());
    const saved = localStorage.getItem("airsense-threshold");
    if (saved) setThreshold(Number(saved));
  }, []);

  const turnOn = async () => {
    const next = await enablePush();
    setPush(next === "granted");
    if (next === "granted") toast.success(t("push.enabled"));
    else if (next === "denied") toast.error(t("push.blocked"));
    else if (next === "unsupported") toast.error(t("push.unsupported"));
  };


  return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl text-ink sm:text-3xl">{t("set.title")}</h1>

      <section className="rounded-3xl border bg-card p-6">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-soft text-primary">
            <BellRing className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="font-semibold">{t("set.notif")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t("set.pushDesc")}</p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border p-4">
          <div className="min-w-0">
            <p className="text-sm font-medium">{t("set.push")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("set.pushNote")}</p>
          </div>
          <Switch
            checked={push}
            disabled={!supported}
            aria-label={t("set.push")}
            onCheckedChange={(v) => {
              if (v) void turnOn();
              else {
                setPush(false);
                void disablePush();
              }
            }}
          />

        </div>

        <div className="mt-4 rounded-2xl border p-4">
          <div className="flex items-center justify-between gap-4">
            <Label>{t("set.threshold")}</Label>
            <span className="text-sm tabular-nums text-muted-foreground">{threshold} ppm</span>
          </div>
          <Slider
            className="mt-4"
            min={400}
            max={1000}
            step={25}
            value={[threshold]}
            onValueChange={([v]) => setThreshold(v ?? 700)}
            onValueCommit={([v]) => {
              localStorage.setItem("airsense-threshold", String(v));
              toast.success(t("set.saved"));
            }}
          />
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-6">
        <p className="font-semibold">{t("set.devices")}</p>

        <p className="mt-1 text-sm text-muted-foreground">{t("dev.manageDesc")}</p>
        <ul className="mt-4 space-y-3">
          {(devices ?? []).map((d) => (
            <li key={d.id} className="rounded-2xl border p-3">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <Input
                  defaultValue={d.name}
                  className="rounded-xl"
                  onBlur={(e) => {
                    const value = e.target.value.trim();
                    if (value && value !== d.name) {
                      rename.mutate({ id: d.id, name: value });
                      toast.success(t("rooms.renamed"));
                    }
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 rounded-full text-poor"
                  aria-label={t("rooms.remove")}
                  onClick={() => {
                    if (!window.confirm(`${t("dev.removeConfirm")}\n${t("dev.removeDesc")}`)) return;
                    remove.mutate(d.id);
                    toast.success(t("rooms.removed"));
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 grid gap-1 px-1 text-xs text-muted-foreground sm:grid-cols-2">
                <span className="truncate font-mono">{d.id}</span>
                <span className="sm:text-right">
                  {t("dev.lastSeen")}: {d.lastSeen ? formatTime(d.lastSeen, lang) : t("dev.never")}
                </span>
              </div>
            </li>
          ))}
        </ul>
        <Button asChild variant="outline" className="mt-4 rounded-full">
          <Link to="/dashboard/rooms">{t("rooms.add")}</Link>
        </Button>
      </section>


      <section className="rounded-3xl border bg-card p-6">
        <p className="font-semibold">{t("set.lang")}</p>
        <div className="mt-4 flex gap-2">
          {(["te", "en"] as const).map((l) => (
            <Button
              key={l}
              variant={lang === l ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setLang(l)}
            >
              {l === "te" ? "తెలుగు" : "English"}
            </Button>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-6">
        <p className="font-semibold">{t("set.account")}</p>
        <Button asChild variant="outline" className="mt-4 rounded-full">
          <Link to="/auth">
            <LogOut className="mr-1 h-4 w-4" />
            {t("set.signout")}
          </Link>
        </Button>
      </section>
    </div>
  );
}
