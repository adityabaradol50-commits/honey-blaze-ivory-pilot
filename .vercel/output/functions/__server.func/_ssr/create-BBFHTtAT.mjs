import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as cn, t as Button } from "./site-header-CURaYjxi.mjs";
import { b as BookOpen, d as MessageSquare, f as ListOrdered, o as Scissors } from "../_libs/lucide-react.mjs";
import { n as StudioShell, t as CreditsChip } from "./studio-shell-DJYc4a9T.mjs";
import { n as getProfile } from "./profile-D9UqmnTx.mjs";
import { t as CREDIT_COSTS } from "./types-Bqql5BzU.mjs";
import { n as Textarea, t as Input } from "./input-B2PamSiM.mjs";
import { t as createProject } from "./projects-CqbO5R_0.mjs";
import { n as generateScript } from "./ai-BU__NMxs.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/create-BBFHTtAT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var types = [
	{
		id: "story",
		title: "Story",
		body: "Faceless narration from a topic or script.",
		icon: BookOpen
	},
	{
		id: "ranking",
		title: "Ranking",
		body: "Countdown and top-list Shorts.",
		icon: ListOrdered
	},
	{
		id: "commentary",
		title: "Commentary",
		body: "Voiceover over a clip or idea.",
		icon: MessageSquare
	},
	{
		id: "clip",
		title: "Auto-clip",
		body: "Highlight beats from a long video.",
		icon: Scissors
	}
];
function Create() {
	const navigate = useNavigate();
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [type, setType] = (0, import_react.useState)("story");
	const [title, setTitle] = (0, import_react.useState)("");
	const [topic, setTopic] = (0, import_react.useState)("");
	const [sourceUrl, setSourceUrl] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		getProfile().then(setProfile).catch(() => {});
	}, []);
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		try {
			const project = await createProject({ data: {
				title: title || topic.slice(0, 60) || "Untitled short",
				type,
				sourceUrl: sourceUrl || void 0
			} });
			if (topic.trim().length >= 3) await generateScript({ data: {
				projectId: project.id,
				topic,
				type,
				sourceUrl: sourceUrl || void 0
			} });
			await navigate({
				to: "/projects/$id",
				params: { id: project.id }
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not create project");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StudioShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold tracking-tight",
				children: "New project"
			}), profile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditsChip, {
				credits: profile.credits,
				plan: profile.plan
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-1 text-sm text-muted",
			children: [
				"Generating a script uses ",
				CREDIT_COSTS.script,
				" credits. You can also skip and write it yourself."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "mt-8 max-w-2xl space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: types.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setType(t.id),
						className: cn("rounded-xl border p-4 text-left transition-colors", type === t.id ? "border-accent bg-accent-soft" : "border-line bg-surface hover:border-ink/20"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(t.icon, { className: "size-4 text-accent" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-medium",
								children: t.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: t.body
							})
						]
					}, t.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1.5 block text-sm font-medium",
					children: "Working title"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: title,
					onChange: (e) => setTitle(e.target.value),
					placeholder: "Optional"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1.5 block text-sm font-medium",
					children: "Topic or script seed"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: topic,
					onChange: (e) => setTopic(e.target.value),
					placeholder: "e.g. Three mistakes that kill a faceless channel in the first 30 days"
				})] }),
				(type === "commentary" || type === "clip") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1.5 block text-sm font-medium",
						children: "Source link (optional)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: sourceUrl,
						onChange: (e) => setSourceUrl(e.target.value),
						placeholder: "YouTube, TikTok, or Instagram URL"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-subtle",
						children: "Clipora stores the link and writes highlight beats. It does not download platform videos."
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: busy,
					children: busy ? "Generating…" : "Create and generate script"
				})
			]
		})
	] });
}
//#endregion
export { Create as component };
