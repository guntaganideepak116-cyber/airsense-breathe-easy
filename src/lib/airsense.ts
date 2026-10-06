/**
 * AirSense Production Data Layer.
 *
 * Interacts exclusively with real backend API routes backed by MongoDB.
 * All fake mocks, hardcoded rooms, and random generators have been completely removed.
 */

export type AirStatus = "good" | "moderate" | "poor";
export type Range = "24h" | "7d" | "30d";

export type Device = {
  id: string;
  name: string;
  online: boolean;
  status?: "online" | "offline" | "never_connected";
  lastSeen?: string | null;
  createdAt?: string;
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
  lastPoorAt?: string | null;
  online?: boolean;
  /** Wi-Fi signal strength in dBm (optional, sent by firmware) */
  rssi?: number | null;
  /** Device uptime in seconds (optional, sent by firmware) */
  uptimeSec?: number;
  /** Firmware version string (optional, sent by firmware) */
  firmware?: string | null;
};

export type HistoryPoint = {
  t: string;
  mq135: number;
  temperature: number;
  humidity: number;
  status: AirStatus;
};

export type UserAlertPreferences = {
  phoneNumber?: string;
  whatsappNumber?: string;
  email?: string;
  alertChannels: {
    sms: boolean;
    whatsapp: boolean;
    email: boolean;
  };
  threshold?: number;
};

export function classify(mq135: number): AirStatus {
  if (mq135 < 400) return "good";
  if (mq135 < 700) return "moderate";
  return "poor";
}

export const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env["VITE_API_URL"] || import.meta.env["NEXT_PUBLIC_API_URL"]
    : undefined) || "";

export function resolveUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = API_BASE_URL.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

let tokenGetter: (() => Promise<string | null>) | null = null;

export function setAuthTokenGetter(getter: () => Promise<string | null>) {
  tokenGetter = getter;
}

async function tryFetch<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const fullUrl = resolveUrl(url);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(init?.headers as Record<string, string>),
    };

    // Attach Clerk bearer token if available
    if (!headers["Authorization"] && !headers["authorization"]) {
      let token: string | null = null;
      if (tokenGetter) {
        token = await tokenGetter();
      } else if (
        typeof window !== "undefined" &&
        (window as Window & { Clerk?: { session?: { getToken: () => Promise<string> } } }).Clerk
          ?.session
      ) {
        token = await (
          window as Window & { Clerk?: { session?: { getToken: () => Promise<string> } } }
        ).Clerk!.session!.getToken();
      }
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const res = await fetch(fullUrl, {
      ...init,
      headers,
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export const api = {
  async devices(): Promise<Device[]> {
    const res = await tryFetch<Device[]>("/api/devices");
    return res ?? [];
  },

  /**
   * Registers a device in MongoDB. Returns deviceId + apiKey once.
   */
  async createDevice(name: string): Promise<DeviceCredentials> {
    const res = await tryFetch<Device & { apiKey: string }>("/api/devices", {
      method: "POST",
      body: JSON.stringify({ name }),
    });

    if (!res) {
      throw new Error("Failed to register device with backend");
    }

    const { apiKey, ...device } = res;
    return { device, apiKey };
  },

  async updateDevice(id: string, patch: Partial<Device>): Promise<void> {
    await tryFetch(`/api/devices/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
  },

  async removeDevice(id: string): Promise<void> {
    await tryFetch(`/api/devices/${id}`, {
      method: "DELETE",
    });
  },

  async latest(deviceId: string): Promise<Reading | null> {
    return await tryFetch<Reading>(`/api/device/latest?deviceId=${encodeURIComponent(deviceId)}`);
  },

  async history(deviceId: string, range: Range): Promise<HistoryPoint[]> {
    const res = await tryFetch<HistoryPoint[]>(
      `/api/device/history?range=${range}&deviceId=${encodeURIComponent(deviceId)}`,
    );
    return res ?? [];
  },

  async subscribePush(subscription: unknown) {
    await tryFetch("/api/push/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
    });
  },

  async unsubscribePush() {
    await tryFetch("/api/push/subscribe", {
      method: "DELETE",
    });
  },

  async getAlertPreferences(): Promise<UserAlertPreferences> {
    const res = await tryFetch<UserAlertPreferences>("/api/user/alert-preferences");
    return (
      res ?? {
        phoneNumber: "",
        whatsappNumber: "",
        email: "",
        alertChannels: { sms: true, whatsapp: true, email: true },
        threshold: 700,
      }
    );
  },

  async updateAlertPreferences(
    patch: Partial<UserAlertPreferences>,
  ): Promise<UserAlertPreferences> {
    const res = await tryFetch<UserAlertPreferences>("/api/user/alert-preferences", {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    return (
      res ?? {
        phoneNumber: patch.phoneNumber ?? "",
        whatsappNumber: patch.whatsappNumber ?? "",
        email: patch.email ?? "",
        alertChannels: patch.alertChannels ?? { sms: true, whatsapp: true, email: true },
        threshold: patch.threshold ?? 700,
      }
    );
  },
};

export const CACHE_KEY = "airsense-last-reading";

export function cacheReading(r: Reading) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${CACHE_KEY}-${r.deviceId}`, JSON.stringify(r));
  } catch {
    /* ignore */
  }
}

export function cachedReading(deviceId: string): Reading | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${CACHE_KEY}-${deviceId}`);
    return raw ? (JSON.parse(raw) as Reading) : null;
  } catch {
    return null;
  }
}
