import "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as cn } from "./site-header-CURaYjxi.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-11 w-full rounded-md border border-line bg-surface px-3.5 text-sm text-ink placeholder:text-subtle outline-none transition-shadow focus:ring-2 focus:ring-accent/30", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-32 w-full rounded-lg border border-line bg-surface px-3.5 py-3 text-sm text-ink placeholder:text-subtle outline-none transition-shadow focus:ring-2 focus:ring-accent/30", className),
		...props
	});
}
//#endregion
export { Textarea as n, Input as t };
