import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { D as Languages } from "../_libs/lucide-react.mjs";
import { i as useI18n } from "./router-DPkWkbV_.mjs";
import { t as Button } from "./router-DPkWkbV_2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/LangToggle-j5mbIzjI.js
var import_jsx_runtime = require_jsx_runtime();
function LangToggle({ variant = "ghost" }) {
	const { lang, setLang, t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant,
		size: "sm",
		className: "gap-2 rounded-full",
		onClick: () => setLang(lang === "te" ? "en" : "te"),
		"aria-label": "Toggle language",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Languages, { className: "h-4 w-4" }), t("lang.toggle")]
	});
}
//#endregion
export { LangToggle as t };
