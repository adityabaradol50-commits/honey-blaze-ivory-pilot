import { createFileRoute, Link } from "@tanstack/react-router";
import { StudioShell, CreditsChip } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { getProfile } from "@/lib/server/profile";
import { deleteProject, listProjects } from "@/lib/server/projects";
import type { Profile, Project } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[] | null>(null);

  async function load() {
    try {
      const [p, list] = await Promise.all([getProfile(), listProjects()]);
      setProfile(p);
      setProjects(list);
    } catch {
      setProjects([]);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function remove(id: string) {
    try {
      await deleteProject({ data: { id } });
      setProjects((prev) => prev?.filter((p) => p.id !== id) ?? null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete");
    }
  }

  return (
    <StudioShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Your projects</h1>
          <p className="mt-1 text-sm text-muted">Scripts, clips, and exports in one studio.</p>
        </div>
        <div className="flex items-center gap-3">
          {profile && <CreditsChip credits={profile.credits} plan={profile.plan} />}
          <Button asChild>
            <Link to="/create">
              <Plus className="size-4" />
              New project
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects === null &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-line/70" />
          ))}
        {projects?.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-line bg-surface p-10 text-center">
            <p className="font-medium">No projects yet</p>
            <p className="mt-1 text-sm text-muted">Start with a story, ranking, commentary, or clip.</p>
            <Button asChild className="mt-5">
              <Link to="/create">Create your first Short</Link>
            </Button>
          </div>
        )}
        {projects?.map((p) => (
          <article key={p.id} className="rounded-xl border border-line bg-surface p-5">
            <p className="text-xs uppercase tracking-wide text-subtle">{p.type}</p>
            <h2 className="mt-1 font-display text-lg font-semibold leading-snug">{p.title}</h2>
            <p className="mt-2 text-xs text-muted">
              {p.status} · {p.scenes.length} scenes · {Math.round(p.durationSec)}s
            </p>
            <div className="mt-4 flex gap-2">
              <Button asChild size="sm">
                <Link to="/projects/$id" params={{ id: p.id }}>
                  Open editor
                </Link>
              </Button>
              <Button size="sm" variant="ghost" onClick={() => void remove(p.id)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}
