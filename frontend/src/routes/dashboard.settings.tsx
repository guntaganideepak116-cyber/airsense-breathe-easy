import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useClerk } from "@clerk/clerk-react";
import { BellRing, CheckCircle2, LogOut, Mail, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/client/lib/i18n";
import {
  useDeviceMutations,
  useDevices,
  useUserPreferences,
  useUpdateUserPreferences,
} from "@/client/lib/queries";
import { formatTime } from "@/shared/lib/status";
import { disablePush, enablePush, pushPreference, pushState } from "@/client/lib/push";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { Label } from "@/client/components/ui/label";
import { Slider } from "@/client/components/ui/slider";
import { Switch } from "@/client/components/ui/switch";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AirSense" },
      {
        name: "description",
        content:
          "Manage email alerts, push alerts, alert thresholds, devices and language for AirSense.",
      },
      { property: "og:title", content: "Settings — AirSense" },
      {
        property: "og:description",
        content: "Email notification preferences, device management and Telugu/English toggle.",
      },
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

      <EmailAlertsSection />

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
            <span className="text-sm tabular-nums text-muted-foreground">
              {threshold} (Sensor Value)
            </span>
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
                    if (!window.confirm(`${t("dev.removeConfirm")}\n${t("dev.removeDesc")}`))
                      return;
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

      <AccountSection />
    </div>
  );
}

function EmailAlertsSection() {
  const { data: prefs, isLoading } = useUserPreferences();
  const updatePrefs = useUpdateUserPreferences();

  const [email, setEmail] = useState("");
  const [emailEnabled, setEmailEnabled] = useState(true);

  useEffect(() => {
    if (prefs) {
      setEmail(prefs.email ?? "");
      setEmailEnabled(prefs.alertChannels?.email ?? true);
    }
  }, [prefs]);

  const handleToggleEmail = (enabled: boolean) => {
    setEmailEnabled(enabled);
    updatePrefs.mutate(
      { alertChannels: { email: enabled } },
      {
        onSuccess: () =>
          toast.success(enabled ? "Email alerts enabled!" : "Email alerts disabled."),
        onError: () => toast.error("Failed to update email alert preference."),
      },
    );
  };

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    updatePrefs.mutate(
      { email: cleanEmail },
      {
        onSuccess: () => toast.success("Recipient email address saved successfully!"),
        onError: () => toast.error("Failed to save recipient email."),
      },
    );
  };

  return (
    <section className="rounded-3xl border bg-card p-6 shadow-sm">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
          <Mail className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-ink">Email Alert Notifications</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure automated email notifications via Resend for instant indoor air quality
            warnings, sensor measurements, and AI guidance.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {/* Email Channel Toggle */}
        <div className="flex items-center justify-between gap-4 rounded-2xl border p-4 bg-background/50">
          <div className="flex items-center gap-3 min-w-0">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <Mail className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Email Alerts (Resend)</p>
                {emailEnabled ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground border">
                    Disabled
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Detailed HTML summary with live MQ-135, temperature, humidity metrics & AI
                recommendations
              </p>
            </div>
          </div>
          <Switch
            checked={emailEnabled}
            disabled={isLoading || updatePrefs.isPending}
            onCheckedChange={handleToggleEmail}
          />
        </div>
      </div>

      {/* Recipient Email Address Configuration */}
      <form onSubmit={handleSaveEmail} className="mt-6 border-t pt-5 space-y-4">
        <div>
          <Label
            htmlFor="emailAddr"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Recipient Email Address
          </Label>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Destination address for hazard warnings (MQ-135 ≥ 700) and actionable ventilation
            recommendations.
          </p>
        </div>

        <div className="max-w-md space-y-2">
          <Input
            id="emailAddr"
            type="email"
            placeholder="e.g. user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl"
          />
          {email ? (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>
                Alerts will be delivered to <strong className="text-foreground">{email}</strong>
              </span>
            </div>
          ) : (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              No recipient email configured. Please enter an email address to receive alerts.
            </p>
          )}
        </div>

        <div className="pt-2 flex justify-start">
          <Button
            type="submit"
            disabled={updatePrefs.isPending}
            className="rounded-full gap-2 px-6"
          >
            <Save className="h-4 w-4" />
            {updatePrefs.isPending ? "Saving..." : "Save Email Address"}
          </Button>
        </div>
      </form>
    </section>
  );
}

function AccountSection() {
  const { t } = useI18n();
  const clerk = useClerk();

  const handleLogout = async () => {
    try {
      await clerk.signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    }
    window.location.href = "/";
  };

  return (
    <section className="rounded-3xl border bg-card p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive">
          <LogOut className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-semibold text-foreground">{t("set.account")}</h2>
          <p className="text-xs text-muted-foreground">{t("nav.logoutDesc")}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border bg-background/50 p-4">
        <div>
          <p className="text-sm font-medium text-foreground">Sign out of your session</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Safely end your AirSense session on this device.
          </p>
        </div>
        <Button
          type="button"
          variant="destructive"
          onClick={handleLogout}
          className="rounded-full gap-2 px-5"
        >
          <LogOut className="h-4 w-4" />
          {t("nav.logout")}
        </Button>
      </div>
    </section>
  );
}
