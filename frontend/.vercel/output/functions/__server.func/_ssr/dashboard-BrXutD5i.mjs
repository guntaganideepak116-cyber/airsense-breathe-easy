import { i as __toESM } from "../_runtime.mjs";
import { a as useClerk, c as require_react, i as useAuth } from "../_libs/@clerk/clerk-react+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { b as Link, g as Outlet, p as useRouterState, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as HeartPulse, C as MapPin, H as ChevronRight, J as ArrowLeft, M as Gauge, N as Ellipsis, S as Menu, T as LogOut, i as WifiOff, k as History, m as Settings, n as Wind, t as X, z as CloudSun } from "../_libs/lucide-react.mjs";
import { i as useI18n, r as cn } from "./router-DPkWkbV_.mjs";
import { t as LangToggle } from "./LangToggle-j5mbIzjI.mjs";
import { t as formatTime } from "./status-Ba2cWdOL.mjs";
import { f as useSelectedDevice, i as setAuthTokenGetter, n as cachedReading } from "./queries-Dt74LbKo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-BrXutD5i.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var navItems = [
	{
		to: "/dashboard",
		label: "dash.overview",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { className: "h-4 w-4" })
	},
	{
		to: "/dashboard/history",
		label: "dash.history",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-4 w-4" })
	},
	{
		to: "/dashboard/recommendations",
		label: "dash.recommendations",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeartPulse, { className: "h-4 w-4" })
	},
	{
		to: "/dashboard/weather",
		label: "dash.weather",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudSun, { className: "h-4 w-4" })
	},
	{
		to: "/dashboard/rooms",
		label: "dash.rooms",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4" })
	},
	{
		to: "/dashboard/settings",
		label: "dash.settings",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-4 w-4" })
	}
];
var mobilePrimaryNavItems = [
	{
		to: "/dashboard",
		label: "nav.mob.overview",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { className: "h-5 w-5" })
	},
	{
		to: "/dashboard/history",
		label: "nav.mob.history",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-5 w-5" })
	},
	{
		to: "/dashboard/rooms",
		label: "nav.mob.rooms",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-5 w-5" })
	},
	{
		to: "/dashboard/weather",
		label: "nav.mob.weather",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudSun, { className: "h-5 w-5" })
	}
];
function DashboardLayout() {
	const { t, lang } = useI18n();
	const { deviceId } = useSelectedDevice();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [online, setOnline] = (0, import_react.useState)(true);
	const [lastSeen, setLastSeen] = (0, import_react.useState)(null);
	const [isMenuOpen, setIsMenuOpen] = (0, import_react.useState)(false);
	const clerk = useClerk();
	const { isLoaded, isSignedIn, getToken } = useAuth();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (isLoaded && !isSignedIn) navigate({ to: "/auth" });
	}, [
		isLoaded,
		isSignedIn,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		setAuthTokenGetter(getToken);
	}, [getToken]);
	(0, import_react.useEffect)(() => {
		const update = () => {
			setOnline(navigator.onLine);
			const cached = deviceId ? cachedReading(deviceId) : null;
			setLastSeen(cached?.timestamp ?? null);
		};
		update();
		window.addEventListener("online", update);
		window.addEventListener("offline", update);
		return () => {
			window.removeEventListener("online", update);
			window.removeEventListener("offline", update);
		};
	}, [deviceId]);
	(0, import_react.useEffect)(() => {
		setIsMenuOpen(false);
	}, [pathname]);
	const handleLogout = async () => {
		setIsMenuOpen(false);
		try {
			await clerk.signOut();
		} catch (err) {
			console.error("Sign out error:", err);
		}
		window.location.href = "/";
	};
	if (!isLoaded) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Authenticating session..."
			})]
		})
	});
	if (!isSignedIn) return null;
	const isMoreActive = pathname === "/dashboard/recommendations" || pathname === "/dashboard/settings";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground md:flex",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "hidden w-64 shrink-0 flex-col justify-between border-r bg-card/60 p-5 backdrop-blur md:flex",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-3 px-2 py-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wind, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl leading-tight",
							children: "AirSense"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs text-muted-foreground",
							children: t("brand.tagline")
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "mt-8 space-y-1.5",
					children: navItems.map((n) => {
						const active = pathname === n.to || n.to === "/dashboard" && pathname === "/dashboard/";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: n.to,
							activeOptions: { exact: n.to === "/dashboard" },
							className: cn("flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200", active ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"),
							children: [n.icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: t(n.label)
							})]
						}, n.to);
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 border-t pt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "Language"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LangToggle, { variant: "outline" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex w-full items-center justify-center gap-2 rounded-2xl border bg-secondary/50 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), t("nav.backHome")]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 flex-col min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "sticky top-0 z-30 flex items-center justify-between border-b bg-background/95 px-4 py-2.5 backdrop-blur md:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex items-center gap-2 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wind, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-base font-bold text-foreground truncate",
								children: "AirSense"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LangToggle, { variant: "outline" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setIsMenuOpen(true),
								className: "flex h-9 w-9 items-center justify-center rounded-xl border bg-secondary/60 text-foreground hover:bg-secondary active:scale-95 transition-all",
								"aria-label": "Open Navigation Menu",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
							})]
						})]
					}),
					!online && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-center gap-2 bg-moderate-soft px-4 py-2 text-xs text-moderate-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WifiOff, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "truncate",
							children: [
								t("dash.offlineBanner"),
								" ",
								lastSeen ? formatTime(lastSeen, lang) : "—"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "flex-1 space-y-6 px-4 py-5 pb-[calc(6rem+env(safe-area-inset-bottom,0px))] md:px-8 md:py-8 md:pb-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t bg-card/95 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur shadow-lg md:hidden",
				children: [mobilePrimaryNavItems.map((n) => {
					const active = pathname === n.to || n.to === "/dashboard" && pathname === "/dashboard/";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: n.to,
						activeOptions: { exact: n.to === "/dashboard" },
						className: cn("flex min-w-0 flex-1 flex-col items-center justify-center min-h-12 py-1.5 transition-colors", active ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"),
						children: [n.icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 w-full truncate px-0.5 text-center text-[10px] sm:text-xs",
							children: t(n.label)
						})]
					}, n.to);
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setIsMenuOpen(true),
					className: cn("flex min-w-0 flex-1 flex-col items-center justify-center min-h-12 py-1.5 transition-colors relative", isMoreActive || isMenuOpen ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"),
					"aria-label": "Open More Navigation Options",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "h-5 w-5" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 w-full truncate px-0.5 text-center text-[10px] sm:text-xs",
							children: t("nav.mob.more")
						}),
						isMoreActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-1.5 right-1/4 h-2 w-2 rounded-full bg-primary ring-2 ring-card" })
					]
				})]
			}),
			isMenuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50 md:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200",
					onClick: () => setIsMenuOpen(false),
					"aria-hidden": "true"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-3xl border-t bg-card p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] shadow-2xl animate-in slide-in-from-bottom duration-250 overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-bold text-foreground",
								children: t("nav.mob.menu")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "AirSense PWA Navigation"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setIsMenuOpen(false),
								className: "flex h-9 w-9 items-center justify-center rounded-full border bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors",
								"aria-label": "Close menu",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Dashboard Sections"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-2",
								children: navItems.map((n) => {
									const active = pathname === n.to || n.to === "/dashboard" && pathname === "/dashboard/";
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: n.to,
										onClick: () => setIsMenuOpen(false),
										activeOptions: { exact: n.to === "/dashboard" },
										className: cn("flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all", active ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "bg-secondary/40 text-foreground hover:bg-secondary/80"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cn("grid h-8 w-8 place-items-center rounded-xl", active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-background text-primary"),
												children: n.icon
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t(n.label) })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: cn("h-4 w-4", active ? "text-primary-foreground/70" : "text-muted-foreground") })]
									}, n.to);
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 border-t pt-4 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
									children: t("set.account")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between rounded-2xl border bg-background/50 px-4 py-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-medium text-foreground",
										children: t("set.lang")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LangToggle, { variant: "outline" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/",
									onClick: () => setIsMenuOpen(false),
									className: "flex w-full items-center justify-center gap-2 rounded-2xl border bg-secondary/50 py-2.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), t("nav.backHome")]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: handleLogout,
									className: "flex w-full items-center justify-between rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/20 active:scale-[0.99] transition-all",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "grid h-8 w-8 place-items-center rounded-xl bg-destructive/20 text-destructive",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-left",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold leading-none",
												children: t("nav.logout")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-[11px] text-destructive/80 leading-none",
												children: t("nav.logoutDesc")
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-destructive/60" })]
								})
							]
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { DashboardLayout as component };
