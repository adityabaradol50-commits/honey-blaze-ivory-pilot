import { C as require_jsx_runtime, f as useRouterState, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as UserButton, c as useCurrentUserState, n as Logo, o as cn, r as RedirectToSignIn } from "./site-header-CURaYjxi.mjs";
import { a as Settings, h as Clapperboard, m as CreditCard, p as LayoutGrid, s as Plus } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/studio-shell-DJYc4a9T.js
var import_jsx_runtime = require_jsx_runtime();
function StudioShell({ children }) {
	const { user, isPending } = useCurrentUserState();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-40 animate-pulse rounded-full bg-line" })
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, { to: "/login" });
	const links = [
		{
			to: "/dashboard",
			label: "Projects",
			icon: LayoutGrid
		},
		{
			to: "/create",
			label: "New",
			icon: Plus
		},
		{
			to: "/pricing",
			label: "Plans",
			icon: CreditCard
		},
		{
			to: "/account",
			label: "Account",
			icon: Settings
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-14 w-[min(1200px,calc(100%-1.25rem))] items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "hidden items-center gap-1 md:flex",
							children: links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: l.to,
								className: cn("inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm", pathname === l.to ? "bg-accent-soft text-ink" : "text-muted hover:text-ink"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(l.icon, { className: "size-4" }), l.label]
							}, l.to))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden text-sm text-muted sm:inline",
							children: user.displayName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto w-[min(1200px,calc(100%-1.25rem))] py-6 pb-24 md:pb-10",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface md:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-4",
					children: links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: l.to,
						className: cn("flex h-14 flex-col items-center justify-center gap-1 text-[11px]", pathname === l.to ? "text-accent" : "text-muted"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(l.icon, { className: "size-4" }), l.label]
					}, l.to))
				})
			})
		]
	});
}
function CreditsChip({ credits, plan }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clapperboard, { className: "size-3.5 text-accent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-medium tabular-nums",
				children: [credits, " credits"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-subtle",
				children: ["· ", plan]
			})
		]
	});
}
//#endregion
export { StudioShell as n, CreditsChip as t };
