import { SignIn, SignUp } from "@clerk/clerk-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Thermometer, Droplets, Wind, Activity, CheckCircle2, Wifi } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LangToggle } from "@/components/LangToggle";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
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

/** Floating radar ring animation behind the monitoring preview */
function RadarRings() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="absolute rounded-full border"
          style={{
            width: `${i * 22}%`,
            height: `${i * 22}%`,
            borderColor: "rgba(103,232,249,0.12)",
            animation: `radar-pulse ${3 + i * 0.7}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
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
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
}) {
  return (
    <div className="auth-glass-inner flex items-center gap-3 rounded-2xl px-4 py-3">
      <span className={cn("shrink-0", color)}>{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-widest text-white/40">{label}</p>
        <p className={cn("font-mono text-sm font-bold leading-tight tabular-nums", color)}>
          {value}
          {unit && <span className="ml-0.5 text-xs font-normal text-white/50">{unit}</span>}
        </p>
      </div>
    </div>
  );
}

/** Floating live monitoring preview card */
function MonitoringPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[320px] animate-auth-float">
      {/* Background radar rings */}
      <div className="absolute -inset-16 pointer-events-none">
        <RadarRings />
      </div>

      {/* Main floating card */}
      <div className="auth-glass relative overflow-hidden rounded-3xl p-6 shadow-2xl">
        {/* Cyan glow bleed inside card */}
        <div className="pointer-events-none absolute -top-6 right-4 h-20 w-20 rounded-full bg-cyan-400/20 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-8 h-16 w-16 rounded-full bg-emerald-400/15 blur-xl" />

        {/* Card header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
              Air Quality
            </p>
            <p className="mt-0.5 text-2xl font-bold text-emerald-400">Good</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-semibold text-emerald-400">
              <Wifi className="h-3 w-3" />
              Live
            </span>
          </div>
        </div>

        {/* AQI Big number */}
        <div className="mt-5 flex items-end gap-2">
          <p className="font-mono text-6xl font-black leading-none text-white">92</p>
          <div className="mb-1">
            <p className="text-xs font-medium text-white/40">AQI Score</p>
            <p className="text-[10px] text-emerald-400">MQ-135 Sensor</p>
          </div>
        </div>

        {/* Mini AQI bar */}
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
            style={{ width: "30%" }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-white/30">
          <span>Good</span>
          <span>Moderate</span>
          <span>Poor</span>
        </div>

        {/* Sensor tiles */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <SensorTile
            icon={<Thermometer className="h-4 w-4" />}
            label="Temperature"
            value="28"
            unit="°C"
            color="text-orange-400"
          />
          <SensorTile
            icon={<Droplets className="h-4 w-4" />}
            label="Humidity"
            value="61"
            unit="%"
            color="text-cyan-400"
          />
        </div>

        {/* Classroom label */}
        <div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-3.5">
          <Activity className="h-3.5 w-3.5 text-white/30" />
          <p className="text-[11px] text-white/40">Classroom 4B · Last updated just now</p>
        </div>
      </div>
    </div>
  );
}

function AuthPage() {
  const [mode] = useState<"signin" | "signup">("signin");

  return (
    <div className="auth-root">
      {/* Ambient background glows */}
      <div className="auth-glow-1" />
      <div className="auth-glow-2" />
      <div className="auth-glow-3" />

      {/* Language toggle — top right, always visible */}
      <div className="auth-lang-btn">
        <LangToggle variant="outline" />
      </div>

      {/* ── DESKTOP: 2-column grid ── */}
      <div className="auth-layout">
        {/* ── LEFT: Brand & monitoring preview ── */}
        <div className="auth-left">
          {/* Logo */}
          <Link to="/" className="auth-logo group">
            <span className="auth-logo-icon">
              <Wind className="h-5 w-5" />
            </span>
            <span className="auth-logo-text">AirSense</span>
          </Link>

          {/* Headline */}
          <div className="auth-headline">
            <h1 className="auth-h1">
              Know Your Air.
              <br />
              <span className="auth-h1-accent">Breathe Better.</span>
            </h1>
            <p className="auth-sub">
              Real-time indoor air quality monitoring for healthier homes, classrooms, offices, and
              smart spaces.
            </p>
          </div>

          {/* Feature bullets */}
          <ul className="auth-features">
            {[
              "Real-time MQ-135 & DHT22 monitoring",
              "Temperature & humidity analytics",
              "Smart air-quality alerts & insights",
            ].map((f) => (
              <li key={f} className="auth-feature-item">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          {/* Monitoring preview */}
          <div className="auth-preview">
            <MonitoringPreview />
          </div>
        </div>

        {/* ── RIGHT: Auth card ── */}
        <div className="auth-right">
          <div className="auth-card">
            {/* Card inner glow */}
            <div className="pointer-events-none absolute -top-8 left-1/2 h-24 w-40 -translate-x-1/2 rounded-full bg-cyan-500/15 blur-2xl" />

            {/* Auth header */}
            <div className="auth-card-header">
              <span className="auth-card-icon">
                <Wind className="h-5 w-5 text-cyan-400" />
              </span>
              <h2 className="auth-card-title">Welcome back</h2>
              <p className="auth-card-sub">Sign in to continue monitoring your indoor air.</p>
            </div>

            {/* Clerk component — fully functional */}
            <div className="auth-clerk-wrap">
              {mode === "signin" ? (
                <SignIn
                  routing="hash"
                  signUpUrl="/auth#signup"
                  fallbackRedirectUrl="/dashboard"
                  appearance={{
                    variables: {
                      colorPrimary: "#22d3ee",
                      colorBackground: "rgba(10,20,28,0)",
                      colorText: "#f1f5f9",
                      colorTextSecondary: "#94a3b8",
                      colorInputBackground: "rgba(255,255,255,0.06)",
                      colorInputText: "#f1f5f9",
                      borderRadius: "12px",
                      colorNeutral: "#64748b",
                    },
                    elements: {
                      rootBox: "w-full",
                      card: "bg-transparent shadow-none border-0 p-0 w-full",
                      header: "hidden",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton:
                        "border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all duration-200 rounded-xl h-12 font-medium",
                      socialButtonsBlockButtonText: "text-sm font-medium",
                      dividerRow: "my-4",
                      dividerText: "text-white/30 text-xs",
                      dividerLine: "bg-white/10",
                      formFieldLabel: "text-xs font-medium text-white/60 mb-1.5",
                      formFieldInput:
                        "bg-white/6 border border-white/10 text-white placeholder:text-white/30 rounded-xl h-12 px-4 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all",
                      formButtonPrimary:
                        "bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-[#071218] font-bold rounded-xl h-12 transition-all duration-200 shadow-lg shadow-cyan-500/20",
                      footerAction: "mt-2",
                      footerActionText: "text-white/40 text-sm",
                      footerActionLink: "text-cyan-400 hover:text-cyan-300 font-semibold",
                      identityPreviewText: "text-white/70",
                      identityPreviewEditButton: "text-cyan-400",
                      formResendCodeLink: "text-cyan-400",
                      alert: "rounded-xl border border-red-500/20 bg-red-500/10",
                      alertText: "text-red-400",
                      internal__clerk_developer_mode_badge: "hidden",
                    },
                  }}
                />
              ) : (
                <SignUp
                  routing="hash"
                  signInUrl="/auth"
                  fallbackRedirectUrl="/dashboard"
                  appearance={{
                    variables: {
                      colorPrimary: "#22d3ee",
                      colorBackground: "rgba(10,20,28,0)",
                      colorText: "#f1f5f9",
                      colorTextSecondary: "#94a3b8",
                      colorInputBackground: "rgba(255,255,255,0.06)",
                      colorInputText: "#f1f5f9",
                      borderRadius: "12px",
                      colorNeutral: "#64748b",
                    },
                    elements: {
                      rootBox: "w-full",
                      card: "bg-transparent shadow-none border-0 p-0 w-full",
                      header: "hidden",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton:
                        "border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all duration-200 rounded-xl h-12 font-medium",
                      formFieldLabel: "text-xs font-medium text-white/60 mb-1.5",
                      formFieldInput:
                        "bg-white/6 border border-white/10 text-white placeholder:text-white/30 rounded-xl h-12 px-4 focus:border-cyan-400",
                      formButtonPrimary:
                        "bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-[#071218] font-bold rounded-xl h-12",
                      footerActionText: "text-white/40 text-sm",
                      footerActionLink: "text-cyan-400 hover:text-cyan-300 font-semibold",
                    },
                  }}
                />
              )}
            </div>

            {/* Security note */}
            <p className="auth-security-note">
              🔒 Your account and device data are securely protected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
