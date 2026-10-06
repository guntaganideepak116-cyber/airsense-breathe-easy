import { i as __toESM } from "../_runtime.mjs";
import { c as require_react } from "../_libs/@clerk/clerk-react+[...].mjs";
import { i as useI18n } from "./router-DPkWkbV_.mjs";
import { o as showAirAlert } from "./input-ft3feVIc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-air-alert-BG53I9XP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/**
* Fires a localized notification the first time a room's air turns poor.
* Language follows the app preference — Telugu by default.
*/
function useAirAlert(reading, deviceName) {
	const { t, lang } = useI18n();
	const previous = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!reading) return;
		const was = previous.current;
		previous.current = reading.status;
		if (reading.status !== "poor" || was === "poor" || was === null) return;
		showAirAlert({
			title: `${deviceName ?? t("dash.device")} — ${t("status.poor")}`,
			body: `${t("dash.sensorReading")}: ${reading.mq135} · ${t("status.poor.advice")}`,
			deviceId: reading.deviceId,
			lang
		});
	}, [
		reading,
		deviceName,
		t,
		lang
	]);
}
//#endregion
export { useAirAlert as t };
