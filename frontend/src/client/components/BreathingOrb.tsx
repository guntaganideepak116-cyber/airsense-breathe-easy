import type { AirStatus } from "@/client/lib/airsense";
import { statusTheme } from "@/shared/lib/status";
import { cn } from "@/client/lib/utils";

/**
 * BreathingOrb: Concentric environmental acoustic rings indicating current room air quality.
 * Lightweight, accessible, and free of random distracting floating particles.
 */
export function BreathingOrb({
  status = "good",
  size = "lg",
  className,
  children,
}: {
  status?: AirStatus;
  size?: "sm" | "lg";
  className?: string;
  children?: React.ReactNode;
}) {
  const theme = statusTheme[status];
  const dim = size === "lg" ? "h-64 w-64 sm:h-80 sm:w-80" : "h-36 w-36";

  return (
    <div className={cn("relative grid place-items-center select-none", dim, className)}>
      {/* Outer ambient glow */}
      <div
        className={cn(
          "absolute inset-0 rounded-full opacity-30 blur-xl breathe-slow status-transition",
          theme.soft,
        )}
      />

      {/* Primary pulsating ring */}
      <div
        className={cn(
          "absolute inset-[10%] rounded-full opacity-50 breathe status-transition",
          theme.soft,
        )}
      />

      {/* High-precision guide ring */}
      <div
        className="absolute inset-[22%] rounded-full border border-dashed status-transition"
        style={{ borderColor: theme.hex, opacity: 0.3 }}
      />

      {/* Inner status core */}
      <div
        className="absolute inset-[32%] rounded-full border status-transition"
        style={{
          borderColor: theme.hex,
          background: `color-mix(in srgb, ${theme.hex} 12%, transparent)`,
          opacity: 0.8,
        }}
      />

      {/* Content slot */}
      <div className="relative z-10 text-center">{children}</div>
    </div>
  );
}
