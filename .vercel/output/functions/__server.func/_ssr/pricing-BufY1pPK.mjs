import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as useCurrentUserState, i as SiteHeader, t as Button } from "./site-header-CURaYjxi.mjs";
import { v as Check } from "../_libs/lucide-react.mjs";
import { i as upgradePlan, n as getProfile } from "./profile-D9UqmnTx.mjs";
import { n as PLANS } from "./types-Bqql5BzU.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pricing-BufY1pPK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var extras = {
	free: [
		"3 videos / month",
		"50 credits",
		"Story + ranking templates",
		"Watermark-free preview"
	],
	starter: [
		"30 videos / month",
		"200 credits",
		"AI voice + captions",
		"Priority render queue"
	],
	creator: [
		"90 videos / month",
		"500 credits",
		"All formats",
		"Brand-ready exports"
	],
	business: [
		"200 videos / month",
		"1,500 credits",
		"Team-ready volume",
		"Priority support"
	]
};
function Pricing() {
	const { user } = useCurrentUserState();
	const [busy, setBusy] = (0, import_react.useState)(null);
	async function subscribe(plan) {
		if (!user) {
			window.location.assign("/login");
			return;
		}
		setBusy(plan);
		try {
			await upgradePlan({ data: { plan } });
			toast.success(`${PLANS[plan].label} plan is active. Credits added.`);
			await getProfile();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not upgrade");
		} finally {
			setBusy(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto w-[min(1120px,calc(100%-1.5rem))] py-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl font-semibold tracking-tight",
					children: "Pricing that scales with you"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-xl text-muted",
					children: "Credits power script, voice, captions, and export. Upgrade instantly in the studio (demo checkout — no card in this preview)."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4",
					children: Object.keys(PLANS).map((key) => {
						const p = PLANS[key];
						const featured = key === "creator";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: `flex flex-col rounded-xl border p-6 ${featured ? "border-accent bg-ink text-white" : "border-line bg-surface"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `text-sm ${featured ? "text-white/60" : "text-muted"}`,
									children: p.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 font-display text-3xl font-semibold",
									children: [p.price === 0 ? "Free" : `$${p.price}`, p.price > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-base opacity-70",
										children: "/mo"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-5 flex-1 space-y-2 text-sm",
									children: extras[key].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: `mt-0.5 size-4 shrink-0 ${featured ? "text-white" : "text-accent"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: featured ? "text-white/80" : "text-muted",
											children: item
										})]
									}, item))
								}),
								key === "free" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: featured ? "secondary" : "secondary",
									className: "mt-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/login",
										children: "Start free"
									})
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: `mt-6 ${featured ? "bg-white text-ink hover:bg-white/90" : ""}`,
									variant: featured ? "default" : "secondary",
									disabled: busy === key,
									onClick: () => void subscribe(key),
									children: busy === key ? "Activating…" : "Choose plan"
								})
							]
						}, key);
					})
				})
			]
		})]
	});
}
//#endregion
export { Pricing as component };
