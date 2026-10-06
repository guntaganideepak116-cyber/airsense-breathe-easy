import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as Languages, G as BellRing, M as Gauge, P as Droplets, R as Cloud, W as Check, X as Activity, f as Smartphone, g as Radio, j as Globe, k as History, l as Thermometer, n as Wind, q as ArrowRight, y as Minus } from "../_libs/lucide-react.mjs";
import { i as useI18n, r as cn } from "./router-DPkWkbV_.mjs";
import { t as Button } from "./router-DPkWkbV_2.mjs";
import { t as LangToggle } from "./LangToggle-j5mbIzjI.mjs";
import { n as statusTheme } from "./status-Ba2cWdOL.mjs";
import { a as Area, c as ResponsiveContainer, r as YAxis, t as AreaChart } from "../_libs/recharts+[...].mjs";
import { t as BreathingOrb } from "./BreathingOrb-9Kiv-YL2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BqNlAE3Z.js
var import_jsx_runtime = require_jsx_runtime();
var sample = Array.from({ length: 28 }, (_, i) => ({ v: 300 + Math.round(Math.sin(i / 3.2) * 120 + (i > 18 ? (i - 18) * 22 : 0) + i % 4 * 12) }));
/** Static, realistic mock of the dashboard used on the landing page. */
function DashboardPreview({ status = "moderate" }) {
	const { t } = useI18n();
	const theme = statusTheme[status];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-3xl border bg-card p-4 shadow-sm sm:p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("rounded-2xl p-5 status-transition", theme.soft),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium text-foreground/70",
							children: t("dash.airquality")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5 text-xs text-foreground/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-2 w-2 animate-pulse rounded-full", theme.dot) }), t("dash.live")]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreathingOrb, {
							status,
							size: "sm",
							className: "shrink-0 h-28! w-28!"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: cn("font-display text-4xl leading-tight", theme.text),
								children: t(theme.label)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-foreground/60",
								children: [
									t("dash.sensorReading"),
									": ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular-nums",
										children: "612"
									}),
									" (Sensor Value)"
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-foreground/75",
						children: t(theme.advice)
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thermometer, { className: "h-4 w-4" }),
						label: t("dash.temp"),
						value: "31.4°C"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplets, { className: "h-4 w-4" }),
						label: t("dash.humidity"),
						value: "58%"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-sm text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wind, { className: "h-4 w-4" }),
							" ",
							t("hist.aqChart")
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 h-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
								data: sample,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "prev",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "0%",
											stopColor: theme.hex,
											stopOpacity: .5
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "100%",
											stopColor: theme.hex,
											stopOpacity: 0
										})]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										hide: true,
										domain: [200, 900]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "v",
										stroke: theme.hex,
										strokeWidth: 2,
										fill: "url(#prev)"
									})
								]
							})
						})
					})]
				})]
			})]
		})
	});
}
function MiniStat({ icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-sm text-muted-foreground",
			children: [icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "truncate",
				children: label
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-2xl font-semibold tabular-nums",
			children: value
		})]
	});
}
function Landing() {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Problem, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HowItWorks, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Preview, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compare, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Features, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cases, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinalCta, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-6xl gap-4 px-5 py-8 text-sm text-muted-foreground sm:flex sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("footer.rights") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/dashboard",
								className: "hover:text-foreground",
								children: t("nav.dashboard")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/auth",
								className: "hover:text-foreground",
								children: t("nav.signin")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular-nums",
								children: ["© ", (/* @__PURE__ */ new Date()).getFullYear()]
							})
						]
					})]
				})
			})
		]
	});
}
function SiteHeader() {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-40 border-b bg-background/80 backdrop-blur",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "flex min-w-0 items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wind, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block truncate font-display text-lg leading-tight",
						children: "AirSense"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden text-xs text-muted-foreground sm:block",
						children: t("brand.tagline")
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1 sm:gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "mr-2 hidden items-center gap-5 text-sm text-muted-foreground lg:flex",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#problem",
								className: "hover:text-foreground",
								children: t("nav.problem")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#how",
								className: "hover:text-foreground",
								children: t("nav.how")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#compare",
								className: "hover:text-foreground",
								children: t("nav.compare")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#features",
								className: "hover:text-foreground",
								children: t("nav.features")
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LangToggle, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						className: "rounded-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							children: t("nav.signup")
						})
					})
				]
			})]
		})
	});
}
function Hero() {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-sky-soft blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -left-24 top-56 h-72 w-72 rounded-full bg-good-soft opacity-60 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:py-24",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-5 font-display text-4xl leading-[1.12] text-ink sm:text-5xl lg:text-6xl",
						children: t("hero.title")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg",
						children: t("hero.sub")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-7 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							className: "rounded-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/auth",
								children: [
									t("hero.cta"),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 h-4 w-4" })
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							variant: "outline",
							className: "rounded-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/dashboard",
								children: t("hero.cta2")
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground",
						children: [
							"hero.badge1",
							"hero.badge2",
							"hero.badge3"
						].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-good" }),
								" ",
								t(k)
							]
						}, k))
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid place-items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BreathingOrb, {
						status: "good",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-widest text-muted-foreground",
								children: t("hero.orb.label")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-display text-4xl text-good sm:text-5xl",
								children: t("status.good")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm tabular-nums text-muted-foreground",
								children: "MQ-135 Sensor Value · 318"
							})
						]
					})
				})]
			})
		]
	});
}
function SectionHead({ kicker, title, id }) {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id,
		className: "max-w-2xl scroll-mt-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-semibold uppercase tracking-widest text-primary",
			children: t(kicker)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-3 font-display text-3xl leading-tight text-ink sm:text-4xl",
			children: t(title)
		})]
	});
}
function Problem() {
	const { t } = useI18n();
	const cards = [
		{
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-5 w-5" }),
			t: "problem.p1.t",
			d: "problem.p1.d"
		},
		{
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wind, { className: "h-5 w-5" }),
			t: "problem.p2.t",
			d: "problem.p2.d"
		},
		{
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { className: "h-5 w-5" }),
			t: "problem.p3.t",
			d: "problem.p3.d"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-y bg-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:py-24",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
					id: "problem",
					kicker: "problem.kicker",
					title: "problem.title"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 max-w-xl leading-relaxed text-muted-foreground",
					children: t("problem.body")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid gap-4",
					children: cards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 rounded-2xl border p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-soft text-primary",
							children: c.icon
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: t(c.t)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: t(c.d)
							})]
						})]
					}, c.t))
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative grid place-items-center overflow-hidden rounded-3xl border bg-background p-6 grain-panel",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoomIllustration, {})
			})]
		})
	});
}
/** Abstract "room full of unseen particles" illustration. */
function RoomIllustration() {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative w-full max-w-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 400 300",
			className: "w-full",
			role: "img",
			"aria-label": "A room with invisible particles in the air",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "20",
					y: "30",
					width: "360",
					height: "230",
					rx: "18",
					fill: "var(--sky-soft)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "48",
					y: "70",
					width: "120",
					height: "90",
					rx: "8",
					fill: "var(--background)",
					stroke: "var(--border)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "108",
					y1: "70",
					x2: "108",
					y2: "160",
					stroke: "var(--border)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "48",
					y1: "115",
					x2: "168",
					y2: "115",
					stroke: "var(--border)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "230",
					y: "150",
					width: "110",
					height: "60",
					rx: "10",
					fill: "var(--background)",
					stroke: "var(--border)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "252",
					y: "120",
					width: "66",
					height: "30",
					rx: "6",
					fill: "var(--card)",
					stroke: "var(--border)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "20",
					y: "240",
					width: "360",
					height: "20",
					rx: "6",
					fill: "color-mix(in oklab, var(--primary) 12%, transparent)"
				}),
				Array.from({ length: 34 }).map((_, i) => {
					const x = 40 + i * 61 % 330;
					const y = 55 + i * 97 % 180;
					const r = 2 + i % 4;
					const warm = i % 3 === 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: x,
						cy: y,
						r,
						fill: warm ? "var(--moderate)" : "var(--primary)",
						opacity: .35,
						className: "drift",
						style: { animationDelay: `${i % 7 * 1.3}s` }
					}, i);
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-center text-sm text-muted-foreground",
			children: t("preview.note")
		})]
	});
}
function HowItWorks() {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-6xl px-5 py-16 lg:py-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
			id: "how",
			kicker: "how.kicker",
			title: "how.title"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4",
			children: [
				{
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { className: "h-5 w-5" }),
					t: "how.s1.t",
					d: "how.s1.d"
				},
				{
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "h-5 w-5" }),
					t: "how.s2.t",
					d: "how.s2.d"
				},
				{
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "h-5 w-5" }),
					t: "how.s3.t",
					d: "how.s3.d"
				},
				{
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-5 w-5" }),
					t: "how.s4.t",
					d: "how.s4.d"
				}
			].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "relative rounded-3xl border bg-card p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-10 w-10 place-items-center rounded-xl bg-sky-soft text-primary",
						children: s.icon
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-xs font-semibold tabular-nums text-primary",
						children: ["0", i + 1]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-semibold",
						children: t(s.t)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted-foreground",
						children: t(s.d)
					})
				]
			}, s.t))
		})]
	});
}
function Preview() {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-y bg-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-5 py-16 lg:py-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
					kicker: "preview.kicker",
					title: "preview.title"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardPreview, { status: "moderate" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted-foreground",
					children: t("preview.note")
				})
			]
		})
	});
}
function Compare() {
	const { t } = useI18n();
	const rows = [
		{
			label: "compare.r1",
			cells: [
				"compare.r1c1",
				"compare.r1c2",
				"compare.r1c3",
				"compare.r1c4"
			]
		},
		{
			label: "compare.r2",
			cells: [
				false,
				true,
				false,
				true
			]
		},
		{
			label: "compare.r3",
			cells: [
				false,
				"partial",
				false,
				true
			]
		},
		{
			label: "compare.r4",
			cells: [
				false,
				"partial",
				true,
				true
			]
		},
		{
			label: "compare.r5",
			cells: [
				false,
				false,
				"partial",
				true
			]
		}
	];
	const cols = [
		"compare.col1",
		"compare.col2",
		"compare.col3",
		"compare.col4"
	];
	const cell = (v) => {
		if (v === true) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mx-auto h-5 w-5 text-good" });
		if (v === false) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "mx-auto h-5 w-5 text-muted-foreground/60" });
		if (v === "partial") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs text-moderate",
			children: t("compare.partial")
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs",
			children: t(v)
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "compare",
		className: "mx-auto max-w-6xl scroll-mt-24 px-5 py-16 lg:py-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
			kicker: "compare.kicker",
			title: "compare.title"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 overflow-x-auto rounded-3xl border bg-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-160 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-4 text-left font-medium text-muted-foreground",
						children: " "
					}), cols.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: `p-4 text-center font-semibold ${i === 3 ? "bg-sky-soft text-primary" : "text-foreground"}`,
						children: t(c)
					}, c))]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b last:border-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "p-4 text-left font-medium",
						children: t(r.label)
					}), r.cells.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: `p-4 text-center ${i === 3 ? "bg-sky-soft/60" : ""}`,
						children: cell(c)
					}, i))]
				}, r.label)) })]
			})
		})]
	});
}
function Features() {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-y bg-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-5 py-16 lg:py-24",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
				id: "features",
				kicker: "features.kicker",
				title: "features.title"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					{
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-5 w-5" }),
						t: "features.f1.t",
						d: "features.f1.d"
					},
					{
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "h-5 w-5" }),
						t: "features.f2.t",
						d: "features.f2.d"
					},
					{
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-5 w-5" }),
						t: "features.f3.t",
						d: "features.f3.d"
					},
					{
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-5 w-5" }),
						t: "features.f4.t",
						d: "features.f4.d"
					},
					{
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-5 w-5" }),
						t: "features.f5.t",
						d: "features.f5.d"
					},
					{
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Languages, { className: "h-5 w-5" }),
						t: "features.f6.t",
						d: "features.f6.d"
					}
				].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border bg-background p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-10 w-10 place-items-center rounded-xl bg-good-soft text-good",
							children: f.icon
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 font-semibold",
							children: t(f.t)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted-foreground",
							children: t(f.d)
						})
					]
				}, f.t))
			})]
		})
	});
}
function Cases() {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-6xl px-5 py-16 lg:py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
				kicker: "cases.kicker",
				title: "cases.title"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid gap-4 lg:grid-cols-3",
				children: [
					{
						t: "cases.c1.t",
						d: "cases.c1.d",
						status: "poor"
					},
					{
						t: "cases.c2.t",
						d: "cases.c2.d",
						status: "moderate"
					},
					{
						t: "cases.c3.t",
						d: "cases.c3.d",
						status: "good"
					}
				].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-3xl border bg-card p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreathingOrb, {
							status: c.status,
							size: "sm",
							className: "h-24! w-24!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 font-semibold",
							children: t(c.t)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted-foreground",
							children: t(c.d)
						})
					]
				}, c.t))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm text-muted-foreground",
				children: t("cases.note")
			})
		]
	});
}
function FinalCta() {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-6xl px-5 pb-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative overflow-hidden rounded-[2rem] border bg-card px-6 py-14 text-center grain-panel",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: "mx-auto h-10 w-10 text-primary" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 font-display text-3xl text-ink sm:text-4xl",
					children: t("cta.title")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-3 max-w-xl text-muted-foreground",
					children: t("cta.sub")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "lg",
					className: "mt-7 rounded-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/auth",
						children: [
							t("nav.signup"),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 h-4 w-4" })
						]
					})
				})
			]
		})
	});
}
//#endregion
export { Landing as component };
