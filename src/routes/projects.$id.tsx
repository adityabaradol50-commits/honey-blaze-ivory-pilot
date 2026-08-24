import { createFileRoute } from "@tanstack/react-router";
import { StudioShell, CreditsChip } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { getProfile } from "@/lib/server/profile";
import { getProject, saveProject } from "@/lib/server/projects";
import { generateCaptions, generateVoice, markRendered } from "@/lib/server/ai";
import { CREDIT_COSTS, VOICES, type Profile, type Project, type Scene } from "@/lib/types";
import { ChevronDown, ChevronUp, Pause, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/projects/$id")({ component: EditorPage });

function EditorPage() {
  const { id } = Route.useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [script, setScript] = useState("");
  const [voiceId, setVoiceId] = useState("eve");
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const raf = useRef<number>(0);

  useEffect(() => {
    Promise.all([getProject({ data: { id } }), getProfile()])
      .then(([p, prof]) => {
        setProject(p);
        setProfile(prof);
        if (p) {
          setScenes(p.scenes);
          setScript(p.script);
          setVoiceId(p.voiceId);
        }
      })
      .catch(() => setProject(null));
  }, [id]);

  const duration = useMemo(
    () => scenes.reduce((a, s) => a + s.durationSec, 0) || 1,
    [scenes],
  );

  const activeIndex = useMemo(() => {
    let t = 0;
    for (let i = 0; i < scenes.length; i++) {
      t += scenes[i].durationSec;
      if (time < t) return i;
    }
    return Math.max(0, scenes.length - 1);
  }, [scenes, time]);

  useEffect(() => {
    if (!playing) return;
    const start = performance.now() - time * 1000;
    const tick = (now: number) => {
      const t = (now - start) / 1000;
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

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= scenes.length) return;
    const next = [...scenes];
    [next[i], next[j]] = [next[j], next[i]];
    setScenes(next);
  }

  async function persist(extra?: Partial<Project>) {
    if (!project) return;
    await saveProject({
      data: {
        id: project.id,
        script,
        voiceId,
        scenes,
        durationSec: duration,
        ...extra,
      },
    });
  }

  async function onVoice() {
    if (!project) return;
    setBusy("voice");
    try {
      await persist();
      const res = await generateVoice({
        data: { projectId: project.id, voiceId, text: script || scenes.map((s) => s.text).join(". ") },
      });
      setProject({ ...project, voiceData: res.voiceData, voiceId: res.voiceId });
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
      setProject({ ...project, captions: res.captions });
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
      const blob = new Blob(
        [
          JSON.stringify(
            {
              title: project.title,
              type: project.type,
              script,
              scenes,
              captions: project.captions,
              durationSec: duration,
            },
            null,
            2,
          ),
        ],
        { type: "application/json" },
      );
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
      void audio.play();
    }
    if (time >= duration - 0.05) setTime(0);
    setPlaying(true);
  }

  if (project === null) {
    return (
      <StudioShell>
        <p className="text-sm text-muted">Loading editor…</p>
      </StudioShell>
    );
  }

  const scene = scenes[activeIndex];

  return (
    <StudioShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-subtle">{project.type}</p>
          <h1 className="font-display text-2xl font-semibold tracking-tight">{project.title}</h1>
        </div>
        {profile && <CreditsChip credits={profile.credits} plan={profile.plan} />}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          <div className="flex justify-center rounded-xl border border-line bg-ink p-6">
            <div className="relative aspect-[9/16] w-[min(100%,280px)] overflow-hidden rounded-lg bg-[#121826] text-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,#1d4ed833,transparent_55%)]" />
              <div className="relative flex h-full flex-col justify-between p-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">
                  {scene?.visualHint ?? "scene"}
                </p>
                <p className="font-display text-xl font-semibold leading-snug">
                  {scene?.caption || scene?.text || "Add scenes to preview"}
                </p>
                <div>
                  <div className="h-1 overflow-hidden rounded-full bg-white/15">
                    <div
                      className="h-full bg-white"
                      style={{ width: `${Math.min(100, (time / duration) * 100)}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs tabular-nums text-white/55">
                    {time.toFixed(1)}s / {duration.toFixed(1)}s
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={togglePlay}>
              {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
              {playing ? "Pause" : "Play preview"}
            </Button>
            <Button type="button" variant="secondary" disabled={busy === "voice"} onClick={() => void onVoice()}>
              Voice ({CREDIT_COSTS.voice})
            </Button>
            <Button type="button" variant="secondary" disabled={busy === "captions"} onClick={() => void onCaptions()}>
              Captions ({CREDIT_COSTS.captions})
            </Button>
            <Button type="button" disabled={busy === "export"} onClick={() => void onExport()}>
              Export ({CREDIT_COSTS.render})
            </Button>
          </div>
          {project.voiceData && <audio ref={audioRef} src={project.voiceData} className="hidden" />}
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-line bg-surface p-4">
            <label className="text-xs font-medium text-muted">Voice</label>
            <select
              className="mt-1 h-11 w-full rounded-md border border-line bg-surface px-3 text-sm"
              value={voiceId}
              onChange={(e) => setVoiceId(e.target.value)}
            >
              {VOICES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label} — {v.tone}
                </option>
              ))}
            </select>
          </div>
          <div className="rounded-xl border border-line bg-surface p-4">
            <label className="text-xs font-medium text-muted">Script</label>
            <Textarea className="mt-1 min-h-40" value={script} onChange={(e) => setScript(e.target.value)} />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="mt-2"
              onClick={() => void persist()}
            >
              Save script
            </Button>
          </div>
        </aside>
      </div>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold">Timeline</h2>
        <p className="text-sm text-muted">Reorder clips and trim duration. Each block is a scene.</p>
        <div className="mt-4 space-y-2">
          {scenes.map((s, i) => (
            <div
              key={s.id}
              className={`flex items-start gap-3 rounded-lg border bg-surface p-3 ${i === activeIndex ? "border-accent" : "border-line"}`}
            >
              <div className="flex flex-col">
                <button type="button" className="grid size-8 place-items-center" onClick={() => move(i, -1)}>
                  <ChevronUp className="size-4" />
                </button>
                <button type="button" className="grid size-8 place-items-center" onClick={() => move(i, 1)}>
                  <ChevronDown className="size-4" />
                </button>
              </div>
              <div className="min-w-0 flex-1">
                <Input
                  value={s.caption}
                  onChange={(e) => {
                    const next = [...scenes];
                    next[i] = { ...s, caption: e.target.value, text: e.target.value };
                    setScenes(next);
                  }}
                />
                <div className="mt-2 flex items-center gap-2 text-xs text-muted">
                  <span>Duration</span>
                  <input
                    type="range"
                    min={2}
                    max={8}
                    step={0.5}
                    value={s.durationSec}
                    onChange={(e) => {
                      const next = [...scenes];
                      next[i] = { ...s, durationSec: Number(e.target.value) };
                      setScenes(next);
                    }}
                  />
                  <span className="tabular-nums">{s.durationSec}s</span>
                </div>
              </div>
            </div>
          ))}
          {scenes.length === 0 && (
            <p className="rounded-lg border border-dashed border-line p-6 text-sm text-muted">
              No scenes yet. Generate a script from the create flow or paste one and save.
            </p>
          )}
        </div>
      </section>
    </StudioShell>
  );
}
