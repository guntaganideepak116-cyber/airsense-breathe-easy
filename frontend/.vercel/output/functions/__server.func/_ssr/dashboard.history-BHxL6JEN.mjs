import { i as __toESM } from "../_runtime.mjs";
import { c as require_react } from "../_libs/@clerk/clerk-react+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { E as Lightbulb, a as TriangleAlert, g as Radio } from "../_libs/lucide-react.mjs";
import { i as useI18n, r as cn } from "./router-DPkWkbV_.mjs";
import { t as formatTime } from "./status-Ba2cWdOL.mjs";
import { f as useSelectedDevice, u as useHistory } from "./queries-Dt74LbKo.mjs";
import { t as Skeleton } from "./skeleton-DQmfXsrD.mjs";
import { a as Area, c as ResponsiveContainer, i as XAxis, l as Tooltip, n as LineChart, o as Line, r as YAxis, s as CartesianGrid, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.history-BHxL6JEN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ranges = [
	"24h",
	"7d",
	"30d"
];
function HistoryPage() {
	const { t, lang } = useI18n();
	const [range, setRange] = (0, import_react.useState)("24h");
	const { deviceId, device } = useSelectedDevice();
	const { data, isLoading } = useHistory(deviceId, range);
	const chartData = (0, import_react.useMemo)(() => (data ?? []).map((p) => ({
		...p,
		label: new Date(p.t).toLocaleString(lang === "te" ? "te-IN" : "en-IN", {
			hour: range === "24h" ? "2-digit" : void 0,
			minute: range === "24h" ? "2-digit" : void 0,
			day: range === "24h" ? void 0 : "numeric",
			month: range === "24h" ? void 0 : "short"
		})
	})), [
		data,
		lang,
		range
	]);
	const events = (0, import_react.useMemo)(() => {
		const out = [];
		(data ?? []).forEach((p, i) => {
			const prev = data?.[i - 1];
			if (p.status === "poor" && (!prev || prev.status !== "poor")) out.push({
				t: p.t,
				mq135: p.mq135
			});
		});
		return out.reverse();
	}, [data]);
	const insight = (0, import_react.useMemo)(() => {
		if (!data?.length || data.length < 5) return null;
		const buckets = /* @__PURE__ */ new Map();
		data.forEach((p) => {
			const h = new Date(p.t).getHours();
			const b = buckets.get(h) ?? {
				sum: 0,
				n: 0
			};
			buckets.set(h, {
				sum: b.sum + p.mq135,
				n: b.n + 1
			});
		});
		let worst = -1;
		let worstAvg = 0;
		buckets.forEach((v, h) => {
			const avg = v.sum / v.n;
			if (avg > worstAvg) {
				worstAvg = avg;
				worst = h;
			}
		});
		if (worst < 0) return null;
		return lang === "te" ? `సాధారణంగా ${worst}:00–${(worst + 2) % 24}:00 మధ్య గాలి నాణ్యత తగ్గుతోంది.` : `Air quality tends to worsen between ${worst}:00 and ${(worst + 2) % 24}:00.`;
	}, [data, lang]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl text-ink sm:text-3xl",
						children: t("hist.title")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm text-muted-foreground",
						children: device?.name ?? "—"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex w-fit shrink-0 rounded-full border bg-card p-1",
					children: ranges.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setRange(r),
						className: cn("rounded-full px-3 py-1.5 text-xs transition-colors", range === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"),
						children: t(`hist.${r}`)
					}, r))
				})]
			}),
			insight && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3 rounded-3xl border bg-sky-soft p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "mt-0.5 h-5 w-5 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: t("hist.insight")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-foreground/75",
						children: insight
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl border bg-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold",
					children: "MQ-135 Sensor Reading Trend"
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-4 h-56 sm:h-64 rounded-2xl" }) : chartData.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed py-12 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "h-8 w-8 animate-pulse text-muted-foreground/60" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm font-semibold text-foreground",
							children: "No historical readings yet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 max-w-sm text-xs text-muted-foreground",
							children: "Historical air contamination trends for this room will appear once your ESP32 transmits data."
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 h-56 sm:h-64",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
							data: chartData,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "aq",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "0%",
										stopColor: "var(--primary)",
										stopOpacity: .45
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "100%",
										stopColor: "var(--primary)",
										stopOpacity: 0
									})]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "var(--border)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "label",
									tick: { fontSize: 11 },
									minTickGap: 24,
									stroke: "var(--muted-foreground)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tick: { fontSize: 11 },
									stroke: "var(--muted-foreground)",
									width: 40
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									contentStyle: {
										borderRadius: 12,
										border: "1px solid var(--border)",
										background: "var(--card)",
										fontSize: 12
									},
									formatter: (val) => [`${val} (Sensor Value)`, "MQ-135"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									type: "monotone",
									dataKey: "mq135",
									stroke: "var(--primary)",
									strokeWidth: 2,
									fill: "url(#aq)"
								})
							]
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl border bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: t("hist.thChart")
					}),
					isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-4 h-56 rounded-2xl" }) : chartData.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed py-12 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "h-8 w-8 animate-pulse text-muted-foreground/60" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm font-semibold text-foreground",
								children: "No temperature or humidity history yet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 max-w-sm text-xs text-muted-foreground",
								children: "DHT22 sensor logs will be automatically plotted here."
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 h-56",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
								data: chartData,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										stroke: "var(--border)",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "label",
										tick: { fontSize: 11 },
										minTickGap: 24,
										stroke: "var(--muted-foreground)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										tick: { fontSize: 11 },
										stroke: "var(--muted-foreground)",
										width: 40
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										borderRadius: 12,
										border: "1px solid var(--border)",
										background: "var(--card)",
										fontSize: 12
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "temperature",
										name: "Temperature (°C)",
										stroke: "var(--moderate)",
										strokeWidth: 2,
										dot: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "humidity",
										name: "Humidity (%)",
										stroke: "var(--good)",
										strokeWidth: 2,
										dot: false
									})
								]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex gap-4 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-4 rounded-full bg-moderate" }),
								" ",
								t("dash.temp")
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-4 rounded-full bg-good" }),
								" ",
								t("dash.humidity")
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl border bg-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold",
					children: t("hist.events")
				}), events.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted-foreground",
					children: t("hist.noEvents")
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 divide-y",
					children: events.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 py-3 sm:grid-cols-[auto_minmax(0,1fr)_auto]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-poor-soft text-poor",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "min-w-0 flex items-center gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium",
									children: t("hist.eventPoor")
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "col-start-2 shrink-0 text-xs tabular-nums text-muted-foreground sm:col-start-auto",
								children: [
									formatTime(e.t, lang),
									" · MQ-135: ",
									e.mq135
								]
							})
						]
					}, e.t))
				})]
			})
		]
	});
}
//#endregion
export { HistoryPage as component };
