import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/weather")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const lat = url.searchParams.get("lat") || "16.5062";
        const lon = url.searchParams.get("lon") || "80.6480";

        try {
          // 1. Fetch real weather data
          const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Asia%2FKolkata`;
          const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10&timezone=Asia%2FKolkata`;

          const [weatherRes, aqiRes] = await Promise.all([
            fetch(weatherUrl, { headers: { "User-Agent": "AirSense-App" } }),
            fetch(aqiUrl, { headers: { "User-Agent": "AirSense-App" } }),
          ]);

          if (!weatherRes.ok || !aqiRes.ok) {
            return new Response(JSON.stringify({ error: "Weather provider service unavailable" }), {
              status: 503,
              headers: { "Content-Type": "application/json" },
            });
          }

          const weatherData = await weatherRes.json();
          const aqiData = await aqiRes.json();

          const temp = weatherData.current?.temperature_2m ?? null;
          const humidity = weatherData.current?.relative_humidity_2m ?? null;
          const windSpeed = weatherData.current?.wind_speed_10m ?? null;
          const weatherCode = weatherData.current?.weather_code ?? 0;

          const aqi = aqiData.current?.us_aqi ?? null;
          const pm25 = aqiData.current?.pm2_5 ?? null;
          const pm10 = aqiData.current?.pm10 ?? null;

          const aqiStatus =
            aqi != null ? (aqi <= 50 ? "good" : aqi <= 100 ? "moderate" : "poor") : "good";

          return Response.json({
            weather: {
              temperature: temp,
              humidity,
              windSpeed,
              weatherCode,
            },
            airQuality: {
              aqi,
              pm25,
              pm10,
              status: aqiStatus,
            },
            station: "Open-Meteo AP/Telangana Meteorological & Air Station",
            fetchedAt: new Date().toISOString(),
          });
        } catch (err: unknown) {
          return new Response(
            JSON.stringify({
              error: "Failed to connect to weather API",
              details: err instanceof Error ? err.message : String(err),
            }),
            {
              status: 502,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      },
    },
  },
});
