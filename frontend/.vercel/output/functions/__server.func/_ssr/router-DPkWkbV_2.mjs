import { i as __toESM } from "../_runtime.mjs";
import { c as require_react, t as ClerkProvider } from "../_libs/@clerk/clerk-react+[...].mjs";
import { r as Slot, s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { C as useRouter, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, q as redirect, v as createFileRoute, y as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { i as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { F as Download, n as Wind, t as X } from "../_libs/lucide-react.mjs";
import { i as useI18n, n as LanguageProvider, r as cn } from "./router-DPkWkbV_.mjs";
import { i as __exportAll } from "./server-DxWoROvj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DPkWkbV_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-XFmcq3zE.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var STORAGE_KEY = "airsense-theme";
/** Runs before paint in the document head so the first frame is already themed. */
var themeBootScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");var d=t!=="light";var c=document.documentElement.classList;c.toggle("dark",d);c.toggle("light",!d);}catch(e){}})();`;
function applyTheme(theme) {
	const classes = document.documentElement.classList;
	classes.toggle("dark", theme === "dark");
	classes.toggle("light", theme === "light");
}
var ThemeContext = (0, import_react.createContext)({
	theme: "dark",
	setTheme: () => {},
	toggle: () => {}
});
function ThemeProvider({ children }) {
	const [theme, setThemeState] = (0, import_react.useState)("dark");
	(0, import_react.useEffect)(() => {
		let saved = null;
		try {
			saved = localStorage.getItem(STORAGE_KEY);
		} catch {}
		const next = saved === "light" ? "light" : "dark";
		setThemeState(next);
		applyTheme(next);
	}, []);
	const setTheme = (0, import_react.useCallback)((t) => {
		setThemeState(t);
		applyTheme(t);
		try {
			localStorage.setItem(STORAGE_KEY, t);
		} catch {}
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		theme,
		setTheme,
		toggle: () => setTheme(theme === "dark" ? "light" : "dark")
	}), [theme, setTheme]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeContext.Provider, {
		value,
		children
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
function InstallPrompt() {
	const { t } = useI18n();
	const [deferred, setDeferred] = (0, import_react.useState)(null);
	const [dismissed, setDismissed] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		setDismissed(localStorage.getItem("airsense-install-dismissed") === "1");
		const handler = (e) => {
			e.preventDefault();
			setDeferred(e);
		};
		window.addEventListener("beforeinstallprompt", handler);
		return () => window.removeEventListener("beforeinstallprompt", handler);
	}, []);
	if (!deferred || dismissed) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md rounded-2xl border bg-card p-4 shadow-lg sm:inset-x-auto sm:right-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-soft text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wind, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold",
							children: t("pwa.install")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: t("pwa.installDesc")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								className: "rounded-full",
								onClick: async () => {
									await deferred.prompt();
									setDeferred(null);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1 h-4 w-4" }), t("pwa.installBtn")]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								className: "rounded-full",
								onClick: () => {
									localStorage.setItem("airsense-install-dismissed", "1");
									setDismissed(true);
								},
								children: t("pwa.later")
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					"aria-label": "Close",
					className: "text-muted-foreground hover:text-foreground",
					onClick: () => setDismissed(true),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})
			]
		})
	});
}
/**
* Single, guarded service-worker registrar.
* Never registers in dev, in an iframe, or inside any Lovable preview host —
* a stale SW there would serve deleted chunks. `?sw=off` force-unregisters.
*/
var SW_URL = "/sw.js";
function isBlockedContext() {
	if (typeof window === "undefined") return true;
	if (window.top !== window.self) return true;
	const { hostname, search } = window.location;
	if (new URLSearchParams(search).has("sw") && new URLSearchParams(search).get("sw") === "off") return true;
	if (hostname.startsWith("id-preview--") || hostname.startsWith("preview--")) return true;
	return [
		"lovableproject.com",
		"lovableproject-dev.com",
		"beta.lovable.dev"
	].some((h) => hostname === h || hostname.endsWith(`.${h}`));
}
async function unregisterAppWorkers() {
	if (!("serviceWorker" in navigator)) return;
	const registrations = await navigator.serviceWorker.getRegistrations();
	await Promise.allSettled(registrations.filter((r) => (r.active?.scriptURL ?? r.installing?.scriptURL ?? "").endsWith(SW_URL)).map((r) => r.unregister()));
}
function registerServiceWorker() {
	if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
	if (isBlockedContext()) {
		unregisterAppWorkers();
		return;
	}
	window.addEventListener("load", () => {
		navigator.serviceWorker.register(SW_URL).catch(() => {});
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$14 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{
				name: "author",
				content: "AirSense"
			},
			{
				name: "theme-color",
				content: "#0f1720"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				sizes: "any"
			},
			{
				rel: "icon",
				href: "/favicon.png",
				type: "image/png"
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/icons/icon-192.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Noto+Sans+Telugu:wght@400;500;600;700&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "dark",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: themeBootScript } })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
var PUBLISHABLE_KEY = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_API_URL": "http://localhost:5000",
	"VITE_CLERK_PUBLISHABLE_KEY": "pk_test_aGVscGVkLXN0dXJnZW9uLTUuY2xlcmsuYWNjb3VudHMuZGV2JA"
}["VITE_CLERK_PUBLISHABLE_KEY"] || "pk_test_aGVscGVkLXN0dXJnZW9uLTUuY2xlcmsuYWNjb3VudHMuZGV2JA";
function RootComponent() {
	const { queryClient } = Route$14.useRouteContext();
	(0, import_react.useEffect)(() => {
		registerServiceWorker();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClerkProvider, {
		publishableKey: PUBLISHABLE_KEY,
		afterSignOutUrl: "/",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
			client: queryClient,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LanguageProvider, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InstallPrompt, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, { position: "top-center" })
			] }) })
		})
	});
}
var $$splitComponentImporter$8 = () => import("./routes-BqNlAE3Z.mjs");
var Route$13 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "AirSense — Indoor air quality monitoring for classrooms & homes" },
		{
			name: "description",
			content: "AirSense measures the air inside classrooms, bedrooms and hostels in AP & Telangana, alerts the room instantly, and streams live readings to your phone. Telugu-first."
		},
		{
			property: "og:title",
			content: "AirSense — Indoor air quality monitoring, Telugu-first"
		},
		{
			property: "og:description",
			content: "Live room-level air quality, instant local alerts and remote dashboards for families and schools."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
/** Abstract "room full of unseen particles" illustration. */
var $$splitComponentImporter$7 = () => import("./auth-BekM2u4v.mjs");
var Route$12 = createFileRoute("/auth")({
	validateSearch: (search) => ({ mode: search["mode"] === "signup" ? "signup" : search["mode"] === "signin" ? "signin" : void 0 }),
	head: () => ({ meta: [
		{ title: "Sign in — AirSense" },
		{
			name: "description",
			content: "Sign in to AirSense to see live indoor air quality for every room you monitor."
		},
		{
			property: "og:title",
			content: "Sign in — AirSense"
		},
		{
			property: "og:description",
			content: "Access your AirSense rooms, live readings and alerts."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
/** Shared Clerk component appearance config */
/** Floating radar ring animation behind the monitoring preview */
/** Mini sensor reading tile */
/** Interactive Air Quality Live Preview widget */
var $$splitComponentImporter$6 = () => import("./dashboard-BrXutD5i.mjs");
var Route$11 = createFileRoute("/dashboard")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var Route$10 = createFileRoute("/history")({ beforeLoad: () => {
	throw redirect({ to: "/dashboard/history" });
} });
var Route$9 = createFileRoute("/recommendations")({ beforeLoad: () => {
	throw redirect({ to: "/dashboard/recommendations" });
} });
var Route$8 = createFileRoute("/rooms")({ beforeLoad: () => {
	throw redirect({ to: "/dashboard/rooms" });
} });
var Route$7 = createFileRoute("/settings")({ beforeLoad: () => {
	throw redirect({ to: "/dashboard/settings" });
} });
var Route$6 = createFileRoute("/weather")({ beforeLoad: () => {
	throw redirect({ to: "/dashboard/weather" });
} });
var $$splitComponentImporter$5 = () => import("./dashboard.index-CyOvInSm.mjs");
var Route$5 = createFileRoute("/dashboard/")({
	head: () => ({ meta: [{ title: "Live Air Quality Overview — AirSense" }, {
		name: "description",
		content: "Live room air quality status, top stats summary, and data export."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./dashboard.history-BHxL6JEN.mjs");
var Route$4 = createFileRoute("/dashboard/history")({
	head: () => ({ meta: [
		{ title: "History & trends — AirSense" },
		{
			name: "description",
			content: "Air quality, temperature and humidity trends with a log of every poor-air event."
		},
		{
			property: "og:title",
			content: "History & trends — AirSense"
		},
		{
			property: "og:description",
			content: "24-hour, 7-day and 30-day indoor air quality trends."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./dashboard.recommendations-BmXvhWFj.mjs");
var Route$3 = createFileRoute("/dashboard/recommendations")({
	head: () => ({ meta: [{ title: "Air Quality Recommendations — AirSense" }, {
		name: "description",
		content: "Contextual guidance for sensitive groups, general health, and activity safety."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./dashboard.rooms-DPbH7TVV.mjs");
var Route$2 = createFileRoute("/dashboard/rooms")({
	head: () => ({ meta: [{ title: "Sensor Locations & Floor Plan — AirSense" }, {
		name: "description",
		content: "Interactive floor plan pins and sensor hardware diagnostics."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./dashboard.settings-DLu-Ectq.mjs");
var Route$1 = createFileRoute("/dashboard/settings")({
	head: () => ({ meta: [
		{ title: "Settings — AirSense" },
		{
			name: "description",
			content: "Manage multi-channel alerts, push alerts, alert thresholds, devices and language for AirSense."
		},
		{
			property: "og:title",
			content: "Settings — AirSense"
		},
		{
			property: "og:description",
			content: "Multi-channel SMS, WhatsApp and Email notification preferences, device management and Telugu/English toggle."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./dashboard.weather-DBBmmNhg.mjs");
var Route = createFileRoute("/dashboard/weather")({
	head: () => ({ meta: [{ title: "Weather & Regional AQI — AirSense" }, {
		name: "description",
		content: "Live weather status, outdoor regional AQI, and indoor sensor comparison for AP & Telangana."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$13.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$14
});
var AuthRoute = Route$12.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$14
});
var DashboardRoute = Route$11.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => Route$14
});
var HistoryRoute = Route$10.update({
	id: "/history",
	path: "/history",
	getParentRoute: () => Route$14
});
var RecommendationsRoute = Route$9.update({
	id: "/recommendations",
	path: "/recommendations",
	getParentRoute: () => Route$14
});
var RoomsRoute = Route$8.update({
	id: "/rooms",
	path: "/rooms",
	getParentRoute: () => Route$14
});
var SettingsRoute = Route$7.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => Route$14
});
var WeatherRoute = Route$6.update({
	id: "/weather",
	path: "/weather",
	getParentRoute: () => Route$14
});
var DashboardIndexRoute = Route$5.update({
	id: "/",
	path: "/",
	getParentRoute: () => DashboardRoute
});
var DashboardRouteChildren = {
	DashboardHistoryRoute: Route$4.update({
		id: "/history",
		path: "/history",
		getParentRoute: () => DashboardRoute
	}),
	DashboardRecommendationsRoute: Route$3.update({
		id: "/recommendations",
		path: "/recommendations",
		getParentRoute: () => DashboardRoute
	}),
	DashboardRoomsRoute: Route$2.update({
		id: "/rooms",
		path: "/rooms",
		getParentRoute: () => DashboardRoute
	}),
	DashboardSettingsRoute: Route$1.update({
		id: "/settings",
		path: "/settings",
		getParentRoute: () => DashboardRoute
	}),
	DashboardWeatherRoute: Route.update({
		id: "/weather",
		path: "/weather",
		getParentRoute: () => DashboardRoute
	}),
	DashboardIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthRoute,
	DashboardRoute: DashboardRoute._addFileChildren(DashboardRouteChildren),
	HistoryRoute,
	RecommendationsRoute,
	RoomsRoute,
	SettingsRoute,
	WeatherRoute
};
var routeTree = Route$14._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter as n, router_exports as r, Button as t };
