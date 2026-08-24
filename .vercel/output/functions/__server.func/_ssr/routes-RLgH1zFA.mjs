import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as SiteHeader, t as Button } from "./site-header-CURaYjxi.mjs";
import { h as Clapperboard, i as Sparkles, o as Scissors, r as Timer, u as MicVocal, y as Captions } from "../_libs/lucide-react.mjs";
import { n as PLANS } from "./types-Bqql5BzU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-RLgH1zFA.js
var import_jsx_runtime = require_jsx_runtime();
var features = [
	{
		icon: Scissors,
		title: "Auto-clip highlights",
		body: "Drop a long take or a link. Clipora finds the beats worth posting."
	},
	{
		icon: MicVocal,
		title: "AI voiceover",
		body: "Natural narration from your script. No mic, no booth, no retakes."
	},
	{
		icon: Captions,
		title: "Captions that sync",
		body: "Styled subtitles timed to each scene, ready for silent autoplay."
	},
	{
		icon: Clapperboard,
		title: "Timeline in the browser",
		body: "Trim, reorder, and preview in 9:16 without installing an editor."
	}
];
var steps = [
	{
		n: "01",
		title: "Start from an idea",
		body: "Pick a format: story, ranking, commentary, or clip."
	},
	{
		n: "02",
		title: "Let AI assemble it",
		body: "Script, voice, and captions land on a vertical timeline."
	},
	{
		n: "03",
		title: "Polish and export",
		body: "Tweak timing, then export a ready-to-post Short."
	}
];
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative overflow-hidden px-5 pb-20 pt-16 md:pt-24",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"aria-hidden": true,
					className: "pointer-events-none absolute inset-0",
					style: { background: "radial-gradient(ellipse 70% 50% at 50% -10%, #dbe4f8 0%, transparent 60%)" }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto max-w-4xl text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5 text-accent" }), "Join creators shipping daily Shorts"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "font-display text-[clamp(2.4rem,7vw,4.6rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-ink",
							children: [
								"Create short-form",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"content using AI",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"in seconds"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg",
							children: "Auto-clip videos, generate voiceovers and captions, edit on a timeline, and export ready-to-post — all in your browser."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "pill",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									children: "Sign up — it's free"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "pill",
								variant: "secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#how",
									children: "See how it works"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-xs text-subtle",
							children: "No credit card. Free plan included."
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "features",
				className: "mx-auto w-[min(1120px,calc(100%-1.5rem))] pb-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 md:grid-cols-2",
					children: features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-xl border border-line bg-surface p-6 shadow-[0_8px_30px_rgba(11,18,32,0.04)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "size-5 text-accent" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-4 font-display text-lg font-semibold",
								children: f.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted",
								children: f.body
							})
						]
					}, f.title))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "how",
				className: "bg-ink px-5 py-20 text-white",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto w-[min(1120px,100%)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium uppercase tracking-[0.16em] text-white/50",
							children: "Workflow"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-display text-3xl font-semibold tracking-tight",
							children: "Three steps. Then post."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-10 grid gap-8 md:grid-cols-3",
							children: steps.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-sm text-white/40",
									children: s.n
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-2 text-lg font-semibold",
									children: s.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm leading-relaxed text-white/65",
									children: s.body
								})
							] }, s.n))
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto w-[min(1120px,calc(100%-1.5rem))] py-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl font-semibold tracking-tight",
						children: "Simple pricing"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Credits cover script, voice, captions, and export."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/pricing",
							children: "Full details"
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid gap-4 md:grid-cols-4",
					children: Object.keys(PLANS).map((key) => {
						const p = PLANS[key];
						const featured = key === "creator";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: `rounded-xl border p-5 ${featured ? "border-accent bg-accent text-white" : "border-line bg-surface"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `text-sm ${featured ? "text-white/70" : "text-muted"}`,
									children: p.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 font-display text-3xl font-semibold",
									children: [p.price === 0 ? "Free" : `$${p.price}`, p.price > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-base font-medium opacity-70",
										children: "/mo"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: `mt-3 text-sm ${featured ? "text-white/80" : "text-muted"}`,
									children: [
										p.videos,
										" videos · ",
										p.credits,
										" credits"
									]
								})
							]
						}, key);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-5 pb-24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex w-[min(900px,100%)] flex-col items-center rounded-2xl bg-ink px-6 py-14 text-center text-white",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, { className: "size-6 text-white/70" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-4 font-display text-3xl font-semibold tracking-tight",
							children: "Ship the next Short before the idea cools."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-md text-sm text-white/65",
							children: "Open the studio, drop a topic, and walk out with a vertical cut."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "pill",
							className: "mt-8 bg-white text-ink hover:bg-white/90",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								children: "Start free"
							})
						})
					]
				})
			})
		] })]
	});
}
//#endregion
export { Home as component };
