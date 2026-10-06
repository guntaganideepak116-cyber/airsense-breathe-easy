import { i as __toESM } from "../_runtime.mjs";
import { c as require_react } from "../_libs/@clerk/clerk-react+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as CircleCheck, F as Download, G as BellRing, I as Cpu, K as ArrowUpDown, O as Info, P as Droplets, U as ChevronDown, Y as ArrowDownUp, _ as Plus, d as Sparkles, g as Radio, i as WifiOff, l as Thermometer, n as Wind, o as TrendingUp, r as Wifi, s as TrendingDown, t as X, u as Table, v as Pencil, y as Minus } from "../_libs/lucide-react.mjs";
import { i as useI18n, r as cn } from "./router-DPkWkbV_.mjs";
import { t as Button } from "./router-DPkWkbV_2.mjs";
import { n as statusTheme, t as formatTime } from "./status-Ba2cWdOL.mjs";
import { a as statusRank, c as useDeviceStream, d as useLatest, f as useSelectedDevice, o as useAllLatest, p as useTrend, s as useDeviceMutations, t as actionKey, u as useHistory } from "./queries-Dt74LbKo.mjs";
import { t as Skeleton } from "./skeleton-DQmfXsrD.mjs";
import { a as pushState, i as pushPreference, n as disablePush, r as enablePush, t as Input } from "./input-ft3feVIc.mjs";
import { t as useAirAlert } from "./use-air-alert-BG53I9XP.mjs";
import { t as BreathingOrb } from "./BreathingOrb-9Kiv-YL2.mjs";
import { t as useOutdoorAqi } from "./outdoor-vkc--WaP.mjs";
import { a as Trigger, i as Root3, n as Portal, r as Provider, t as Content2 } from "../_libs/@radix-ui/react-tooltip+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.index-CyOvInSm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DISMISS_KEY = "airsense-push-dismissed";
/** Non-intrusive opt-in card. Hides itself once alerts are on or dismissed. */
function PushOptIn() {
	const { t } = useI18n();
	const [state, setState] = (0, import_react.useState)(null);
	const [enabled, setEnabled] = (0, import_react.useState)(false);
	const [dismissed, setDismissed] = (0, import_react.useState)(true);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setState(pushState());
		setEnabled(pushPreference());
		setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
	}, []);
	if (state === null || state === "unsupported") return null;
	if (state === "granted" && enabled) return null;
	if (dismissed && state !== "denied") return null;
	if (state === "denied" && dismissed) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative overflow-hidden rounded-3xl border bg-card p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 pr-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-soft text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "h-5 w-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: t("push.title")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: state === "denied" ? t("push.blocked") : t("push.desc")
					}),
					state !== "denied" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "rounded-full",
							disabled: busy,
							onClick: async () => {
								setBusy(true);
								const next = await enablePush();
								setState(next);
								setEnabled(next === "granted");
								setBusy(false);
								if (next === "granted") toast.success(t("push.enabled"));
								else if (next === "denied") toast.error(t("push.blocked"));
							},
							children: t("push.enable")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: "rounded-full",
							onClick: () => {
								localStorage.setItem(DISMISS_KEY, "1");
								setDismissed(true);
								disablePush();
							},
							children: t("push.later")
						})]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			"aria-label": t("push.later"),
			className: "absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary",
			onClick: () => {
				localStorage.setItem(DISMISS_KEY, "1");
				setDismissed(true);
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
		})]
	});
}
/** Guidance that changes with the live status and the direction of the trend. */
function ActionCard({ status, trend }) {
	const { t } = useI18n();
	const theme = statusTheme[status];
	const key = actionKey(status, trend);
	const trendIcon = trend === "rising" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3.5 w-3.5" }) : trend === "falling" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3.5 w-3.5" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("status-transition rounded-3xl border p-6", theme.soft),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex items-center gap-2 text-sm font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wind, { className: cn("h-4 w-4", theme.text) }), t("action.title")]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cn("flex items-center gap-1.5 rounded-full bg-card/70 px-2.5 py-1 text-[11px]", trend === "rising" ? "text-poor" : trend === "falling" ? "text-good" : "text-muted-foreground"),
					children: [trendIcon, t(`action.trend.${trend}`)]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("mt-3 text-base leading-relaxed", theme.text),
				children: t(key)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-[11px] leading-relaxed text-foreground/50",
				children: t("action.disclaimer")
			})
		]
	});
}
var TooltipProvider = Provider;
var Tooltip = Root3;
var TooltipTrigger = Trigger;
var TooltipContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)", className),
	...props
}) }));
TooltipContent.displayName = Content2.displayName;
/**
* Indoor sensor status side by side with the citywide outdoor AQI.
* The gap between the two is the whole point of the product.
*/
function IndoorOutdoor({ indoor, compact = false, className }) {
	const { t, lang } = useI18n();
	const { data: outdoor, isLoading, isError, city } = useOutdoorAqi();
	const indoorTheme = indoor ? statusTheme[indoor] : null;
	const outdoorTheme = outdoor ? statusTheme[outdoor.status] : null;
	const differs = !!indoor && !!outdoor && indoor !== outdoor.status;
	const pill = (label, value, dot, text) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "flex min-w-0 items-center gap-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-2 w-2 shrink-0 rounded-full", dot) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "shrink-0 text-foreground/60",
				children: [label, ":"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("truncate font-medium", text),
				children: value
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-2xl border bg-card/60 p-3", compact && "bg-transparent p-0", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("flex flex-wrap items-center gap-x-3 gap-y-1", compact ? "text-[11px]" : "text-xs"),
			children: [
				pill(t("out.indoor"), indoorTheme ? t(indoorTheme.label) : "—", indoorTheme?.dot ?? "bg-muted", indoorTheme?.text ?? "text-muted-foreground"),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-foreground/25",
					children: "·"
				}),
				isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: t("out.loading")
				}) : isError || !outdoor ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: t("out.unavailable")
				}) : pill(t("out.outdoor"), `${t(outdoorTheme.label)} · ${t("out.aqi")} ${outdoor.aqi}`, outdoorTheme.dot, outdoorTheme.text),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, {
					delayDuration: 150,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": t("out.tooltip"),
							onClick: (e) => e.stopPropagation(),
							className: "shrink-0 rounded-full text-muted-foreground transition-colors hover:text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5" })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, {
						className: "max-w-64 text-xs leading-relaxed",
						children: t("out.tooltip")
					})] })
				})
			]
		}), !compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-2 text-[11px] text-muted-foreground",
			children: [
				city.name[lang],
				" · ",
				t("out.source"),
				differs && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" · ", t("out.gap")] })
			]
		})]
	});
}
function formatUptime(seconds, lang) {
	if (!seconds && seconds !== 0) return null;
	const h = Math.floor(seconds / 3600);
	const d = Math.floor(h / 24);
	const m = Math.floor(seconds % 3600 / 60);
	if (d > 0) return lang === "te" ? `${d} రోజులు ${h % 24} గం` : `${d}d ${h % 24}h`;
	if (h > 0) return lang === "te" ? `${h} గం ${m} ని` : `${h}h ${m}m`;
	return lang === "te" ? `${m} ని` : `${m}m`;
}
/** Secondary technical detail, collapsed by default so it never crowds the status. */
function DeviceDiagnostics({ reading, className }) {
	const { t, lang } = useI18n();
	const [open, setOpen] = (0, import_react.useState)(false);
	const na = t("diag.na");
	const rows = [
		{
			label: t("diag.raw"),
			value: reading ? `${reading.mq135}` : na
		},
		{
			label: t("diag.wifi"),
			value: reading?.rssi != null ? `${reading.rssi} dBm` : na
		},
		{
			label: t("diag.uptime"),
			value: formatUptime(reading?.uptimeSec, lang) ?? na
		},
		{
			label: t("diag.firmware"),
			value: reading?.firmware ? `v${reading.firmware}` : na
		},
		{
			label: t("diag.lastData"),
			value: reading ? formatTime(reading.timestamp, lang) : na
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-2xl border bg-card/50", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			"aria-expanded": open,
			onClick: (e) => {
				e.stopPropagation();
				setOpen((v) => !v);
			},
			className: "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-[11px] text-muted-foreground transition-colors hover:text-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "h-3.5 w-3.5" }), t("diag.title")]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("h-3.5 w-3.5 transition-transform", open && "rotate-180") })]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
			className: "space-y-1.5 border-t px-3 py-2.5 text-[11px]",
			children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "truncate text-muted-foreground",
					children: r.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "shrink-0 font-mono tabular-nums",
					children: r.value
				})]
			}, r.label))
		})]
	});
}
/** Raw sensor value reported by the firmware, converted to an estimated ADC count. */
function adcFromSensorValue(mq135) {
	const ratio = (mq135 - 250) / 650;
	return Math.max(0, Math.min(4095, Math.round(450 + ratio * 2750)));
}
var adcFromPpm = adcFromSensorValue;
/** Min–max normalised 0–100 index. Higher means more contaminated air. */
function aqiScoreFromAdc(adc) {
	const raw = (adc - 450) / 2750 * 100;
	return Math.max(0, Math.min(100, Math.round(raw)));
}
function tempBand(c) {
	if (c < 18) return "low";
	if (c > 32) return "high";
	return "ok";
}
function humidityBand(h) {
	if (h < 30) return "low";
	if (h > 65) return "high";
	return "ok";
}
/** Smooth green → amber → red ramp across the 0–100 index. */
function indexColor(score) {
	if (score <= 50) return `color-mix(in oklab, var(--moderate) ${Math.round(score / 50 * 100)}%, var(--good))`;
	return `color-mix(in oklab, var(--poor) ${Math.round((score - 50) / 50 * 100)}%, var(--moderate))`;
}
function Ring({ value, color, size = 176, stroke = 14, children }) {
	const r = (size - stroke) / 2;
	const c = 2 * Math.PI * r;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mx-auto",
		style: {
			width: size,
			height: size
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			width: size,
			height: size,
			className: "-rotate-90",
			"aria-hidden": true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: size / 2,
				cy: size / 2,
				r,
				fill: "none",
				strokeWidth: stroke,
				className: "stroke-muted"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: size / 2,
				cy: size / 2,
				r,
				fill: "none",
				strokeWidth: stroke,
				strokeLinecap: "round",
				stroke: color,
				strokeDasharray: c,
				strokeDashoffset: c - Math.max(0, Math.min(100, value)) / 100 * c,
				style: { transition: "stroke-dashoffset 700ms cubic-bezier(.22,1,.36,1), stroke 700ms ease" }
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 grid place-items-center text-center",
			children
		})]
	});
}
function BandStrip({ active, labels }) {
	const keys = [
		"low",
		"ok",
		"high"
	];
	const tone = {
		low: "bg-sky-soft text-primary",
		ok: "bg-good-soft text-good",
		high: "bg-moderate-soft text-moderate"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-4 grid grid-cols-3 gap-1 text-center text-[11px]",
		children: keys.map((k, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("truncate rounded-full px-2 py-1 transition-colors", active === k ? tone[k] : "bg-muted/50 text-muted-foreground/60"),
			children: labels[i]
		}, k))
	});
}
/**
* Only what the hardware genuinely measures: one MQ135 contamination index
* plus DHT22 temperature and relative humidity.
*/
function SensorReadings({ reading, tick, className }) {
	const { t } = useI18n();
	const [rawOpen, setRawOpen] = (0, import_react.useState)(false);
	const adc = reading ? adcFromPpm(reading.mq135) : null;
	const score = adc != null ? aqiScoreFromAdc(adc) : 0;
	const status = reading?.status ?? "good";
	const theme = statusTheme[status];
	const temp = reading?.temperature ?? null;
	const tBand = tempBand(temp ?? 24);
	const tPct = temp == null ? 0 : Math.max(0, Math.min(100, (temp - 15) / 30 * 100));
	const hum = reading?.humidity ?? null;
	const hBand = humidityBand(hum ?? 45);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("space-y-4", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-xl text-ink",
			children: t("sens.title")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: t("sens.desc")
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-3xl border bg-card p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "min-w-0 truncate text-sm font-semibold",
								children: t("sens.aqi")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, {
								delayDuration: 150,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": t("sens.aqiInfo"),
										className: "shrink-0 text-muted-foreground transition-colors hover:text-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5" })
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, {
									className: "max-w-64 text-xs leading-relaxed",
									children: t("sens.aqiInfo")
								})] })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ring, {
								value: score,
								color: indexColor(score),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "value-pulse",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-display text-4xl tabular-nums",
										style: { color: reading ? indexColor(score) : "var(--muted-foreground)" },
										children: [reading ? score : "—", reading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xl",
											children: "%"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground",
										children: t("sens.mq")
									})]
								}, tick)
							})
						}),
						reading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cn("mt-5 text-center font-display text-3xl status-transition", theme.text),
							children: t(theme.label)
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 text-center font-display text-lg text-muted-foreground",
							children: "Waiting for sensor data"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 rounded-2xl border bg-card/50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"aria-expanded": rawOpen,
								onClick: () => setRawOpen((v) => !v),
								className: "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-[11px] text-muted-foreground transition-colors hover:text-foreground",
								children: [t("sens.raw"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("h-3.5 w-3.5 transition-transform", rawOpen && "rotate-180") })]
							}), rawOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "space-y-1.5 border-t px-3 py-2.5 text-[11px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "truncate text-muted-foreground",
											children: t("sens.rawAdc")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "shrink-0 font-mono tabular-nums",
											children: adc ?? "—"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "truncate text-muted-foreground",
											children: t("sens.rawIndex")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "shrink-0 font-mono tabular-nums",
											children: reading ? `${score}%` : "—"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "pt-1 font-mono text-[10px] leading-relaxed text-muted-foreground",
										children: t("sens.rawFormula").replace(/\{clean\}/g, String(450)).replace(/\{poor\}/g, String(3200))
									})
								]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-3xl border bg-card p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thermometer, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: t("dash.temp")
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex items-end justify-center gap-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative h-40 w-6 overflow-hidden rounded-full bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-x-0 bottom-0 rounded-full bg-linear-to-t from-primary via-good to-moderate",
									style: {
										height: `${tPct}%`,
										transition: "height 700ms cubic-bezier(.22,1,.36,1)"
									}
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "value-pulse",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-4xl tabular-nums",
									children: temp != null ? `${temp}°` : "—"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: ["°C · ", t("sens.dht")]
								})]
							}, tick)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BandStrip, {
							active: tBand,
							labels: [
								t("sens.temp.low"),
								t("sens.temp.ok"),
								t("sens.temp.high")
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-3xl border bg-card p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplets, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: t("dash.humidity")
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ring, {
								value: hum ?? 0,
								color: "var(--primary)",
								size: 140,
								stroke: 12,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "value-pulse",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-display text-3xl tabular-nums text-primary",
										children: [hum != null ? hum : "—", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-lg",
											children: "%"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground",
										children: t("sens.dht")
									})]
								}, tick)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BandStrip, {
							active: hBand,
							labels: [
								t("sens.hum.low"),
								t("sens.hum.ok"),
								t("sens.hum.high")
							]
						})
					]
				})
			]
		})]
	});
}
/** Every room in one sortable table, worst air first by default. */
function RoomComparison({ devices, onSelect }) {
	const { t, lang } = useI18n();
	const [sort, setSort] = (0, import_react.useState)("status");
	const latest = useAllLatest(devices.map((d) => d.id));
	const rows = devices.map((d) => ({
		device: d,
		reading: latest.find((l) => l.deviceId === d.id)?.reading ?? null
	})).sort((a, b) => {
		if (sort === "name") return a.device.name.localeCompare(b.device.name);
		const ra = a.reading ? statusRank(a.reading.status) : -1;
		return (b.reading ? statusRank(b.reading.status) : -1) - ra || (b.reading?.mq135 ?? 0) - (a.reading?.mq135 ?? 0);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-3xl border bg-card p-4 sm:p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold",
					children: t("cmp.title")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: t("cmp.desc")
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setSort((s) => s === "status" ? "name" : "status"),
				className: "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "h-3.5 w-3.5" }),
					t("cmp.sortBy"),
					": ",
					t(sort === "status" ? "cmp.sortStatus" : "cmp.sortName")
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-136 border-collapse text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "text-left text-[11px] uppercase tracking-wide text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "pb-2 font-medium",
							children: t("cmp.room")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "pb-2 font-medium",
							children: t("cmp.status")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "pb-2 font-medium",
							children: t("cmp.reading")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "pb-2 font-medium",
							children: t("cmp.climate")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "pb-2 text-right font-medium",
							children: t("cmp.updated")
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "divide-y",
					children: rows.map(({ device, reading }) => {
						const theme = reading ? statusTheme[reading.status] : null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							onClick: () => onSelect?.(device.id),
							className: cn("align-middle", onSelect && "cursor-pointer transition-colors hover:bg-secondary/50"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "max-w-40 truncate py-3 pr-3 font-medium",
									children: device.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 pr-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: cn("flex items-center gap-2", theme?.text ?? "text-muted-foreground"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-2 w-2 rounded-full", theme?.dot ?? "bg-muted") }), theme ? t(theme.label) : "—"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 pr-3 tabular-nums font-mono",
									children: reading ? `${reading.mq135}` : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 pr-3 tabular-nums text-muted-foreground",
									children: reading ? `${reading.temperature}°C · ${reading.humidity}%` : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 text-right text-xs tabular-nums text-muted-foreground",
									children: reading ? formatTime(reading.timestamp, lang) : "—"
								})
							]
						}, device.id);
					})
				})]
			})
		})]
	});
}
/** Guided first-run state shown when no device has been registered yet. */
function EmptyRooms({ onAdd }) {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-3xl border border-dashed bg-card/50 px-6 py-12 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreathingOrb, {
				status: "good",
				size: "sm",
				className: "mx-auto h-36! w-36! opacity-80"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-6 font-display text-xl text-ink sm:text-2xl",
				children: t("empty.title")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground",
				children: t("empty.desc")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "mt-6 rounded-full",
				onClick: onAdd,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }), t("empty.cta")]
			})
		]
	});
}
function Overview() {
	const { t, lang } = useI18n();
	const { devices, device, deviceId, select } = useSelectedDevice();
	const { data: polled, isLoading } = useLatest(deviceId);
	const { reading: streamed, status: streamStatus, tick } = useDeviceStream(deviceId);
	const { data: historyData } = useHistory(deviceId, "30d");
	const { rename } = useDeviceMutations();
	const trend = useTrend(deviceId);
	const navigate = useNavigate();
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [sortField, setSortField] = (0, import_react.useState)("name");
	const [sortDir, setSortDir] = (0, import_react.useState)("asc");
	const reading = streamed ?? polled;
	useAirAlert(streamed, device?.name);
	const status = reading?.status ?? "good";
	const theme = statusTheme[status];
	const live = streamStatus === "live" && Boolean(reading);
	const exportCsv = () => {
		if (!historyData || historyData.length === 0) {
			toast.error("No historical data available to export.");
			return;
		}
		const headers = [
			"Timestamp",
			"Device Name",
			"MQ-135 Sensor Reading",
			"Temperature (C)",
			"Humidity (%)",
			"Status"
		];
		const rows = historyData.map((h) => [
			`"${h.t}"`,
			`"${device?.name || "Room"}"`,
			h.mq135,
			h.temperature,
			h.humidity,
			`"${h.status}"`
		]);
		const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", `airsense_${device?.name || "room"}_readings.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toast.success("Readings CSV exported successfully!");
	};
	const tableRows = (0, import_react.useMemo)(() => {
		if (!reading) return [];
		return [
			{
				name: device?.name || "Room",
				type: "Air Quality (MQ-135)",
				val: `${reading.mq135}`,
				unit: "Sensor Value",
				time: reading.timestamp
			},
			{
				name: device?.name || "Room",
				type: "Temperature (DHT22)",
				val: `${reading.temperature} °C`,
				unit: "Celsius",
				time: reading.timestamp
			},
			{
				name: device?.name || "Room",
				type: "Humidity (DHT22)",
				val: `${reading.humidity} %`,
				unit: "Relative Humidity",
				time: reading.timestamp
			}
		].sort((a, b) => {
			if (sortField === "name") return sortDir === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
			if (sortField === "type") return sortDir === "asc" ? a.type.localeCompare(b.type) : b.type.localeCompare(a.type);
			return sortDir === "asc" ? a.val.localeCompare(b.val) : b.val.localeCompare(a.val);
		});
	}, [
		device?.name,
		reading,
		sortField,
		sortDir
	]);
	if (devices.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyRooms, { onAdd: () => void navigate({ to: "/dashboard/rooms" }) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-center justify-between gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl text-ink sm:text-3xl",
					children: t("dash.title")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-sm text-muted-foreground",
					children: device?.name ?? "—"
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl sm:rounded-3xl border bg-card p-4 sm:p-5 text-center shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl sm:text-3xl font-bold tabular-nums text-primary",
							children: devices.length
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[11px] sm:text-xs text-muted-foreground",
							children: t("dash.monitoredRooms")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl sm:rounded-3xl border bg-card p-4 sm:p-5 text-center shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl sm:text-3xl font-bold tabular-nums text-foreground",
							children: historyData ? historyData.length : reading ? 1 : 0
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[11px] sm:text-xs text-muted-foreground",
							children: t("dash.totalReadings")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl sm:rounded-3xl border bg-card p-4 sm:p-5 text-center shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl sm:text-3xl font-bold tabular-nums text-good",
							children: historyData && historyData.length > 0 ? "30 Days" : "Live Active"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[11px] sm:text-xs text-muted-foreground",
							children: t("dash.dataSpan")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-span-2 sm:col-span-1 flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border bg-card p-4 sm:p-5 text-center shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: exportCsv,
							size: "sm",
							className: "w-full rounded-2xl",
							disabled: !historyData || historyData.length === 0,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1.5 h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: t("dash.exportCsv")
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-[10px] sm:text-[11px] text-muted-foreground truncate",
							children: reading ? formatTime(reading.timestamp, lang) : "Awaiting sensor data"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "no-scrollbar flex items-center gap-2 overflow-x-auto rounded-2xl sm:rounded-3xl border bg-card p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0 mr-1 px-1 text-xs font-semibold text-muted-foreground whitespace-nowrap",
					children: "Select Room:"
				}), devices.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => select(d.id),
					className: cn("shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 min-h-9", d.id === deviceId ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"),
					children: d.name
				}, d.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PushOptIn, {}),
			isLoading && !reading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-72 rounded-3xl" }) : reading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: cn("status-transition rounded-3xl border p-6 lg:p-8", theme.soft),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid items-center gap-6 sm:grid-cols-[auto_minmax(0,1fr)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreathingOrb, {
						status,
						size: "sm",
						className: "mx-auto h-44! w-44!"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm text-foreground/60",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-2.5 w-2.5 animate-pulse rounded-full", theme.dot) }),
									t("dash.airquality"),
									" ·",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: cn("h-3.5 w-3.5", live && "text-good") }), live ? t("dash.live") : streamStatus === "reconnecting" ? t("rooms.reconnecting") : t("rooms.connecting")]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: cn("mt-2 font-display text-5xl font-bold leading-tight", theme.text),
								children: t(theme.label)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-foreground/75",
								children: [
									t("dash.sensorReading"),
									":",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular-nums font-bold font-mono inline-block",
										children: reading.mq135
									}, tick),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-normal text-muted-foreground",
										children: "(Sensor Value)"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-foreground/60",
								children: [
									t("dash.updated"),
									":",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular-nums",
										children: formatTime(reading.timestamp, lang)
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndoorOutdoor, {
								indoor: reading.status,
								className: "mt-4"
							})
						]
					})]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl border bg-card p-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/80 text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "h-8 w-8 animate-pulse text-primary" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-4 font-display text-2xl font-bold text-foreground",
						children: "Waiting for Sensor Data"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mx-auto mt-2 max-w-md text-sm text-muted-foreground",
						children: [
							"No readings have arrived from device",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "font-mono text-primary",
								children: device?.name
							}),
							" (",
							deviceId,
							") yet. Power on your ESP32 hardware and ensure it connects to Wi-Fi."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl border bg-card p-6 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-4 border-b pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg",
							children: t("dash.selectTable")
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 rounded-full border bg-secondary/80 px-3 py-1 text-xs font-mono text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 text-good" }), tableRows.length > 0 ? `${tableRows.length} Active Measurements` : "Waiting for hardware stream"]
					})]
				}), tableRows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-8 text-center text-sm text-muted-foreground",
					children: "No live sensor readings available yet. Once the ESP32 begins transmitting, readings will display here."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b bg-secondary/30 text-xs uppercase tracking-wider text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "cursor-pointer p-3.5 font-semibold hover:text-foreground",
									onClick: () => {
										setSortField("name");
										setSortDir(sortDir === "asc" ? "desc" : "asc");
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: ["Room / Device ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownUp, { className: "h-3 w-3" })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "cursor-pointer p-3.5 font-semibold hover:text-foreground",
									onClick: () => {
										setSortField("type");
										setSortDir(sortDir === "asc" ? "desc" : "asc");
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: ["Measurement Type ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownUp, { className: "h-3 w-3" })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3.5 font-semibold",
									children: "Timestamp"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3.5 text-right font-semibold",
									children: "Live Value"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y text-sm",
							children: tableRows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "transition-colors hover:bg-secondary/40",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3.5 font-medium",
										children: r.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3.5 text-muted-foreground",
										children: r.type
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3.5 font-mono text-xs text-muted-foreground",
										children: r.time ? formatTime(r.time, lang) : "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3.5 text-right font-mono font-semibold text-primary",
										children: r.val
									})
								]
							}, i))
						})]
					})
				})]
			}),
			reading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionCard, {
				status,
				trend
			}),
			devices.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoomComparison, {
				devices,
				onSelect: select
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SensorReadings, {
				reading,
				tick
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-3xl border bg-card p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-semibold",
								children: t("dash.device")
							}), device?.online || live ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex shrink-0 items-center gap-1.5 rounded-full bg-good-soft px-2.5 py-1 text-xs text-good",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, { className: "h-3.5 w-3.5" }),
									" ",
									t("dash.online")
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex shrink-0 items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WifiOff, { className: "h-3.5 w-3.5" }),
									" ",
									device?.lastSeen ? t("dash.offline") : "Never Connected"
								]
							})]
						}),
						editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: name,
									onChange: (e) => setName(e.target.value),
									className: "rounded-xl"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: "rounded-xl",
									onClick: () => {
										if (device && name.trim()) {
											rename.mutate({
												id: device.id,
												name: name.trim()
											});
											toast.success(t("rooms.renamed"));
										}
										setEditing(false);
									},
									children: t("dash.save")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									className: "rounded-xl",
									onClick: () => setEditing(false),
									children: t("dash.cancel")
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "min-w-0 flex-1 truncate text-lg font-medium",
								children: device?.name ?? "—"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								className: "shrink-0 rounded-full",
								onClick: () => {
									setName(device?.name ?? "");
									setEditing(true);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "mr-1 h-3.5 w-3.5" }), t("dash.rename")]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeviceDiagnostics, {
							reading,
							className: "mt-4"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-3xl border bg-card p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: t("dash.alertStatus")
					}), reading?.buzzerActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-start gap-3 rounded-2xl bg-poor-soft p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "mt-0.5 h-5 w-5 shrink-0 text-poor" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-foreground/80",
							children: t("dash.buzzerFired")
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-start gap-3 rounded-2xl bg-good-soft p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mt-0.5 h-5 w-5 shrink-0 text-good" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-foreground/80",
							children: reading ? t("status.good.advice") : "Awaiting hardware readings"
						})]
					})]
				})]
			})
		]
	});
}
//#endregion
export { Overview as component };
