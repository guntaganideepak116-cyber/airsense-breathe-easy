import { SignIn, SignUp } from "@clerk/clerk-react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";
import { Thermometer, Droplets, Wind, Activity, CheckCircle2, Wifi } from "lucide-react";
import { LangToggle } from "@/components/LangToggle";
import { cn } from "@/lib/utils";

type AuthSearch = {
  mode?: "signin" | "signup" | undefined;
};

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({
    mode:
      search["mode"] === "signup" ? "signup" : search["mode"] === "signin" ? "signin" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — AirSense" },
      {
        name: "description",
        content: "Sign in to AirSense to see live indoor air quality for every room you monitor.",
      },
      { property: "og:title", content: "Sign in — AirSense" },
      {
        property: "og:description",
        content: "Access your AirSense rooms, live readings and alerts.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

/** Shared Clerk component appearance config */
const clerkAppearance = {
  variables: {
    colorPrimary: "#22d3ee",
    colorBackground: "rgba(10,20,28,0)",
    colorText: "#f1f5f9",
    colorTextSecondary: "#94a3b8",
    colorInputBackground: "rgba(255,255,255,0.06)",
    colorInputText: "#f1f5f9",
    borderRadius: "10px",
    colorNeutral: "#64748b",
  },
  elements: {
    rootBox: "w-full",
    card: "bg-transparent shadow-none border-0 p-0 w-full",
    header: "hidden",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    socialButtonsBlockButton:
      "border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all duration-200 rounded-xl h-9.5 text-xs font-medium",
    socialButtonsBlockButtonText: "text-xs font-medium",
    dividerRow: "my-2.5",
    dividerText: "text-white/30 text-[11px]",
    dividerLine: "bg-white/10",
    formFieldLabel: "text-[11px] font-medium text-white/60 mb-0.5",
    formFieldInput:
      "bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-xl h-9.5 px-3 text-xs focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all",
    formButtonPrimary:
      "bg-linear-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-bold rounded-xl h-9.5 text-xs transition-all duration-200 shadow-lg shadow-cyan-500/20 mt-1",
    footerAction: "mt-2 flex justify-center",
    footerActionText: "text-white/40 text-[11px]",
    footerActionLink: "text-cyan-400 hover:text-cyan-300 font-semibold text-[11px] ml-1",
    identityPreviewText: "text-white/70 text-xs",
    identityPreviewEditButton: "text-cyan-400 text-xs",
    formResendCodeLink: "text-cyan-400 text-xs",
    alert: "rounded-xl border border-red-500/20 bg-red-500/10 p-2 my-1.5",
    alertText: "text-red-400 text-xs",
  },
};

/** Floating radar ring animation behind the monitoring preview */
function RadarRings() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute rounded-full border border-cyan-400/10 animate-ping"
          style={{
            width: `${i * 28}%`,
            height: `${i * 28}%`,
            animationDuration: `${3 + i * 0.7}s`,
          }}
        />
      ))}
    </div>
  );
}

/** Mini sensor reading tile */
function SensorTile({
  icon,
  label,
  value,
  unit,
  color = "text-primary",
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-white/5 p-2 border border-white/5">
      <span className={color}>{icon}</span>
      <div>
        <p className="text-[9px] text-white/40">{label}</p>
        <p className="text-xs font-semibold text-white">
          {value}
          {unit && <span className="text-[9px] text-white/50 ml-0.5">{unit}</span>}
        </p>
      </div>
    </div>
  );
}

/** Interactive Air Quality Live Preview widget */
function MonitoringPreview() {
  return (
    <div className="relative w-full max-w-sm">
      {/* Background radar rings */}
      <div className="absolute -inset-10 pointer-events-none">
        <RadarRings />
      </div>

      {/* Main floating card */}
      <div className="bg-slate-900/75 border border-cyan-400/15 backdrop-blur-xl relative overflow-hidden rounded-2xl p-3.5 sm:p-4 shadow-2xl">
        {/* Cyan glow bleed inside card */}
        <div className="pointer-events-none absolute -top-6 right-4 h-16 w-16 rounded-full bg-cyan-400/20 blur-xl" />
        <div className="pointer-events-none absolute bottom-0 left-6 h-14 w-14 rounded-full bg-emerald-400/15 blur-lg" />

        {/* Card header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-widest text-white/40">
              Air Quality
            </p>
            <p className="mt-0.5 text-lg font-bold text-emerald-400">Good</p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
            <Wifi className="h-3 w-3" />
            Live
          </span>
        </div>

        {/* AQI Big number */}
        <div className="mt-2.5 flex items-end gap-2">
          <p className="font-mono text-3xl sm:text-4xl font-black leading-none text-white">92</p>
          <div className="mb-0.5">
            <p className="text-[10px] font-medium text-white/40">AQI Score</p>
            <p className="text-[9px] text-emerald-400">MQ-135 Sensor</p>
          </div>
        </div>

        {/* Mini AQI bar */}
        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-linear-to-r from-emerald-400 to-cyan-400"
            style={{ width: "30%" }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[9px] text-white/30">
          <span>Good</span>
          <span>Moderate</span>
          <span>Poor</span>
        </div>

        {/* Sensor tiles */}
        <div className="mt-2.5 grid grid-cols-2 gap-2">
          <SensorTile
            icon={<Thermometer className="h-3.5 w-3.5" />}
            label="Temperature"
            value="28"
            unit="°C"
            color="text-orange-400"
          />
          <SensorTile
            icon={<Droplets className="h-3.5 w-3.5" />}
            label="Humidity"
            value="61"
            unit="%"
            color="text-cyan-400"
          />
        </div>

        {/* Room label */}
        <div className="mt-2.5 flex items-center gap-1.5 border-t border-white/5 pt-2">
          <Activity className="h-3 w-3 text-white/30" />
          <p className="text-[10px] text-white/40">Classroom 4B · Live stream</p>
        </div>
      </div>
    </div>
  );
}

function AuthPage() {
  const search = useSearch({ from: "/auth" });
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash.includes("signup")) {
      setMode("signup");
    } else if (search.mode === "signup") {
      setMode("signup");
    }

    const handleHashChange = () => {
      if (typeof window !== "undefined") {
        setMode(window.location.hash.includes("signup") ? "signup" : "signin");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [search.mode]);

  const toggleMode = (newMode: "signin" | "signup") => {
    setMode(newMode);
    if (typeof window !== "undefined") {
      window.location.hash = newMode === "signup" ? "#signup" : "#signin";
    }
  };

  return (
    <div className="bg-slate-950 min-h-dvh flex flex-col relative overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-20 -left-10 w-96 h-96 sm:w-125 sm:h-125 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-5 right-1/4 w-80 h-80 sm:w-100 sm:h-100 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-10 w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-cyan-400/10 blur-3xl" />

      {/* Top Header bar with Logo & LangToggle */}
      <header className="w-full max-w-7xl mx-auto px-5 sm:px-8 pt-3 sm:pt-5 flex items-center justify-between z-20 shrink-0">
        <Link to="/" className="inline-flex items-center gap-2.5 text-decoration-none group">
          <span className="grid place-items-center w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-linear-to-br from-cyan-400 to-cyan-600 text-slate-950 shadow-lg shadow-cyan-400/30">
            <Wind className="h-4 sm:h-5 w-4 sm:w-5" />
          </span>
          <span className="font-display text-lg sm:text-xl font-bold text-slate-100 tracking-tight">
            AirSense
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <LangToggle variant="outline" />
        </div>
      </header>

      {/* Main 2-column content container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-5 sm:px-8 py-3 sm:py-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 lg:gap-10 z-10">
        {/* ── LEFT: Brand & monitoring preview ── */}
        <div className="flex-1 flex flex-col justify-center space-y-3 lg:space-y-4 max-w-xl mx-auto lg:mx-0 text-left">
          {/* Headline */}
          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Know Your Air.
              <br />
              <span className="bg-linear-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                Breathe Better.
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-lg">
              Real-time indoor air quality monitoring for healthier homes, classrooms, offices, and
              smart spaces.
            </p>
          </div>

          {/* Feature bullets */}
          <ul className="space-y-1.5 pt-0.5">
            {[
              "Real-time MQ-135 & DHT22 monitoring",
              "Temperature & humidity analytics",
              "Smart air-quality alerts & insights",
            ].map((f) => (
              <li
                key={f}
                className="flex items-center gap-2.5 text-xs sm:text-sm text-white/80 font-medium"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          {/* Monitoring preview */}
          <div className="pt-1">
            <MonitoringPreview />
          </div>
        </div>

        {/* ── RIGHT: Auth card ── */}
        <div className="w-full max-w-96 sm:max-w-md shrink-0 mx-auto lg:mx-0 flex flex-col justify-center py-1 sm:py-2">
          <div className="relative bg-slate-900/90 border border-cyan-400/15 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-2xl overflow-hidden w-full">
            {/* Card inner glow */}
            <div className="pointer-events-none absolute -top-8 left-1/2 h-24 w-40 -translate-x-1/2 rounded-full bg-cyan-500/15 blur-2xl" />

            {/* Auth header */}
            <div className="flex flex-col items-center text-center space-y-1 mb-3">
              <span className="grid place-items-center w-8.5 h-8.5 rounded-xl bg-linear-to-br from-cyan-400/20 to-emerald-400/10 border border-cyan-400/20">
                <Wind className="h-4 w-4 text-cyan-400" />
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {mode === "signin" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="text-xs text-white/60 max-w-65">
                {mode === "signin"
                  ? "Sign in to continue monitoring your indoor air."
                  : "Start monitoring indoor air quality in real time."}
              </p>
            </div>

            {/* Clerk component wrapper */}
            <div className="w-full flex justify-center">
              {mode === "signin" ? (
                <SignIn
                  routing="hash"
                  signUpUrl="#signup"
                  fallbackRedirectUrl="/dashboard"
                  appearance={clerkAppearance}
                />
              ) : (
                <SignUp
                  routing="hash"
                  signInUrl="#signin"
                  fallbackRedirectUrl="/dashboard"
                  appearance={clerkAppearance}
                />
              )}
            </div>

            {/* Direct toggle link fallback */}
            <div className="mt-2.5 pt-2 text-center text-xs text-white/50 border-t border-white/5">
              {mode === "signin" ? (
                <p>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => toggleMode("signup")}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors ml-0.5"
                  >
                    Create an account
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => toggleMode("signin")}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors ml-0.5"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>

            {/* Security note */}
            <p className="text-[10px] text-white/40 text-center mt-2">
              🔒 Your account and device data are securely protected.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
