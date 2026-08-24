import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as useCurrentUser } from "./site-header-CURaYjxi.mjs";
import { n as StudioShell, t as CreditsChip } from "./studio-shell-DJYc4a9T.mjs";
import { n as getProfile, r as listCreditEvents } from "./profile-D9UqmnTx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-DIL4hThD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Account() {
	const user = useCurrentUser();
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [events, setEvents] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		Promise.all([getProfile(), listCreditEvents()]).then(([p, e]) => {
			setProfile(p);
			setEvents(e);
		}).catch(() => {});
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StudioShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl font-semibold tracking-tight",
			children: "Account"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: user?.primaryEmail || user?.displayName
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: profile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditsChip, {
				credits: profile.credits,
				plan: profile.plan
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: profile ? `${profile.videosThisMonth} / ${profile.videoLimit} videos this cycle` : ""
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-10 font-display text-lg font-semibold",
			children: "Credit history"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "mt-3 divide-y divide-line rounded-xl border border-line bg-surface",
			children: [events.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "p-4 text-sm text-muted",
				children: "No credit events yet."
			}), events.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center justify-between p-4 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: e.reason }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: `tabular-nums ${e.amount < 0 ? "text-danger" : "text-ok"}`,
					children: [e.amount > 0 ? "+" : "", e.amount]
				})]
			}, e.id))]
		})
	] });
}
//#endregion
export { Account as component };
