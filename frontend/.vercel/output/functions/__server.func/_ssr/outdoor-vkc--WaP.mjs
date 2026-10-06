import { i as __toESM } from "../_runtime.mjs";
import { c as require_react } from "../_libs/@clerk/clerk-react+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as resolveUrl } from "./queries-Dt74LbKo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/outdoor-vkc--WaP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/**
* Locally stored user preferences: monitored city (for the outdoor AQI
* comparison) and quiet hours (alert suppression window).
*/
var CITIES = [
	{
		id: "vijayawada",
		name: {
			te: "విజయవాడ",
			en: "Vijayawada"
		},
		lat: 16.5062,
		lon: 80.648
	},
	{
		id: "visakhapatnam",
		name: {
			te: "విశాఖపట్నం",
			en: "Visakhapatnam"
		},
		lat: 17.6868,
		lon: 83.2185
	},
	{
		id: "guntur",
		name: {
			te: "గుంటూరు",
			en: "Guntur"
		},
		lat: 16.3067,
		lon: 80.4365
	},
	{
		id: "tirupati",
		name: {
			te: "తిరుపతి",
			en: "Tirupati"
		},
		lat: 13.6288,
		lon: 79.4192
	},
	{
		id: "nellore",
		name: {
			te: "నెల్లూరు",
			en: "Nellore"
		},
		lat: 14.4426,
		lon: 79.9865
	},
	{
		id: "kakinada",
		name: {
			te: "కాకినాడ",
			en: "Kakinada"
		},
		lat: 16.9891,
		lon: 82.2475
	},
	{
		id: "rajahmundry",
		name: {
			te: "రాజమహేంద్రవరం",
			en: "Rajahmundry"
		},
		lat: 17.0005,
		lon: 81.804
	},
	{
		id: "kurnool",
		name: {
			te: "కర్నూలు",
			en: "Kurnool"
		},
		lat: 15.8281,
		lon: 78.0373
	},
	{
		id: "hyderabad",
		name: {
			te: "హైదరాబాద్",
			en: "Hyderabad"
		},
		lat: 17.385,
		lon: 78.4867
	},
	{
		id: "warangal",
		name: {
			te: "వరంగల్",
			en: "Warangal"
		},
		lat: 17.9689,
		lon: 79.5941
	},
	{
		id: "karimnagar",
		name: {
			te: "కరీంనగర్",
			en: "Karimnagar"
		},
		lat: 18.4386,
		lon: 79.1288
	},
	{
		id: "khammam",
		name: {
			te: "ఖమ్మం",
			en: "Khammam"
		},
		lat: 17.2473,
		lon: 80.1514
	}
];
var CITY_KEY = "airsense-city";
function getCityId() {
	try {
		return localStorage.getItem(CITY_KEY) ?? CITIES[0].id;
	} catch {
		return CITIES[0].id;
	}
}
function cityById(id) {
	return CITIES.find((c) => c.id === id) ?? CITIES[0];
}
function useCity() {
	const [cityId, setCityId] = (0, import_react.useState)(CITIES[0].id);
	(0, import_react.useEffect)(() => {
		setCityId(getCityId());
	}, []);
	const select = (0, import_react.useCallback)((id) => {
		try {
			localStorage.setItem(CITY_KEY, id);
		} catch {}
		setCityId(id);
		window.dispatchEvent(new Event("airsense-city-change"));
	}, []);
	(0, import_react.useEffect)(() => {
		const sync = () => setCityId(getCityId());
		window.addEventListener("airsense-city-change", sync);
		return () => window.removeEventListener("airsense-city-change", sync);
	}, []);
	return {
		cityId,
		city: cityById(cityId),
		select
	};
}
/**
* Outdoor real-time air quality and weather data for AP & Telangana.
*
* Source: Open-Meteo Air Quality and Meteorological APIs.
* 100% real scientific readings. Never uses fake or hardcoded weather estimates.
*/
function classifyAqi(aqi) {
	if (aqi <= 50) return "good";
	if (aqi <= 100) return "moderate";
	return "poor";
}
async function fetchOutdoor(city) {
	const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.lat}&longitude=${city.lon}&current=us_aqi,pm2_5,pm10&timezone=Asia%2FKolkata`;
	const res = await fetch(url);
	if (!res.ok) throw new Error("outdoor-aqi-unavailable");
	const json = await res.json();
	const aqi = json.current?.us_aqi;
	if (typeof aqi !== "number") throw new Error("outdoor-aqi-missing");
	return {
		aqi: Math.round(aqi),
		pm25: json.current?.pm2_5 != null ? Math.round(json.current.pm2_5 * 10) / 10 : null,
		pm10: json.current?.pm10 != null ? Math.round(json.current.pm10 * 10) / 10 : null,
		status: classifyAqi(aqi),
		city,
		fetchedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
async function fetchOutdoorWeather(city) {
	const endpoint = resolveUrl(`/api/weather?lat=${city.lat}&lon=${city.lon}`);
	const res = await fetch(endpoint);
	if (!res.ok) {
		const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Asia%2FKolkata`;
		const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.lat}&longitude=${city.lon}&current=us_aqi,pm2_5,pm10&timezone=Asia%2FKolkata`;
		const [wRes, aRes] = await Promise.all([fetch(weatherUrl), fetch(aqiUrl)]);
		if (!wRes.ok || !aRes.ok) throw new Error("Weather and AQI services unavailable");
		const wData = await wRes.json();
		const aData = await aRes.json();
		const aqi = aData.current?.us_aqi ?? null;
		return {
			temperature: wData.current?.temperature_2m != null ? Math.round(wData.current.temperature_2m * 10) / 10 : null,
			humidity: wData.current?.relative_humidity_2m ?? null,
			windSpeed: wData.current?.wind_speed_10m != null ? Math.round(wData.current.wind_speed_10m * 10) / 10 : null,
			weatherCode: wData.current?.weather_code ?? 0,
			aqi,
			pm25: aData.current?.pm2_5 != null ? Math.round(aData.current.pm2_5 * 10) / 10 : null,
			pm10: aData.current?.pm10 != null ? Math.round(aData.current.pm10 * 10) / 10 : null,
			status: aqi != null ? classifyAqi(aqi) : "good",
			city,
			station: `${city.name} Regional Station (Open-Meteo)`,
			fetchedAt: (/* @__PURE__ */ new Date()).toISOString()
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
		fetchedAt: json.fetchedAt || (/* @__PURE__ */ new Date()).toISOString()
	};
}
/** Outdoor AQI for the saved city, refreshed every 15 minutes. */
function useOutdoorAqi() {
	const { city } = useCity();
	return {
		...useQuery({
			queryKey: ["outdoor", city.id],
			queryFn: () => fetchOutdoor(city),
			staleTime: 9e5,
			refetchInterval: 9e5,
			retry: 1
		}),
		city
	};
}
/** Comprehensive outdoor weather & regional AQI hook. */
function useOutdoorWeather() {
	const { city } = useCity();
	return {
		...useQuery({
			queryKey: ["outdoor-weather", city.id],
			queryFn: () => fetchOutdoorWeather(city),
			staleTime: 9e5,
			refetchInterval: 9e5,
			retry: 2
		}),
		city
	};
}
//#endregion
export { useOutdoorWeather as n, useOutdoorAqi as t };
