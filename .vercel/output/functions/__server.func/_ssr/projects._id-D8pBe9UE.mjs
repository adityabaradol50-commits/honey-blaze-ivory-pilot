import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./site-header-CURaYjxi.mjs";
import { _ as ChevronDown, c as Play, g as ChevronUp, l as Pause } from "../_libs/lucide-react.mjs";
import { n as StudioShell, t as CreditsChip } from "./studio-shell-DJYc4a9T.mjs";
import { n as getProfile } from "./profile-D9UqmnTx.mjs";
import { r as VOICES, t as CREDIT_COSTS } from "./types-Bqql5BzU.mjs";
import { n as Textarea, t as Input } from "./input-B2PamSiM.mjs";
import { a as saveProject, r as getProject } from "./projects-CqbO5R_0.mjs";
import { i as markRendered, r as generateVoice, t as generateCaptions } from "./ai-BU__NMxs.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Route$1 } from "./router-BKPqyTMW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projects._id-D8pBe9UE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EditorPage() {
	const { id } = Route$1.useParams();
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [project, setProject] = (0, import_react.useState)(null);
	const [scenes, setScenes] = (0, import_react.useState)([]);
	const [script, setScript] = (0, import_react.useState)("");
	const [voiceId, setVoiceId] = (0, import_react.useState)("eve");
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [time, setTime] = (0, import_react.useState)(0);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const audioRef = (0, import_react.useRef)(null);
	const raf = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		Promise.all([getProject({ data: { id } }), getProfile()]).then(([p, prof]) => {
			setProject(p);
			setProfile(prof);
			if (p) {
				setScenes(p.scenes);
				setScript(p.script);
				setVoiceId(p.voiceId);
			}
		}).catch(() => setProject(null));
	}, [id]);
	const duration = (0, import_react.useMemo)(() => scenes.reduce((a, s) => a + s.durationSec, 0) || 1, [scenes]);
	const activeIndex = (0, import_react.useMemo)(() => {
		let t = 0;
		for (let i = 0; i < scenes.length; i++) {
			t += scenes[i].durationSec;
			if (time < t) return i;
		}
		return Math.max(0, scenes.length - 1);
	}, [scenes, time]);
	(0, import_react.useEffect)(() => {
		if (!playing) return;
		const start = performance.now() - time * 1e3;
		const tick = (now) => {
			const t = (now - start) / 1e3;
			if (t >= duration) {
				setPlaying(false);
				setTime(duration);
				audioRef.current?.pause();
				return;
			}
			setTime(t);
			raf.current = requestAnimationFrame(tick);
		};
		raf.current = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf.current);
	}, [playing, duration]);
	function move(i, dir) {
		const j = i + dir;
		if (j < 0 || j >= scenes.length) return;
		const next = [...scenes];
		[next[i], next[j]] = [next[j], next[i]];
		setScenes(next);
	}
	async function persist(extra) {
		if (!project) return;
		await saveProject({ data: {
			id: project.id,
			script,
			voiceId,
			scenes,
			durationSec: duration,
			...extra
		} });
	}
	async function onVoice() {
		if (!project) return;
		setBusy("voice");
		try {
			await persist();
			const res = await generateVoice({ data: {
				projectId: project.id,
				voiceId,
				text: script || scenes.map((s) => s.text).join(". ")
			} });
			setProject({
				...project,
				voiceData: res.voiceData,
				voiceId: res.voiceId
			});
			toast.success("Voiceover ready");
			getProfile().then(setProfile).catch(() => {});
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Voice failed");
		} finally {
			setBusy(null);
		}
	}
	async function onCaptions() {
		if (!project) return;
		setBusy("captions");
		try {
			await persist();
			const res = await generateCaptions({ data: { projectId: project.id } });
			setProject({
				...project,
				captions: res.captions
			});
			toast.success("Captions updated");
			getProfile().then(setProfile).catch(() => {});
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Captions failed");
		} finally {
			setBusy(null);
		}
	}
	async function onExport() {
		if (!project) return;
		setBusy("export");
		try {
			await persist({ status: "exported" });
			await markRendered({ data: { projectId: project.id } });
			const blob = new Blob([JSON.stringify({
				title: project.title,
				type: project.type,
				script,
				scenes,
				captions: project.captions,
				durationSec: duration
			}, null, 2)], { type: "application/json" });
			const a = document.createElement("a");
			a.href = URL.createObjectURL(blob);
			a.download = `${project.title.replace(/\s+/g, "-").toLowerCase()}-short.json`;
			a.click();
			toast.success("Exported project package");
			getProfile().then(setProfile).catch(() => {});
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Export failed");
		} finally {
			setBusy(null);
		}
	}
	function togglePlay() {
		const audio = audioRef.current;
		if (playing) {
			setPlaying(false);
			audio?.pause();
			return;
		}
		if (audio && project?.voiceData) {
			audio.currentTime = time;
			audio.play();
		}
		if (time >= duration - .05) setTime(0);
		setPlaying(true);
	}
	if (project === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Loading editor…"
	}) });
	const scene = scenes[activeIndex];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StudioShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-wide text-subtle",
				children: project.type
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold tracking-tight",
				children: project.title
			})] }), profile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditsChip, {
				credits: profile.credits,
				plan: profile.plan
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-center rounded-xl border border-line bg-ink p-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative aspect-[9/16] w-[min(100%,280px)] overflow-hidden rounded-lg bg-[#121826] text-white",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,#1d4ed833,transparent_55%)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex h-full flex-col justify-between p-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] uppercase tracking-[0.18em] text-white/50",
										children: scene?.visualHint ?? "scene"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-xl font-semibold leading-snug",
										children: scene?.caption || scene?.text || "Add scenes to preview"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-1 overflow-hidden rounded-full bg-white/15",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full bg-white",
											style: { width: `${Math.min(100, time / duration * 100)}%` }
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 text-xs tabular-nums text-white/55",
										children: [
											time.toFixed(1),
											"s / ",
											duration.toFixed(1),
											"s"
										]
									})] })
								]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "secondary",
								onClick: togglePlay,
								children: [playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), playing ? "Pause" : "Play preview"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "secondary",
								disabled: busy === "voice",
								onClick: () => void onVoice(),
								children: [
									"Voice (",
									CREDIT_COSTS.voice,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "secondary",
								disabled: busy === "captions",
								onClick: () => void onCaptions(),
								children: [
									"Captions (",
									CREDIT_COSTS.captions,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								disabled: busy === "export",
								onClick: () => void onExport(),
								children: [
									"Export (",
									CREDIT_COSTS.render,
									")"
								]
							})
						]
					}),
					project.voiceData && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
						ref: audioRef,
						src: project.voiceData,
						className: "hidden"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-line bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs font-medium text-muted",
						children: "Voice"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "mt-1 h-11 w-full rounded-md border border-line bg-surface px-3 text-sm",
						value: voiceId,
						onChange: (e) => setVoiceId(e.target.value),
						children: VOICES.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: v.id,
							children: [
								v.label,
								" — ",
								v.tone
							]
						}, v.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-line bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-medium text-muted",
							children: "Script"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							className: "mt-1 min-h-40",
							value: script,
							onChange: (e) => setScript(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "sm",
							variant: "ghost",
							className: "mt-2",
							onClick: () => void persist(),
							children: "Save script"
						})
					]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold",
					children: "Timeline"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Reorder clips and trim duration. Each block is a scene."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-2",
					children: [scenes.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex items-start gap-3 rounded-lg border bg-surface p-3 ${i === activeIndex ? "border-accent" : "border-line"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "grid size-8 place-items-center",
								onClick: () => move(i, -1),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "grid size-8 place-items-center",
								onClick: () => move(i, 1),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: s.caption,
								onChange: (e) => {
									const next = [...scenes];
									next[i] = {
										...s,
										caption: e.target.value,
										text: e.target.value
									};
									setScenes(next);
								}
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center gap-2 text-xs text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Duration" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: 2,
										max: 8,
										step: .5,
										value: s.durationSec,
										onChange: (e) => {
											const next = [...scenes];
											next[i] = {
												...s,
												durationSec: Number(e.target.value)
											};
											setScenes(next);
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "tabular-nums",
										children: [s.durationSec, "s"]
									})
								]
							})]
						})]
					}, s.id)), scenes.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-lg border border-dashed border-line p-6 text-sm text-muted",
						children: "No scenes yet. Generate a script from the create flow or paste one and save."
					})]
				})
			]
		})
	] });
}
//#endregion
export { EditorPage as component };
