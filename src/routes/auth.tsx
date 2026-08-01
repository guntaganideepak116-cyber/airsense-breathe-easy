import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Wind } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LangToggle } from "@/components/LangToggle";
import { BreathingOrb } from "@/components/BreathingOrb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — AirSense" },
      { name: "description", content: "Sign in to AirSense to see live indoor air quality for every room you monitor." },
      { property: "og:title", content: "Sign in — AirSense" },
      { property: "og:description", content: "Access your AirSense rooms, live readings and alerts." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden place-items-center overflow-hidden bg-card lg:grid">
        <div className="pointer-events-none absolute -left-24 top-10 h-96 w-96 rounded-full bg-sky-soft blur-3xl" />
        <div className="relative text-center">
          <BreathingOrb status="good">
            <p className="font-display text-3xl text-ink">AirSense</p>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">{t("brand.tagline")}</p>
          </BreathingOrb>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Wind className="h-5 w-5" />
            </span>
            <span className="font-display text-lg">AirSense</span>
          </Link>
          <LangToggle />
        </div>

        <div className="flex flex-1 items-center justify-center px-5 pb-16">
          <form
            className="w-full max-w-sm"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/dashboard" });
            }}
          >
            <h1 className="font-display text-3xl text-ink">{t(mode === "signin" ? "auth.signin" : "auth.signup")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t("auth.note")}</p>

            <div className="mt-7 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="id">{t("auth.email")}</Label>
                <Input id="id" required placeholder="you@example.com" className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pw">{t("auth.password")}</Label>
                <Input id="pw" type="password" required className="h-11 rounded-xl" />
              </div>
              <Button type="submit" size="lg" className="w-full rounded-xl">
                {t("auth.continue")}
              </Button>
            </div>

            <button
              type="button"
              className="mt-6 w-full text-sm text-primary hover:underline"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            >
              {t(mode === "signin" ? "auth.toSignup" : "auth.toSignin")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
