import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as cn } from "./router-DPkWkbV_.mjs";
import { n as statusTheme } from "./status-Ba2cWdOL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/BreathingOrb-9Kiv-YL2.js
var import_jsx_runtime = require_jsx_runtime();
/**
* The "breathing room" motif: concentric soft rings that expand and contract
* like a slow breath, tinted by the current air status.
*/
function BreathingOrb({ status = "good", size = "lg", className, children }) {
	const theme = statusTheme[status];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative grid place-items-center", size === "lg" ? "h-72 w-72 sm:h-96 sm:w-96" : "h-40 w-40", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("absolute inset-0 rounded-full opacity-40 blur-2xl breathe-slow status-transition", theme.soft) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("absolute inset-[12%] rounded-full opacity-60 breathe status-transition", theme.soft) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-[24%] rounded-full border status-transition",
				style: {
					borderColor: theme.hex,
					opacity: .35
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-[36%] rounded-full breathe status-transition",
				style: { background: `color-mix(in oklab, ${theme.hex} 18%, transparent)` }
			}),
			[
				0,
				1,
				2,
				3,
				4
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute rounded-full drift",
				style: {
					background: theme.hex,
					opacity: .25,
					width: 6 + i * 2,
					height: 6 + i * 2,
					top: `${18 + i * 14}%`,
					left: `${12 + i * 23 % 70}%`,
					animationDelay: `${i * 1.7}s`
				}
			}, i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative z-10 text-center",
				children
			})
		]
	});
}
//#endregion
export { BreathingOrb as t };
