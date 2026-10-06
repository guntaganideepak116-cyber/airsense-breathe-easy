export async function getLiveWeatherAndAqi(lat: string = "16.5062", lon: string = "80.6480") {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Asia%2FKolkata`;
  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10&timezone=Asia%2FKolkata`;

  const [weatherRes, aqiRes] = await Promise.all([
    fetch(weatherUrl, { headers: { "User-Agent": "AirSense-App" } }),
    fetch(aqiUrl, { headers: { "User-Agent": "AirSense-App" } }),
  ]);

  if (!weatherRes.ok || !aqiRes.ok) {
    throw new Error("Weather provider service unavailable");
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

  return {
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
    station: "Open-Meteo Meteorological & Air Quality Sensor Hub",
    fetchedAt: new Date().toISOString(),
  };
}
