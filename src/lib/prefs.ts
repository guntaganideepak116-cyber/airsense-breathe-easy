/**
 * Locally stored user preferences: monitored city (for the outdoor AQI
 * comparison) and quiet hours (alert suppression window).
 */
import { useCallback, useEffect, useState } from "react";

export type City = { id: string; name: { te: string; en: string }; lat: number; lon: number };

export const CITIES: City[] = [
  { id: "vijayawada", name: { te: "విజయవాడ", en: "Vijayawada" }, lat: 16.5062, lon: 80.648 },
  {
    id: "visakhapatnam",
    name: { te: "విశాఖపట్నం", en: "Visakhapatnam" },
    lat: 17.6868,
    lon: 83.2185,
  },
  { id: "guntur", name: { te: "గుంటూరు", en: "Guntur" }, lat: 16.3067, lon: 80.4365 },
  { id: "tirupati", name: { te: "తిరుపతి", en: "Tirupati" }, lat: 13.6288, lon: 79.4192 },
  { id: "nellore", name: { te: "నెల్లూరు", en: "Nellore" }, lat: 14.4426, lon: 79.9865 },
  { id: "kakinada", name: { te: "కాకినాడ", en: "Kakinada" }, lat: 16.9891, lon: 82.2475 },
  {
    id: "rajahmundry",
    name: { te: "రాజమహేంద్రవరం", en: "Rajahmundry" },
    lat: 17.0005,
    lon: 81.804,
  },
  { id: "kurnool", name: { te: "కర్నూలు", en: "Kurnool" }, lat: 15.8281, lon: 78.0373 },
  { id: "hyderabad", name: { te: "హైదరాబాద్", en: "Hyderabad" }, lat: 17.385, lon: 78.4867 },
  { id: "warangal", name: { te: "వరంగల్", en: "Warangal" }, lat: 17.9689, lon: 79.5941 },
  { id: "karimnagar", name: { te: "కరీంనగర్", en: "Karimnagar" }, lat: 18.4386, lon: 79.1288 },
  { id: "khammam", name: { te: "ఖమ్మం", en: "Khammam" }, lat: 17.2473, lon: 80.1514 },
];

const CITY_KEY = "airsense-city";
const QUIET_KEY = "airsense-quiet-hours";

export function getCityId(): string {
  try {
    return localStorage.getItem(CITY_KEY) ?? CITIES[0]!.id;
  } catch {
    return CITIES[0]!.id;
  }
}

export function cityById(id: string): City {
  return CITIES.find((c) => c.id === id) ?? CITIES[0]!;
}

export function useCity() {
  const [cityId, setCityId] = useState<string>(CITIES[0]!.id);

  useEffect(() => {
    setCityId(getCityId());
  }, []);

  const select = useCallback((id: string) => {
    try {
      localStorage.setItem(CITY_KEY, id);
    } catch {
      /* ignore */
    }
    setCityId(id);
    window.dispatchEvent(new Event("airsense-city-change"));
  }, []);

  useEffect(() => {
    const sync = () => setCityId(getCityId());
    window.addEventListener("airsense-city-change", sync);
    return () => window.removeEventListener("airsense-city-change", sync);
  }, []);

  return { cityId, city: cityById(cityId), select };
}

export type QuietHours = {
  enabled: boolean;
  /** "22:00" */
  start: string;
  /** "06:00" */
  end: string;
  /** Let critical "Poor" alerts through even during quiet hours. */
  allowCritical: boolean;
};

export const DEFAULT_QUIET: QuietHours = {
  enabled: false,
  start: "22:00",
  end: "06:00",
  allowCritical: true,
};

export function getQuietHours(): QuietHours {
  try {
    const raw = localStorage.getItem(QUIET_KEY);
    return raw ? { ...DEFAULT_QUIET, ...(JSON.parse(raw) as Partial<QuietHours>) } : DEFAULT_QUIET;
  } catch {
    return DEFAULT_QUIET;
  }
}

export function setQuietHours(value: QuietHours) {
  try {
    localStorage.setItem(QUIET_KEY, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

/** True when `date` falls inside the configured quiet window (handles overnight ranges). */
export function inQuietWindow(q: QuietHours, date = new Date()) {
  if (!q.enabled) return false;
  const now = date.getHours() * 60 + date.getMinutes();
  const start = toMinutes(q.start);
  const end = toMinutes(q.end);
  return start <= end ? now >= start && now < end : now >= start || now < end;
}

/** Decides whether an alert of this severity should actually be delivered now. */
export function alertAllowed(critical: boolean, date = new Date()) {
  const q = getQuietHours();
  if (!inQuietWindow(q, date)) return true;
  return critical && q.allowCritical;
}

export function useQuietHours() {
  const [quiet, setQuiet] = useState<QuietHours>(DEFAULT_QUIET);

  useEffect(() => {
    setQuiet(getQuietHours());
  }, []);

  const update = useCallback((patch: Partial<QuietHours>) => {
    setQuiet((prev) => {
      const next = { ...prev, ...patch };
      setQuietHours(next);
      return next;
    });
  }, []);

  return { quiet, update };
}
