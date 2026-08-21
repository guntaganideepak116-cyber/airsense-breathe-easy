import type { AirStatus } from "@/lib/airsense";
import type { TKey } from "@/lib/i18n";

export const statusTheme: Record<
  AirStatus,
  {
    bg: string;
    soft: string;
    text: string;
    ring: string;
    dot: string;
    hex: string;
    label: TKey;
    advice: TKey;
  }
> = {
  good: {
    bg: "bg-good",
    soft: "bg-good-soft",
    text: "text-good",
    ring: "ring-good/30",
    dot: "bg-good",
    hex: "var(--good)",
    label: "status.good",
    advice: "status.good.advice",
  },
  moderate: {
    bg: "bg-moderate",
    soft: "bg-moderate-soft",
    text: "text-moderate",
    ring: "ring-moderate/30",
    dot: "bg-moderate",
    hex: "var(--moderate)",
    label: "status.moderate",
    advice: "status.moderate.advice",
  },
  poor: {
    bg: "bg-poor",
    soft: "bg-poor-soft",
    text: "text-poor",
    ring: "ring-poor/30",
    dot: "bg-poor",
    hex: "var(--poor)",
    label: "status.poor",
    advice: "status.poor.advice",
  },
};

export function formatTime(iso: string, lang: string) {
  return new Date(iso).toLocaleString(lang === "te" ? "te-IN" : "en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "numeric",
    month: "short",
  });
}
