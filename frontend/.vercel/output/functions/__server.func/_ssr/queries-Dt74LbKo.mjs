import { i as __toESM } from "../_runtime.mjs";
import { c as require_react } from "../_libs/@clerk/clerk-react+[...].mjs";
import { a as useQueryClient, n as useQuery, r as useQueries, t as useMutation } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/queries-Dt74LbKo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var API_BASE_URL = (typeof import.meta !== "undefined" && {
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
} ? {
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
}["VITE_API_URL"] || {
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
}["NEXT_PUBLIC_API_URL"] : void 0) || "";
function resolveUrl(path) {
	if (path.startsWith("http://") || path.startsWith("https://")) return path;
	return `${API_BASE_URL.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}
var tokenGetter = null;
function setAuthTokenGetter(getter) {
	tokenGetter = getter;
}
async function tryFetch(url, init) {
	try {
		const fullUrl = resolveUrl(url);
		const headers = {
			"Content-Type": "application/json",
			...init?.headers
		};
		if (!headers["Authorization"] && !headers["authorization"]) {
			let token = null;
			if (tokenGetter) token = await tokenGetter();
			else if (typeof window !== "undefined" && window.Clerk?.session) token = await window.Clerk.session.getToken();
			if (token) headers["Authorization"] = `Bearer ${token}`;
		}
		const res = await fetch(fullUrl, {
			...init,
			headers
		});
		if (!res.ok) return null;
		return await res.json();
	} catch {
		return null;
	}
}
var api = {
	async devices() {
		return await tryFetch("/api/devices") ?? [];
	},
	/**
	* Registers a device in MongoDB. Returns deviceId + apiKey once.
	*/
	async createDevice(name) {
		const res = await tryFetch("/api/devices", {
			method: "POST",
			body: JSON.stringify({ name })
		});
		if (!res) throw new Error("Failed to register device with backend");
		const { apiKey, ...device } = res;
		return {
			device,
			apiKey
		};
	},
	async updateDevice(id, patch) {
		await tryFetch(`/api/devices/${id}`, {
			method: "PATCH",
			body: JSON.stringify(patch)
		});
	},
	async removeDevice(id) {
		await tryFetch(`/api/devices/${id}`, { method: "DELETE" });
	},
	async latest(deviceId) {
		return await tryFetch(`/api/device/latest?deviceId=${encodeURIComponent(deviceId)}`);
	},
	async history(deviceId, range) {
		return await tryFetch(`/api/device/history?range=${range}&deviceId=${encodeURIComponent(deviceId)}`) ?? [];
	},
	async subscribePush(subscription) {
		await tryFetch("/api/push/subscribe", {
			method: "POST",
			body: JSON.stringify(subscription)
		});
	},
	async unsubscribePush() {
		await tryFetch("/api/push/subscribe", { method: "DELETE" });
	},
	async getAlertPreferences() {
		return await tryFetch("/api/user/alert-preferences") ?? {
			phoneNumber: "",
			whatsappNumber: "",
			email: "",
			alertChannels: {
				sms: true,
				whatsapp: true,
				email: true
			},
			threshold: 700
		};
	},
	async updateAlertPreferences(patch) {
		return await tryFetch("/api/user/alert-preferences", {
			method: "PATCH",
			body: JSON.stringify(patch)
		}) ?? {
			phoneNumber: patch.phoneNumber ?? "",
			whatsappNumber: patch.whatsappNumber ?? "",
			email: patch.email ?? "",
			alertChannels: patch.alertChannels ?? {
				sms: true,
				whatsapp: true,
				email: true
			},
			threshold: patch.threshold ?? 700
		};
	}
};
var CACHE_KEY = "airsense-last-reading";
function cacheReading(r) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(`${CACHE_KEY}-${r.deviceId}`, JSON.stringify(r));
	} catch {}
}
function cachedReading(deviceId) {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(`${CACHE_KEY}-${deviceId}`);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
var RANK = {
	good: 0,
	moderate: 1,
	poor: 2
};
function statusRank(status) {
	return RANK[status];
}
/** Slope of the last few readings, used to phrase guidance as declining/improving. */
function trendOf(points, window = 6) {
	if (!points || points.length < 3) return "steady";
	const tail = points.slice(-window);
	const first = tail.slice(0, Math.ceil(tail.length / 2));
	const last = tail.slice(Math.ceil(tail.length / 2));
	const avg = (xs) => xs.reduce((s, p) => s + p.mq135, 0) / xs.length;
	const delta = avg(last) - avg(first);
	if (delta > 25) return "rising";
	if (delta < -25) return "falling";
	return "steady";
}
/** Guidance text key chosen from the live status plus the recent trend. */
function actionKey(status, trend) {
	if (status === "poor") return trend === "falling" ? "action.poorFalling" : "action.poor";
	if (status === "moderate") {
		if (trend === "rising") return "action.moderateRising";
		if (trend === "falling") return "action.moderateFalling";
		return "action.moderate";
	}
	return trend === "rising" ? "action.goodRising" : "action.good";
}
var SELECTED_KEY = "airsense-selected-device";
function useDevices() {
	return useQuery({
		queryKey: ["devices"],
		queryFn: api.devices
	});
}
function useSelectedDevice() {
	const { data: devices } = useDevices();
	const [selected, setSelected] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const saved = localStorage.getItem(SELECTED_KEY);
		if (saved) setSelected(saved);
	}, []);
	const id = selected && devices?.some((d) => d.id === selected) ? selected : devices?.[0]?.id ?? null;
	const select = (deviceId) => {
		localStorage.setItem(SELECTED_KEY, deviceId);
		setSelected(deviceId);
	};
	return {
		devices: devices ?? [],
		deviceId: id,
		device: devices?.find((d) => d.id === id) ?? null,
		select
	};
}
/** Polls the latest real reading from MongoDB. */
function useLatest(deviceId) {
	const query = useQuery({
		queryKey: ["latest", deviceId],
		queryFn: () => deviceId ? api.latest(deviceId) : null,
		enabled: !!deviceId,
		refetchInterval: 1e4,
		placeholderData: (prev) => prev ?? (deviceId ? cachedReading(deviceId) ?? void 0 : void 0)
	});
	(0, import_react.useEffect)(() => {
		if (query.data) cacheReading(query.data);
	}, [query.data]);
	return query;
}
function useHistory(deviceId, range) {
	return useQuery({
		queryKey: [
			"history",
			deviceId,
			range
		],
		queryFn: () => deviceId ? api.history(deviceId, range) : [],
		enabled: !!deviceId
	});
}
/**
* Live readings over Server-Sent Events (`/api/device/:id/stream`).
* Reconnects with exponential backoff and always closes the connection on unmount.
*/
function useDeviceStream(deviceId) {
	const qc = useQueryClient();
	const [reading, setReading] = (0, import_react.useState)(null);
	const [status, setStatus] = (0, import_react.useState)("connecting");
	const [tick, setTick] = (0, import_react.useState)(0);
	const attempts = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		if (!deviceId || typeof window === "undefined" || typeof EventSource === "undefined") {
			setReading(null);
			return;
		}
		let source = null;
		let retryTimer;
		let cancelled = false;
		const cached = cachedReading(deviceId);
		if (cached) setReading(cached);
		const connect = () => {
			if (cancelled) return;
			setStatus(attempts.current === 0 ? "connecting" : "reconnecting");
			source = new EventSource(resolveUrl(`/api/device/${encodeURIComponent(deviceId)}/stream`));
			source.addEventListener("reading", (event) => {
				try {
					const next = JSON.parse(event.data);
					attempts.current = 0;
					setStatus("live");
					setReading(next);
					setTick((n) => n + 1);
					cacheReading(next);
					qc.setQueryData(["latest", deviceId], next);
				} catch {}
			});
			source.onerror = () => {
				source?.close();
				source = null;
				if (cancelled) return;
				setStatus("reconnecting");
				const delay = Math.min(1e3 * 2 ** attempts.current, 15e3);
				attempts.current += 1;
				retryTimer = setTimeout(connect, delay);
			};
		};
		connect();
		return () => {
			cancelled = true;
			if (retryTimer) clearTimeout(retryTimer);
			source?.close();
		};
	}, [deviceId, qc]);
	return {
		reading,
		status,
		tick
	};
}
function useDeviceMutations() {
	const qc = useQueryClient();
	const invalidate = () => qc.invalidateQueries({ queryKey: ["devices"] });
	return {
		create: useMutation({
			mutationFn: (name) => api.createDevice(name),
			onSuccess: invalidate
		}),
		rename: useMutation({
			mutationFn: ({ id, name }) => api.updateDevice(id, { name }),
			onSuccess: invalidate
		}),
		remove: useMutation({
			mutationFn: (id) => api.removeDevice(id),
			onSuccess: invalidate
		})
	};
}
function useAllLatest(deviceIds) {
	const results = useQueries({ queries: deviceIds.map((id) => ({
		queryKey: ["latest", id],
		queryFn: () => api.latest(id),
		refetchInterval: 15e3
	})) });
	return deviceIds.map((id, i) => ({
		deviceId: id,
		reading: results[i]?.data ?? null
	}));
}
function useTrend(deviceId) {
	const { data } = useHistory(deviceId, "24h");
	return trendOf(data ?? []);
}
function useUserPreferences() {
	return useQuery({
		queryKey: ["user-preferences"],
		queryFn: () => api.getAlertPreferences()
	});
}
function useUpdateUserPreferences() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (patch) => api.updateAlertPreferences(patch),
		onSuccess: (data) => {
			qc.setQueryData(["user-preferences"], data);
		}
	});
}
//#endregion
export { statusRank as a, useDeviceStream as c, useLatest as d, useSelectedDevice as f, useUserPreferences as h, setAuthTokenGetter as i, useDevices as l, useUpdateUserPreferences as m, cachedReading as n, useAllLatest as o, useTrend as p, resolveUrl as r, useDeviceMutations as s, actionKey as t, useHistory as u };
