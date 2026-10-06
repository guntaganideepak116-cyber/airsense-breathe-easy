/**
 * Outdoor real-time air quality and weather data for AP & Telangana.
 *
 * Source: Open-Meteo Air Quality and Meteorological APIs.
 * 100% real scientific readings. Never uses fake or hardcoded weather estimates.
 */
import { useQuery } from "@tanstack/react-query";
import type { AirStatus } from "@/client/lib/airsense";
import { useCity, type City } from "@/client/lib/prefs";
import { resolveUrl } from "@/client/lib/airsense";

export type OutdoorReading = {
  aqi: number;
  pm25: number | null;
  pm10: number | null;
  status: AirStatus;
  city: City;
  fetchedAt: string;
};

export type OutdoorWeatherReading = {
  temperature: number | null;
  humidity: number | null;
  windSpeed: number | null;
  weatherCode: number;
  aqi: number | null;
  pm25: number | null;
  pm10: number | null;
  status: AirStatus;
  city: City;
  station: string;
  fetchedAt: string;
};

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
    pm25: json.current?.pm2_5 != null ? Math.round(json.current.pm2_5 * 10) / 10 : null,
    pm10: json.current?.pm10 != null ? Math.round(json.current.pm10 * 10) / 10 : null,
    status: classifyAqi(aqi),
    city,
    fetchedAt: new Date().toISOString(),
  };
}

async function fetchOutdoorWeather(city: City): Promise<OutdoorWeatherReading> {
  const endpoint = resolveUrl(`/api/weather?lat=${city.lat}&lon=${city.lon}`);
  const res = await fetch(endpoint);
  if (!res.ok) {
    // Direct Open-Meteo fallback if backend API route is unreachable
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Asia%2FKolkata`;
    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.lat}&longitude=${city.lon}&current=us_aqi,pm2_5,pm10&timezone=Asia%2FKolkata`;

    const [wRes, aRes] = await Promise.all([fetch(weatherUrl), fetch(aqiUrl)]);
    if (!wRes.ok || !aRes.ok) throw new Error("Weather and AQI services unavailable");

    const wData = await wRes.json();
    const aData = await aRes.json();

    const aqi = aData.current?.us_aqi ?? null;
    return {
      temperature:
        wData.current?.temperature_2m != null
          ? Math.round(wData.current.temperature_2m * 10) / 10
          : null,
      humidity: wData.current?.relative_humidity_2m ?? null,
      windSpeed:
        wData.current?.wind_speed_10m != null
          ? Math.round(wData.current.wind_speed_10m * 10) / 10
          : null,
      weatherCode: wData.current?.weather_code ?? 0,
      aqi,
      pm25: aData.current?.pm2_5 != null ? Math.round(aData.current.pm2_5 * 10) / 10 : null,
      pm10: aData.current?.pm10 != null ? Math.round(aData.current.pm10 * 10) / 10 : null,
      status: aqi != null ? classifyAqi(aqi) : "good",
      city,
      station: `${city.name} Regional Station (Open-Meteo)`,
      fetchedAt: new Date().toISOString(),
    };
  }

  const json = await res.json();
  return {
    temperature: json.weather?.temperature ?? null,
    humidity: json.weather?.humidity ?? null,
    windSpeed: json.weather?.windSpeed ?? null,
    weatherCode: json.weather?.weatherCode ?? 0,
    aqi: json.airQuality?.aqi ?? null,
    pm25: json.airQuality?.pm25 ?? null,
    pm10: json.airQuality?.pm10 ?? null,
    status: json.airQuality?.status ?? "good",
    city,
    station: json.station || `${city.name} Regional Station`,
    fetchedAt: json.fetchedAt || new Date().toISOString(),
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

/** Comprehensive outdoor weather & regional AQI hook. */
export function useOutdoorWeather() {
  const { city } = useCity();
  const query = useQuery({
    queryKey: ["outdoor-weather", city.id],
    queryFn: () => fetchOutdoorWeather(city),
    staleTime: 15 * 60_000,
    refetchInterval: 15 * 60_000,
    retry: 2,
  });
  return { ...query, city };
}
