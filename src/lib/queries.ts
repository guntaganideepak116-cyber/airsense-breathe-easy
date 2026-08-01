import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { api, cacheReading, cachedReading, type Range } from "@/lib/airsense";

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
