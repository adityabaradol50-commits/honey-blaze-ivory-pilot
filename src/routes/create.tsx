import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { StudioShell, CreditsChip } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { getProfile } from "@/lib/server/profile";
import { createProject } from "@/lib/server/projects";
import { generateScript } from "@/lib/server/ai";
import { CREDIT_COSTS, type Profile, type ProjectType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ListOrdered, MessageSquare, Scissors, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/create")({ component: Create });

const types: { id: ProjectType; title: string; body: string; icon: typeof BookOpen }[] = [
  { id: "story", title: "Story", body: "Faceless narration from a topic or script.", icon: BookOpen },
  { id: "ranking", title: "Ranking", body: "Countdown and top-list Shorts.", icon: ListOrdered },
  { id: "commentary", title: "Commentary", body: "Voiceover over a clip or idea.", icon: MessageSquare },
  { id: "clip", title: "Auto-clip", body: "Highlight beats from a long video.", icon: Scissors },
];

function Create() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [type, setType] = useState<ProjectType>("story");
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getProfile().then(setProfile).catch(() => {});
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const project = await createProject({
        data: {
          title: title || topic.slice(0, 60) || "Untitled short",
          type,
          sourceUrl: sourceUrl || undefined,
        },
      });
      if (topic.trim().length >= 3) {
        await generateScript({
          data: {
            projectId: project.id,
            topic,
            type,
            sourceUrl: sourceUrl || undefined,
          },
        });
      }
      await navigate({ to: "/projects/$id", params: { id: project.id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create project");
    } finally {
      setBusy(false);
    }
  }

  return (
    <StudioShell>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold tracking-tight">New project</h1>
        {profile && <CreditsChip credits={profile.credits} plan={profile.plan} />}
      </div>
      <p className="mt-1 text-sm text-muted">
        Generating a script uses {CREDIT_COSTS.script} credits. You can also skip and write it yourself.
      </p>

      <form onSubmit={onSubmit} className="mt-8 max-w-2xl space-y-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {types.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setType(t.id)}
              className={cn(
                "rounded-xl border p-4 text-left transition-colors",
                type === t.id ? "border-accent bg-accent-soft" : "border-line bg-surface hover:border-ink/20",
              )}
            >
              <t.icon className="size-4 text-accent" />
              <p className="mt-2 font-medium">{t.title}</p>
              <p className="mt-1 text-xs text-muted">{t.body}</p>
            </button>
          ))}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Working title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Optional" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Topic or script seed</label>
          <Textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Three mistakes that kill a faceless channel in the first 30 days"
          />
        </div>
        {(type === "commentary" || type === "clip") && (
          <div>
            <label className="mb-1.5 block text-sm font-medium">Source link (optional)</label>
            <Input
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="YouTube, TikTok, or Instagram URL"
            />
            <p className="mt-1 text-xs text-subtle">
              Clipora stores the link and writes highlight beats. It does not download platform videos.
            </p>
          </div>
        )}
        <Button type="submit" disabled={busy}>
          {busy ? "Generating…" : "Create and generate script"}
        </Button>
      </form>
    </StudioShell>
  );
}
