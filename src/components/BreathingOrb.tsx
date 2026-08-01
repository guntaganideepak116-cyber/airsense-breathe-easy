import type { AirStatus } from "@/lib/airsense";
import { statusTheme } from "@/lib/status";
import { cn } from "@/lib/utils";

/**
 * The "breathing room" motif: concentric soft rings that expand and contract
 * like a slow breath, tinted by the current air status.
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
  const dim = size === "lg" ? "h-72 w-72 sm:h-96 sm:w-96" : "h-40 w-40";

  return (
    <div className={cn("relative grid place-items-center", dim, className)}>
      <div
        className={cn("absolute inset-0 rounded-full opacity-40 blur-2xl breathe-slow status-transition", theme.soft)}
      />
      <div className={cn("absolute inset-[12%] rounded-full opacity-60 breathe status-transition", theme.soft)} />
      <div
        className="absolute inset-[24%] rounded-full border status-transition"
        style={{ borderColor: theme.hex, opacity: 0.35 }}
      />
      <div
        className="absolute inset-[36%] rounded-full breathe status-transition"
        style={{ background: `color-mix(in oklab, ${theme.hex} 18%, transparent)` }}
      />
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="absolute rounded-full drift"
          style={{
            background: theme.hex,
            opacity: 0.25,
            width: 6 + i * 2,
            height: 6 + i * 2,
            top: `${18 + i * 14}%`,
            left: `${12 + ((i * 23) % 70)}%`,
            animationDelay: `${i * 1.7}s`,
          }}
        />
      ))}
      <div className="relative z-10 text-center">{children}</div>
    </div>
  );
}
