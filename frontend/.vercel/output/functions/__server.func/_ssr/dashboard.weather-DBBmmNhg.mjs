import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { M as Gauge, P as Droplets, V as CircleAlert, g as Radio, l as Thermometer, n as Wind } from "../_libs/lucide-react.mjs";
import { i as useI18n, r as cn } from "./router-DPkWkbV_.mjs";
import { n as statusTheme, t as formatTime } from "./status-Ba2cWdOL.mjs";
import { d as useLatest, f as useSelectedDevice } from "./queries-Dt74LbKo.mjs";
import { t as Skeleton } from "./skeleton-DQmfXsrD.mjs";
import { t as BreathingOrb } from "./BreathingOrb-9Kiv-YL2.mjs";
import { n as useOutdoorWeather } from "./outdoor-vkc--WaP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.weather-DBBmmNhg.js
var import_jsx_runtime = require_jsx_runtime();
function WeatherPage() {
	const { t, lang } = useI18n();
	const { deviceId, device } = useSelectedDevice();
	const { data: reading, isLoading: isReadingLoading } = useLatest(deviceId);
	const { data: outdoor, isLoading: isOutdoorLoading, isError: isOutdoorError } = useOutdoorWeather();
	const indoorStatus = reading?.status ?? "good";
	const indoorTheme = statusTheme[indoorStatus];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-center justify-between gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl text-ink sm:text-3xl",
					children: t("weather.title")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-sm text-muted-foreground",
					children: device?.name ? `${device.name} · Indoor vs Outdoor Comparison` : "Indoor vs Outdoor Regional Meteorology"
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: cn("status-transition rounded-3xl border p-6 lg:p-8", reading ? indoorTheme.soft : "bg-card"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreathingOrb, {
							status: indoorStatus,
							size: "sm",
							className: "mx-auto h-36! w-36! lg:mx-0"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "h-4 w-4 text-primary animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Indoor Hardware Sensor (MQ-135 + DHT22)" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: cn("mt-1 font-display text-4xl font-bold lg:text-5xl", reading ? indoorTheme.text : "text-foreground"),
								children: reading ? t(indoorTheme.label) : "Waiting for Sensor Data"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-foreground/80",
								children: [
									"Assigned Room:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: device?.name ?? "No room selected"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									t("dash.updated"),
									":",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular-nums font-mono",
										children: reading ? formatTime(reading.timestamp, lang) : "No readings recorded yet"
									})
								]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center justify-center rounded-2xl border bg-card/70 p-4 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs uppercase tracking-widest text-muted-foreground",
									children: "MQ-135 Reading"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 font-display text-3xl font-bold tabular-nums text-primary",
									children: reading?.mq135 ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground",
									children: "Raw Sensor Value"
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3",
				children: "Indoor Hardware Readings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border bg-card p-5 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: [t("dash.temp"), " (Indoor)"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-9 w-9 place-items-center rounded-xl bg-moderate-soft text-moderate",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thermometer, { className: "h-5 w-5" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-display text-3xl font-bold tabular-nums",
								children: reading?.temperature != null ? `${reading.temperature} °C` : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: reading ? "DHT22 Hardware" : "Awaiting hardware packet"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border bg-card p-5 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: [t("dash.humidity"), " (Indoor)"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-9 w-9 place-items-center rounded-xl bg-good-soft text-good",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplets, { className: "h-5 w-5" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-display text-3xl font-bold tabular-nums",
								children: reading?.humidity != null ? `${reading.humidity} %` : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: reading ? "DHT22 Hardware" : "Awaiting hardware packet"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border bg-card p-5 shadow-sm sm:col-span-2 lg:col-span-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Hardware Status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-9 w-9 place-items-center rounded-xl bg-sky-soft text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "h-5 w-5" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-display text-2xl font-bold tabular-nums",
								children: reading?.online ? "Device Online" : "Device Offline"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: reading ? "ESP32 Wi-Fi Transmission" : "Waiting for ESP32 connection"
							})
						]
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground",
					children: "Outdoor Regional Weather & AQI (Open-Meteo Live API)"
				}), outdoor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground font-mono",
					children: outdoor.station
				})]
			}), isOutdoorLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-44 rounded-3xl" }) : isOutdoorError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 rounded-3xl border border-destructive/20 bg-destructive/10 p-5 text-sm text-destructive",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-5 w-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Outdoor weather and AQI service is currently unavailable. Indoor sensor monitoring remains active." })]
			}) : outdoor ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border bg-card p-5 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Regional Outdoor AQI"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-9 w-9 place-items-center rounded-xl bg-sky-soft text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { className: "h-5 w-5" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 font-display text-3xl font-bold tabular-nums text-moderate",
								children: [
									outdoor.aqi ?? "—",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-normal text-muted-foreground",
										children: "US AQI"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									"PM2.5: ",
									outdoor.pm25 ?? "—",
									" μg/m³ · PM10: ",
									outdoor.pm10 ?? "—",
									" μg/m³"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border bg-card p-5 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Outdoor Temperature"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-9 w-9 place-items-center rounded-xl bg-moderate-soft text-moderate",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thermometer, { className: "h-5 w-5" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-display text-3xl font-bold tabular-nums",
								children: outdoor.temperature != null ? `${outdoor.temperature} °C` : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Open-Meteo Regional Station"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border bg-card p-5 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Outdoor Humidity"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-9 w-9 place-items-center rounded-xl bg-good-soft text-good",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplets, { className: "h-5 w-5" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-display text-3xl font-bold tabular-nums",
								children: outdoor.humidity != null ? `${outdoor.humidity} %` : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Regional Atmosphere"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border bg-card p-5 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Wind & Airflow"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-9 w-9 place-items-center rounded-xl bg-sky-soft text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wind, { className: "h-5 w-5" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-display text-3xl font-bold tabular-nums",
								children: outdoor.windSpeed != null ? `${outdoor.windSpeed} km/h` : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Surface Wind Velocity"
							})
						]
					})
				]
			}) : null] })
		]
	});
}
//#endregion
export { WeatherPage as component };
