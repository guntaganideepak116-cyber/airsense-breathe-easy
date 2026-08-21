import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useClerk } from "@clerk/clerk-react";
import {
  BellRing,
  LogOut,
  Mail,
  MessageCircle,
  MessageSquare,
  Radio,
  Save,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import {
  useDeviceMutations,
  useDevices,
  useUserPreferences,
  useUpdateUserPreferences,
} from "@/lib/queries";
import { formatTime } from "@/lib/status";
import { disablePush, enablePush, pushPreference, pushState } from "@/lib/push";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

import { MockAlertCard } from "@/components/MockAlertCard";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AirSense" },
      {
        name: "description",
        content:
          "Manage multi-channel alerts, push alerts, alert thresholds, devices and language for AirSense.",
      },
      { property: "og:title", content: "Settings — AirSense" },
      {
        property: "og:description",
        content:
          "Multi-channel SMS, WhatsApp and Email notification preferences, device management and Telugu/English toggle.",
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

      <MultiChannelAlertsSection />

      <MockAlertCard />

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

function MultiChannelAlertsSection() {
  const { data: prefs, isLoading } = useUserPreferences();
  const updatePrefs = useUpdateUserPreferences();

  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [channels, setChannels] = useState({ sms: true, whatsapp: true, email: true });

  useEffect(() => {
    if (prefs) {
      setPhone(prefs.phoneNumber ?? "");
      setWhatsapp(prefs.whatsappNumber ?? "");
      setEmail(prefs.email ?? "");
      setChannels(prefs.alertChannels ?? { sms: true, whatsapp: true, email: true });
    }
  }, [prefs]);

  const handleToggleChannel = (channel: "sms" | "whatsapp" | "email", enabled: boolean) => {
    const nextChannels = { ...channels, [channel]: enabled };
    setChannels(nextChannels);
    updatePrefs.mutate(
      { alertChannels: nextChannels },
      {
        onSuccess: () => toast.success("Alert channel updated!"),
        onError: () => toast.error("Failed to update channel preference."),
      },
    );
  };

  const handleSaveContactDetails = (e: React.FormEvent) => {
    e.preventDefault();
    updatePrefs.mutate(
      {
        phoneNumber: phone.trim(),
        whatsappNumber: whatsapp.trim(),
        email: email.trim(),
      },
      {
        onSuccess: () => toast.success("Alert contact details saved successfully!"),
        onError: () => toast.error("Failed to save contact details."),
      },
    );
  };

  return (
    <section className="rounded-3xl border bg-card p-6 shadow-sm">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
          <Radio className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-ink">Multi-Channel Alert Dispatch</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure independent parallel alert channels (SMS via Fast2SMS, WhatsApp via Meta Cloud
            API, and Email via Resend) for instant notifications.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {/* SMS Toggle */}
        <div className="flex items-center justify-between gap-4 rounded-2xl border p-4 bg-background/50">
          <div className="flex items-center gap-3 min-w-0">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <MessageSquare className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium">SMS Alerts (Fast2SMS)</p>
              <p className="text-xs text-muted-foreground">
                Instant SMS for air hazards & device offline events
              </p>
            </div>
          </div>
          <Switch
            checked={channels.sms}
            disabled={isLoading}
            onCheckedChange={(v) => handleToggleChannel("sms", v)}
          />
        </div>

        {/* WhatsApp Toggle */}
        <div className="flex items-center justify-between gap-4 rounded-2xl border p-4 bg-background/50">
          <div className="flex items-center gap-3 min-w-0">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400">
              <MessageCircle className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium">WhatsApp Alerts (Meta Cloud API)</p>
              <p className="text-xs text-muted-foreground">
                Template notification messages delivered to WhatsApp
              </p>
            </div>
          </div>
          <Switch
            checked={channels.whatsapp}
            disabled={isLoading}
            onCheckedChange={(v) => handleToggleChannel("whatsapp", v)}
          />
        </div>

        {/* Email Toggle */}
        <div className="flex items-center justify-between gap-4 rounded-2xl border p-4 bg-background/50">
          <div className="flex items-center gap-3 min-w-0">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <Mail className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium">Email Alerts (Resend)</p>
              <p className="text-xs text-muted-foreground">
                Detailed HTML metrics summary and dashboard action link
              </p>
            </div>
          </div>
          <Switch
            checked={channels.email}
            disabled={isLoading}
            onCheckedChange={(v) => handleToggleChannel("email", v)}
          />
        </div>
      </div>

      {/* Recipient Contact Details Inputs */}
      <form onSubmit={handleSaveContactDetails} className="mt-6 border-t pt-5 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Recipient Contact Numbers & Address
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="smsPhone" className="text-xs">
              SMS Mobile Number (10-digit Indian No.)
            </Label>
            <Input
              id="smsPhone"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsappPhone" className="text-xs">
              WhatsApp Number (with country code)
            </Label>
            <Input
              id="whatsappPhone"
              placeholder="e.g. 919876543210"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="emailAddr" className="text-xs">
            Recipient Email Address
          </Label>
          <Input
            id="emailAddr"
            type="email"
            placeholder="e.g. user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            disabled={updatePrefs.isPending}
            className="rounded-full gap-2 px-6"
          >
            <Save className="h-4 w-4" />
            {updatePrefs.isPending ? "Saving..." : "Save Contact Details"}
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
