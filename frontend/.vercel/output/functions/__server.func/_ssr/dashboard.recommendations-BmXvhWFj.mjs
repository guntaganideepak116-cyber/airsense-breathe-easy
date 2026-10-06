import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { A as HeartPulse, B as CircleCheck, P as Droplets, a as TriangleAlert, g as Radio, l as Thermometer, n as Wind, p as ShieldAlert } from "../_libs/lucide-react.mjs";
import { i as useI18n, r as cn } from "./router-DPkWkbV_.mjs";
import { n as statusTheme } from "./status-Ba2cWdOL.mjs";
import { d as useLatest, f as useSelectedDevice } from "./queries-Dt74LbKo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.recommendations-BmXvhWFj.js
var import_jsx_runtime = require_jsx_runtime();
function RecommendationsPage() {
	const { t } = useI18n();
	const { deviceId, device } = useSelectedDevice();
	const { data: reading } = useLatest(deviceId);
	const status = reading?.status ?? "good";
	const theme = statusTheme[status];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl text-ink sm:text-3xl",
					children: t("rec.title")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-sm text-muted-foreground",
					children: device?.name ?? "Room Sensor Location"
				})] })
			}),
			!reading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border bg-card p-10 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/80 text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "h-8 w-8 animate-pulse text-primary" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-4 font-display text-xl font-bold text-foreground",
						children: "Not enough sensor data to generate recommendations."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-2 max-w-md text-sm text-muted-foreground",
						children: "Connect your AirSense ESP32 device to this room to receive personalized, real-time health and ventilation recommendations."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("rounded-3xl border p-5 transition-all", theme.soft),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("grid h-10 w-10 place-items-center rounded-2xl text-white", theme.dot),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeartPulse, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wider text-muted-foreground",
							children: t("dash.airquality")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cn("font-display text-xl font-bold", theme.text),
							children: t(theme.label)
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-md text-sm text-foreground/80",
						children: [
							status === "good" && t("status.good.advice"),
							status === "moderate" && t("status.moderate.advice"),
							status === "poor" && t("status.poor.advice")
						]
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-3xl border bg-card p-6 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wind, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg",
								children: "Ventilation & Airflow"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-5 space-y-3.5 text-sm text-muted-foreground",
							children: [reading.mq135 >= 700 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2.5 text-poor",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Immediate action:" }),
									" High air contamination detected (MQ-135:",
									" ",
									reading.mq135,
									"). Open windows or activate exhaust fans immediately."
								] })]
							}) : reading.mq135 >= 400 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2.5 text-moderate",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Ventilation needed:" }),
									" Moderate air contamination (MQ-135:",
									" ",
									reading.mq135,
									"). Consider opening a window for fresh air circulation."
								] })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2.5 text-good",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mt-0.5 h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Air quality is clean:" }),
									" MQ-135 reading is low (",
									reading.mq135,
									"). Ideal environment for children, students, and sleeping."
								] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mt-0.5 h-4 w-4 shrink-0 text-good" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Use damp microfiber cloths for dusting to prevent recirculating particles." })]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-3xl border bg-card p-6 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-moderate",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thermometer, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg",
								children: "Thermal Comfort"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-5 space-y-3.5 text-sm text-muted-foreground",
							children: [reading.temperature > 32 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2.5 text-moderate",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
									"High Temperature (",
									reading.temperature,
									"°C):"
								] }), " Increase room airflow with fans or air conditioning to reduce heat stress."] })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2.5 text-good",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mt-0.5 h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
									"Temperature Comfort (",
									reading.temperature,
									"°C):"
								] }), " Indoor thermal level is within safe bounds."] })]
							}), reading.humidity > 65 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2.5 text-moderate",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplets, { className: "mt-0.5 h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
									"High Humidity (",
									reading.humidity,
									"%):"
								] }), " Excessive moisture can promote mold and allergen accumulation. Keep airflow moving."] })]
							}) : reading.humidity < 35 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2.5 text-moderate",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplets, { className: "mt-0.5 h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
									"Low Humidity (",
									reading.humidity,
									"%):"
								] }), " Dry indoor air may cause throat or nasal irritation."] })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2.5 text-good",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mt-0.5 h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
									"Balanced Humidity (",
									reading.humidity,
									"%):"
								] }), " Moisture level is healthy for lungs and skin."] })]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-3xl border bg-card p-6 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-lg",
									children: t("rec.sensitive")
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: [
									"Active health alerts based on current indoor reading (",
									reading.status,
									"):"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 flex flex-wrap gap-2",
								children: [
									{
										name: "Children & Infants",
										tag: "High Risk",
										icon: "👶"
									},
									{
										name: "Asthma & Allergy Patients",
										tag: "Critical",
										icon: "🫁"
									},
									{
										name: "Elderly (60+ yrs)",
										tag: "High Risk",
										icon: "👴"
									},
									{
										name: "Pregnant Women",
										tag: "Moderate",
										icon: "🤰"
									},
									{
										name: "Outdoor Field Workers",
										tag: "Exposure Alert",
										icon: "👷"
									}
								].map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5 rounded-full border bg-secondary/60 px-3 py-1.5 text-xs font-medium text-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: g.icon }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: g.name }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-md bg-card px-1.5 py-0.5 text-[10px] text-muted-foreground",
											children: g.tag
										})
									]
								}, g.name))
							})
						]
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl border bg-card p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg",
						children: t("rec.scale")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Calibrated threshold bands for MQ-135 sensor readings:"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid gap-3 md:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border bg-good-soft/40 p-4 border-good/30",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-base font-semibold text-good",
										children: "Good (బాగుంది)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-good/20 px-2.5 py-0.5 text-xs font-mono text-good",
										children: "< 400"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs text-foreground/70",
									children: "Clean, breathable indoor air. Ideal for study, focus, and sleeping."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border bg-moderate-soft/40 p-4 border-moderate/30",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-base font-semibold text-moderate",
										children: "Moderate (మధ్యస్థం)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-moderate/20 px-2.5 py-0.5 text-xs font-mono text-moderate",
										children: "400 – 700"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs text-foreground/70",
									children: "Acceptable air quality. Consider opening a window for fresh air circulation."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border bg-poor-soft/40 p-4 border-poor/30",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-base font-semibold text-poor",
										children: "Poor (పేలవం)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-poor/20 px-2.5 py-0.5 text-xs font-mono text-poor",
										children: "> 700"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs text-foreground/70",
									children: "Elevated contaminants/VOCs. Local buzzer sounds. Open windows immediately."
								})]
							})
						]
					})
				]
			})
		]
	});
}
//#endregion
export { RecommendationsPage as component };
