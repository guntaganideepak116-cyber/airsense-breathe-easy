/**
 * AirSense data layer.
 *
 * The backend will expose:
 *   GET   /api/device/latest, /api/device/stream, /api/device/history?range=
 *   GET   /api/devices, POST /api/devices, PATCH /api/devices/:id
 *   POST  /api/push/subscribe, /api/push/unsubscribe
 *
 * Until those exist, every call falls back to a deterministic local simulation
 * so the UI is fully exercisable. Swap `USE_MOCK` off once the API is live.
 */

export type AirStatus = "good" | "moderate" | "poor";
export type Range = "24h" | "7d" | "30d";

export type Device = {
  id: string;
  name: string;
  online: boolean;
  lastSeen?: string;
};

export type DeviceCredentials = { device: Device; apiKey: string };

export type Reading = {
  deviceId: string;
  status: AirStatus;
  mq135: number;
  temperature: number;
  humidity: number;
  timestamp: string;
  buzzerActive: boolean;
  lastPoorAt: string | null;
  /** Diagnostics, present when the firmware reports them. */
  rssi?: number;
  uptimeSec?: number;
  firmware?: string;
};

export type HistoryPoint = {
  t: string;
  mq135: number;
  temperature: number;
  humidity: number;
  status: AirStatus;
};

const USE_MOCK = false;
const STORE_KEY = "airsense-devices";

export function classify(mq135: number): AirStatus {
  if (mq135 < 400) return "good";
  if (mq135 < 700) return "moderate";
  return "poor";
}

const DEFAULT_DEVICES: Device[] = [
  { id: "dev-4b", name: "Classroom 4B", online: true },
  { id: "dev-deepak", name: "Deepak's Room", online: true },
  { id: "dev-hostel", name: "Hostel Common Room", online: false },
];

function readStore(): Device[] {
  if (typeof window === "undefined") return DEFAULT_DEVICES;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw) as Device[];
  } catch {
    /* ignore */
  }
  return DEFAULT_DEVICES;
}

function writeStore(devices: Device[]) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(devices));
  } catch {
    /* ignore */
  }
}

// deterministic pseudo-random so SSR and client agree per bucket
function noise(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function baseFor(deviceId: string) {
  return deviceId.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 120;
}

/** Diurnal curve: worse in the late afternoon (traffic + crop burning). */
function mq135At(deviceId: string, date: Date, bucket: number) {
  const hour = date.getHours() + date.getMinutes() / 60;
  const evening = Math.exp(-Math.pow(hour - 17, 2) / 6) * 380;
  const morning = Math.exp(-Math.pow(hour - 8, 2) / 8) * 180;
  const base = 280 + baseFor(deviceId);
  return Math.round(base + evening + morning + noise(bucket + baseFor(deviceId)) * 120 - 40);
}

function latestMock(deviceId: string): Reading {
  const now = new Date();
  const bucket = Math.floor(now.getTime() / 15000);
  const mq135 = mq135At(deviceId, now, bucket);
  const status = classify(mq135);
  const lastPoor = new Date(now.getTime() - (2 + noise(bucket) * 20) * 3600_000);
  return {
    deviceId,
    status,
    mq135,
    temperature: Math.round((28 + noise(bucket + 1) * 6) * 10) / 10,
    humidity: Math.round(42 + noise(bucket + 2) * 30),
    timestamp: now.toISOString(),
    buzzerActive: status === "poor",
    lastPoorAt: lastPoor.toISOString(),
    rssi: -Math.round(42 + noise(bucket + 5) * 38),
    uptimeSec: Math.round((6 + baseFor(deviceId)) * 3600),
    firmware: "1.4.2",
  };
}

function historyMock(deviceId: string, range: Range): HistoryPoint[] {
  const cfg = {
    "24h": { points: 48, stepMs: 30 * 60_000 },
    "7d": { points: 84, stepMs: 2 * 3600_000 },
    "30d": { points: 90, stepMs: 8 * 3600_000 },
  }[range];
  const end = Date.now();
  return Array.from({ length: cfg.points }, (_, i) => {
    const d = new Date(end - (cfg.points - 1 - i) * cfg.stepMs);
    const bucket = Math.floor(d.getTime() / cfg.stepMs);
    const mq135 = mq135At(deviceId, d, bucket);
    return {
      t: d.toISOString(),
      mq135,
      temperature: Math.round((27 + noise(bucket + 3) * 8) * 10) / 10,
      humidity: Math.round(40 + noise(bucket + 4) * 32),
      status: classify(mq135),
    };
  });
}

export const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env["VITE_API_URL"] || import.meta.env["NEXT_PUBLIC_API_URL"]
    : undefined) || "http://localhost:5000";

export function resolveUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = API_BASE_URL.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

async function tryFetch<T>(url: string, init?: RequestInit): Promise<T | null> {
  if (USE_MOCK) return null;
  try {
    const fullUrl = resolveUrl(url);
    const res = await fetch(fullUrl, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export const api = {
  async devices(): Promise<Device[]> {
    return (await tryFetch<Device[]>("/api/devices")) ?? readStore();
  },
  /**
   * Registers a device. The server mints the deviceId + apiKey; the key is
   * returned once here and never persisted, so the UI must show it immediately.
   */
  async createDevice(name: string): Promise<DeviceCredentials> {
    let created: (Device & { apiKey?: string }) | null = null;
    try {
      const res = await fetch(resolveUrl("/api/devices"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) created = (await res.json()) as Device & { apiKey: string };
    } catch {
      created = null;
    }

    const apiKey = created?.apiKey ?? `ask_local_${Math.random().toString(16).slice(2, 14)}`;
    const device: Device = {
      id: created?.id ?? `dev-${Date.now()}`,
      name,
      online: false,
    };

    writeStore([...readStore(), device]);
    return { device, apiKey };
  },

  async updateDevice(id: string, patch: Partial<Device>): Promise<Device[]> {
    await tryFetch<Device>(`/api/devices/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
    const next = readStore().map((d) => (d.id === id ? { ...d, ...patch } : d));
    writeStore(next);
    return next;
  },
  async removeDevice(id: string): Promise<Device[]> {
    await tryFetch(`/api/devices/${id}`, { method: "DELETE" });
    const next = readStore().filter((d) => d.id !== id);
    writeStore(next);
    return next;
  },
  async latest(deviceId: string): Promise<Reading> {
    return (
      (await tryFetch<Reading>(`/api/device/latest?deviceId=${deviceId}`)) ?? latestMock(deviceId)
    );
  },
  async history(deviceId: string, range: Range): Promise<HistoryPoint[]> {
    return (
      (await tryFetch<HistoryPoint[]>(`/api/device/history?range=${range}&deviceId=${deviceId}`)) ??
      historyMock(deviceId, range)
    );
  },
  async subscribePush(subscription: unknown) {
    await tryFetch("/api/push/subscribe", { method: "POST", body: JSON.stringify(subscription) });
  },
  async unsubscribePush() {
    await tryFetch("/api/push/unsubscribe", { method: "POST" });
  },
};

export const CACHE_KEY = "airsense-last-reading";

export function cacheReading(r: Reading) {
  try {
    localStorage.setItem(`${CACHE_KEY}-${r.deviceId}`, JSON.stringify(r));
  } catch {
    /* ignore */
  }
}

export function cachedReading(deviceId: string): Reading | null {
  try {
    const raw = localStorage.getItem(`${CACHE_KEY}-${deviceId}`);
    return raw ? (JSON.parse(raw) as Reading) : null;
  } catch {
    return null;
  }
}
