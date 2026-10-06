import { i as __toESM } from "../_runtime.mjs";
import { c as require_react, n as SignIn, r as SignUp } from "../_libs/@clerk/clerk-react+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { S as useSearch, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as CircleCheck, P as Droplets, X as Activity, l as Thermometer, n as Wind, r as Wifi } from "../_libs/lucide-react.mjs";
import { t as LangToggle } from "./LangToggle-j5mbIzjI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-BekM2u4v.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Shared Clerk component appearance config */
var clerkAppearance = {
	variables: {
		colorPrimary: "#22d3ee",
		colorBackground: "rgba(10,20,28,0)",
		colorText: "#f1f5f9",
		colorTextSecondary: "#94a3b8",
		colorInputBackground: "rgba(255,255,255,0.06)",
		colorInputText: "#f1f5f9",
		borderRadius: "8px",
		colorNeutral: "#64748b"
	},
	elements: {
		rootBox: "w-full",
		card: "bg-transparent shadow-none border-0 p-0 w-full",
		header: "hidden",
		headerTitle: "hidden",
		headerSubtitle: "hidden",
		socialButtonsBlockButton: "border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all duration-200 rounded-lg h-8.5 text-xs font-medium",
		socialButtonsBlockButtonText: "text-xs font-medium",
		dividerRow: "my-1.5",
		dividerText: "text-white/30 text-[10px]",
		dividerLine: "bg-white/10",
		formFieldRow: "mb-1.5",
		formFieldLabel: "text-[11px] font-medium text-white/60 mb-0.5",
		formFieldInput: "bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg h-8.5 px-3 text-xs focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all",
		formButtonPrimary: "bg-linear-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-bold rounded-lg h-8.5 text-xs transition-all duration-200 shadow-lg shadow-cyan-500/20 mt-1",
		footerAction: "mt-1.5 flex justify-center",
		footerActionText: "text-white/50 text-xs",
		footerActionLink: "text-cyan-400 hover:text-cyan-300 font-semibold text-xs ml-1 cursor-pointer",
		footer: "mt-1",
		identityPreviewText: "text-white/70 text-xs",
		identityPreviewEditButton: "text-cyan-400 text-xs",
		formResendCodeLink: "text-cyan-400 text-xs",
		alert: "rounded-lg border border-red-500/20 bg-red-500/10 p-1.5 my-1",
		alertText: "text-red-400 text-xs"
	}
};
/** Floating radar ring animation behind the monitoring preview */
function RadarRings() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-0 flex items-center justify-center",
		children: [
			1,
			2,
			3
		].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute rounded-full border border-cyan-400/10 animate-ping",
			style: {
				width: `${i * 28}%`,
				height: `${i * 28}%`,
				animationDuration: `${3 + i * .7}s`
			}
		}, i))
	});
}
/** Mini sensor reading tile */
function SensorTile({ icon, label, value, unit, color = "text-primary" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 rounded-lg bg-white/5 p-1.5 sm:p-2 border border-white/5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: color,
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[9px] text-white/40",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-xs font-semibold text-white",
			children: [value, unit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[9px] text-white/50 ml-0.5",
				children: unit
			})]
		})] })]
	});
}
/** Interactive Air Quality Live Preview widget */
function MonitoringPreview() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative w-full max-w-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute -inset-6 pointer-events-none",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadarRings, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-slate-900/80 border border-cyan-400/20 backdrop-blur-xl relative overflow-hidden rounded-xl p-3 sm:p-3.5 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -top-6 right-4 h-14 w-14 rounded-full bg-cyan-400/20 blur-xl" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute bottom-0 left-6 h-12 w-12 rounded-full bg-emerald-400/15 blur-lg" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[9px] font-semibold uppercase tracking-widest text-white/40",
						children: "Air Quality"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base font-bold text-emerald-400",
						children: "Good"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-semibold text-emerald-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, { className: "h-2.5 w-2.5" }), "Live"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1.5 flex items-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-2xl sm:text-3xl font-black leading-none text-white",
						children: "92"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[9px] font-medium text-white/40",
							children: "AQI Score"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[9px] text-emerald-400",
							children: "MQ-135 Sensor"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full rounded-full bg-linear-to-r from-emerald-400 to-cyan-400",
						style: { width: "30%" }
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-0.5 flex justify-between text-[8px] text-white/30",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Good" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Moderate" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Poor" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 grid grid-cols-2 gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SensorTile, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thermometer, { className: "h-3 w-3" }),
						label: "Temperature",
						value: "28",
						unit: "°C",
						color: "text-orange-400"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SensorTile, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplets, { className: "h-3 w-3" }),
						label: "Humidity",
						value: "61",
						unit: "%",
						color: "text-cyan-400"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex items-center gap-1.5 border-t border-white/5 pt-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-2.5 w-2.5 text-white/30" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[9px] text-white/40",
						children: "AirSense IoT · Live stream"
					})]
				})
			]
		})]
	});
}
function AuthPage() {
	const search = useSearch({ from: "/auth" });
	const [mode, setMode] = (0, import_react.useState)("signin");
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined" && window.location.hash.includes("signup")) setMode("signup");
		else if (search.mode === "signup") setMode("signup");
		const handleHashChange = () => {
			if (typeof window !== "undefined") setMode(window.location.hash.includes("signup") ? "signup" : "signin");
		};
		window.addEventListener("hashchange", handleHashChange);
		return () => window.removeEventListener("hashchange", handleHashChange);
	}, [search.mode]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-slate-950 min-h-screen lg:h-screen flex flex-col justify-between relative overflow-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -top-20 -left-10 w-96 h-96 sm:w-125 sm:h-125 rounded-full bg-cyan-500/10 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute bottom-5 right-1/4 w-80 h-80 sm:w-100 sm:h-100 rounded-full bg-emerald-500/10 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute top-1/3 -right-10 w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-cyan-400/10 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between z-20 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "inline-flex items-center gap-2.5 text-decoration-none group",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid place-items-center w-8 h-8 rounded-xl bg-linear-to-br from-cyan-400 to-cyan-600 text-slate-950 shadow-md shadow-cyan-400/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wind, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-lg sm:text-xl font-bold text-slate-100 tracking-tight",
						children: "AirSense"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LangToggle, { variant: "outline" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-4 lg:gap-10 z-10 min-h-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:hidden w-full max-w-md mx-auto text-center space-y-1.5 mb-1 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "text-xl sm:text-2xl font-extrabold text-white tracking-tight",
							children: [
								"Know Your Air.",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "bg-linear-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent",
									children: "Breathe Better."
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-medium shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Real-Time IoT Sensor Dashboard" })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden lg:flex flex-1 flex-col justify-center space-y-3 xl:space-y-4 max-w-lg text-left",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight",
									children: [
										"Know Your Air.",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "bg-linear-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent",
											children: "Breathe Better."
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs sm:text-sm text-white/70 leading-relaxed max-w-md",
									children: "Real-time indoor air quality monitoring for healthier homes, classrooms, offices, and smart spaces."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-1 pt-0.5",
								children: [
									"Real-time MQ-135 & DHT22 monitoring",
									"Temperature & humidity analytics",
									"Smart air-quality alerts & insights"
								].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-2 text-xs sm:text-sm text-white/80 font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: f })]
								}, f))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pt-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonitoringPreview, {})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full max-w-sm sm:max-w-md shrink-0 mx-auto lg:mx-0 flex flex-col justify-center my-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative bg-slate-900/90 border border-cyan-400/15 rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-2xl w-full max-h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden scrollbar-thin [scrollbar-color:rgba(255,255,255,0.15)_transparent]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -top-8 left-1/2 h-24 w-40 -translate-x-1/2 rounded-full bg-cyan-500/15 blur-2xl" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center text-center mb-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 mb-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wind, { className: "h-3 w-3 text-cyan-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-semibold text-cyan-300 tracking-wider uppercase",
												children: mode === "signin" ? "Sign In" : "Register"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "text-base sm:text-lg font-bold text-white tracking-tight",
											children: mode === "signin" ? "Welcome back" : "Create your account"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-white/60",
											children: mode === "signin" ? "Sign in to continue monitoring your indoor air." : "Start monitoring indoor air quality in real time."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-full flex justify-center",
									children: mode === "signin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignIn, {
										routing: "hash",
										signUpUrl: "#signup",
										fallbackRedirectUrl: "/dashboard",
										appearance: clerkAppearance
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignUp, {
										routing: "hash",
										signInUrl: "#signin",
										fallbackRedirectUrl: "/dashboard",
										appearance: clerkAppearance
									})
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between text-[11px] text-white/40 z-20 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" AirSense"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "hover:text-cyan-400 transition-colors",
							children: "Home"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-emerald-400/90 flex items-center gap-1 font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" }), "Sensors Online"]
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { AuthPage as component };
