import { i as __toESM } from "../_runtime.mjs";
import { c as require_react } from "../_libs/@clerk/clerk-react+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as cn } from "./router-DPkWkbV_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/input-ft3feVIc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LANG_KEY = "airsense-lang";
var PREF_KEY = "airsense-push-enabled";
function pushSupported() {
	return typeof window !== "undefined" && "Notification" in window && "serviceWorker" in navigator && "PushManager" in window;
}
function pushState() {
	if (!pushSupported()) return "unsupported";
	return Notification.permission;
}
function pushPreference() {
	try {
		return localStorage.getItem(PREF_KEY) === "1";
	} catch {
		return false;
	}
}
function setPushPreference(on) {
	try {
		localStorage.setItem(PREF_KEY, on ? "1" : "0");
	} catch {}
}
function urlBase64ToUint8Array(base64String) {
	const base64 = (base64String + "=".repeat((4 - base64String.length % 4) % 4)).replace(/-/g, "+").replace(/_/g, "/");
	const raw = atob(base64);
	return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}
async function getRegistration() {
	if (!("serviceWorker" in navigator)) return null;
	return await navigator.serviceWorker.getRegistration() ?? null;
}
/** Requests permission and registers a push subscription. Returns the resulting state. */
async function enablePush() {
	if (!pushSupported()) return "unsupported";
	const permission = await Notification.requestPermission();
	if (permission !== "granted") {
		setPushPreference(false);
		return permission;
	}
	setPushPreference(true);
	const registration = await getRegistration();
	if (registration && "pushManager" in registration) try {
		const { publicKey } = await fetch("/api/push/vapid").then((r) => r.json());
		const subscription = await registration.pushManager.getSubscription() ?? await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: urlBase64ToUint8Array(publicKey)
		});
		await fetch("/api/push/subscribe", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				...subscription.toJSON(),
				lang: localStorage.getItem(LANG_KEY) === "en" ? "en" : "te"
			})
		});
	} catch {}
	return "granted";
}
async function disablePush() {
	setPushPreference(false);
	const subscription = await (await getRegistration())?.pushManager?.getSubscription();
	if (subscription) {
		await fetch("/api/push/subscribe", {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ endpoint: subscription.endpoint })
		}).catch(() => {});
		await subscription.unsubscribe().catch(() => {});
	}
}
/**
* Shows an alert for a locally detected poor-air event.
* Uses the service worker when one is active so the click opens the right room.
*/
async function showAirAlert(opts) {
	if (!pushSupported() || Notification.permission !== "granted" || !pushPreference()) return;
	const url = `/dashboard/rooms?room=${encodeURIComponent(opts.deviceId)}`;
	const registration = await getRegistration();
	const options = {
		body: opts.body,
		icon: "/icons/icon-192.png",
		lang: opts.lang,
		tag: opts.deviceId,
		data: { url }
	};
	if (registration) await registration.showNotification(opts.title, options);
	else new Notification(opts.title, options);
}
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
//#endregion
export { pushState as a, pushPreference as i, disablePush as n, showAirAlert as o, enablePush as r, Input as t };
