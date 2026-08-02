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
};

export type HistoryPoint = {
  t: string;
  mq135: number;
  temperature: number;
  humidity: number;
  status: AirStatus;
};

const USE_MOCK = true;
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

async function tryFetch<T>(url: string, init?: RequestInit): Promise<T | null> {
  if (USE_MOCK) return null;
  try {
    const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
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
  async createDevice(name: string): Promise<Device> {
    const created =
      (await tryFetch<Device>("/api/devices", { method: "POST", body: JSON.stringify({ name }) })) ??
      ({ id: `dev-${Date.now()}`, name, online: true } satisfies Device);
    writeStore([...readStore(), created]);
    return created;
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
    return (await tryFetch<Reading>(`/api/device/latest?deviceId=${deviceId}`)) ?? latestMock(deviceId);
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
