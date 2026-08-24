import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./site-header-CURaYjxi.mjs";
import { n as Trash2, s as Plus } from "../_libs/lucide-react.mjs";
import { n as StudioShell, t as CreditsChip } from "./studio-shell-DJYc4a9T.mjs";
import { n as getProfile } from "./profile-D9UqmnTx.mjs";
import { i as listProjects, n as deleteProject } from "./projects-CqbO5R_0.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-CB7-9BGc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [projects, setProjects] = (0, import_react.useState)(null);
	async function load() {
		try {
			const [p, list] = await Promise.all([getProfile(), listProjects()]);
			setProfile(p);
			setProjects(list);
		} catch {
			setProjects([]);
		}
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	async function remove(id) {
		try {
			await deleteProject({ data: { id } });
			setProjects((prev) => prev?.filter((p) => p.id !== id) ?? null);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not delete");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StudioShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-end justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl font-semibold tracking-tight",
			children: "Your projects"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: "Scripts, clips, and exports in one studio."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [profile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditsChip, {
				credits: profile.credits,
				plan: profile.plan
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/create",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "New project"]
				})
			})]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
		children: [
			projects === null && Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-xl bg-line/70" }, i)),
			projects?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "col-span-full rounded-xl border border-dashed border-line bg-surface p-10 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: "No projects yet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Start with a story, ranking, commentary, or clip."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "mt-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/create",
							children: "Create your first Short"
						})
					})
				]
			}),
			projects?.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-xl border border-line bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-wide text-subtle",
						children: p.type
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 font-display text-lg font-semibold leading-snug",
						children: p.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-muted",
						children: [
							p.status,
							" · ",
							p.scenes.length,
							" scenes · ",
							Math.round(p.durationSec),
							"s"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/projects/$id",
								params: { id: p.id },
								children: "Open editor"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => void remove(p.id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
						})]
					})
				]
			}, p.id))
		]
	})] });
}
//#endregion
export { Dashboard as component };
