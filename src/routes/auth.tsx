import { SignIn, SignUp } from "@clerk/clerk-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Wind } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LangToggle } from "@/components/LangToggle";
import { BreathingOrb } from "@/components/BreathingOrb";

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
  const [mode] = useState<"signin" | "signup">("signin");

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
          <div className="w-full max-w-sm flex justify-center">
            {mode === "signin" ? (
              <SignIn routing="hash" signUpUrl="/auth#signup" fallbackRedirectUrl="/dashboard" />
            ) : (
              <SignUp routing="hash" signInUrl="/auth" fallbackRedirectUrl="/dashboard" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
