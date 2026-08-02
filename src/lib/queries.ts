import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { api, cacheReading, cachedReading, type Range, type Reading } from "@/lib/airsense";


const SELECTED_KEY = "airsense-selected-device";

export function useDevices() {
  return useQuery({ queryKey: ["devices"], queryFn: api.devices });
}

export function useSelectedDevice() {
  const { data: devices } = useDevices();
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(SELECTED_KEY);
    if (saved) setSelected(saved);
  }, []);

  const id = selected && devices?.some((d) => d.id === selected) ? selected : (devices?.[0]?.id ?? null);

  const select = (deviceId: string) => {
    localStorage.setItem(SELECTED_KEY, deviceId);
    setSelected(deviceId);
  };

  return { devices: devices ?? [], deviceId: id, device: devices?.find((d) => d.id === id) ?? null, select };
}

/** Polls the latest reading; the real backend exposes SSE at /api/device/stream. */
export function useLatest(deviceId: string | null) {
  const query = useQuery({
    queryKey: ["latest", deviceId],
    queryFn: () => api.latest(deviceId!),
    enabled: !!deviceId,
    refetchInterval: 8000,
    placeholderData: (prev) => prev ?? (deviceId ? (cachedReading(deviceId) ?? undefined) : undefined),
  });

  useEffect(() => {
    if (query.data) cacheReading(query.data);
  }, [query.data]);

  return query;
}

export function useHistory(deviceId: string | null, range: Range) {
  return useQuery({
    queryKey: ["history", deviceId, range],
    queryFn: () => api.history(deviceId!, range),
    enabled: !!deviceId,
  });
}

export type StreamStatus = "connecting" | "live" | "reconnecting";

/**
 * Live readings over Server-Sent Events (`/api/device/:id/stream`).
 * Reconnects with exponential backoff and always closes the connection on unmount.
 */
export function useDeviceStream(deviceId: string | null) {
  const qc = useQueryClient();
  const [reading, setReading] = useState<Reading | null>(null);
  const [status, setStatus] = useState<StreamStatus>("connecting");
  const [tick, setTick] = useState(0);
  const attempts = useRef(0);

  useEffect(() => {
    if (!deviceId || typeof window === "undefined" || typeof EventSource === "undefined") return;

    let source: EventSource | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const cached = cachedReading(deviceId);
    if (cached) setReading(cached);

    const connect = () => {
      if (cancelled) return;
      setStatus(attempts.current === 0 ? "connecting" : "reconnecting");
      source = new EventSource(`/api/device/${encodeURIComponent(deviceId)}/stream`);

      source.addEventListener("reading", (event) => {
        try {
          const next = JSON.parse((event as MessageEvent).data) as Reading;
          attempts.current = 0;
          setStatus("live");
          setReading(next);
          setTick((n) => n + 1);
          cacheReading(next);
          qc.setQueryData(["latest", deviceId], next);
        } catch {
          /* ignore malformed frame */
        }
      });

      source.onerror = () => {
        source?.close();
        source = null;
        if (cancelled) return;
        setStatus("reconnecting");
        const delay = Math.min(1000 * 2 ** attempts.current, 15000);
        attempts.current += 1;
        retryTimer = setTimeout(connect, delay);
      };
    };

    connect();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
      source?.close();
    };
  }, [deviceId, qc]);

  return { reading, status, tick };
}

export function useDeviceMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["devices"] });

  return {
    create: useMutation({ mutationFn: (name: string) => api.createDevice(name), onSuccess: invalidate }),
    rename: useMutation({
      mutationFn: ({ id, name }: { id: string; name: string }) => api.updateDevice(id, { name }),
      onSuccess: invalidate,
    }),
    remove: useMutation({ mutationFn: (id: string) => api.removeDevice(id), onSuccess: invalidate }),
  };
}

