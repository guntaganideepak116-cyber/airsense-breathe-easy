/**
 * Outdoor air quality for the user's saved city.
 *
 * Source: Open-Meteo Air Quality API — a free public endpoint that needs no
 * API key. The value is a citywide model estimate, which is exactly the point:
 * comparing it with a room sensor shows how little the two agree.
 */
import { useQuery } from "@tanstack/react-query";
import type { AirStatus } from "@/lib/airsense";
import { useCity, type City } from "@/lib/prefs";

export type OutdoorReading = {
  aqi: number;
  pm25: number | null;
  pm10: number | null;
  status: AirStatus;
  city: City;
  fetchedAt: string;
};

/** US AQI bands folded into the three states AirSense speaks. */
export function classifyAqi(aqi: number): AirStatus {
  if (aqi <= 50) return "good";
  if (aqi <= 100) return "moderate";
  return "poor";
}

async function fetchOutdoor(city: City): Promise<OutdoorReading> {
  const url =
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.lat}&longitude=${city.lon}` +
    `&current=us_aqi,pm2_5,pm10&timezone=Asia%2FKolkata`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("outdoor-aqi-unavailable");
  const json = (await res.json()) as {
    current?: { us_aqi?: number; pm2_5?: number; pm10?: number };
  };
  const aqi = json.current?.us_aqi;
  if (typeof aqi !== "number") throw new Error("outdoor-aqi-missing");
  return {
    aqi: Math.round(aqi),
    pm25: json.current?.pm2_5 ?? null,
    pm10: json.current?.pm10 ?? null,
    status: classifyAqi(aqi),
    city,
    fetchedAt: new Date().toISOString(),
  };
}

/** Outdoor AQI for the saved city, refreshed every 15 minutes. */
export function useOutdoorAqi() {
  const { city } = useCity();
  const query = useQuery({
    queryKey: ["outdoor", city.id],
    queryFn: () => fetchOutdoor(city),
    staleTime: 15 * 60_000,
    refetchInterval: 15 * 60_000,
    retry: 1,
  });
  return { ...query, city };
}
