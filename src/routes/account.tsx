import { createFileRoute } from "@tanstack/react-router";
import { StudioShell, CreditsChip } from "@/components/studio-shell";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { getProfile, listCreditEvents } from "@/lib/server/profile";
import type { Profile } from "@/lib/types";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/account")({ component: Account });

function Account() {
  const user = useCurrentUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [events, setEvents] = useState<{ id: number; amount: number; reason: string; createdAt: string }[]>([]);

  useEffect(() => {
    Promise.all([getProfile(), listCreditEvents()])
      .then(([p, e]) => {
        setProfile(p);
        setEvents(e);
      })
      .catch(() => {});
  }, []);

  return (
    <StudioShell>
      <h1 className="font-display text-2xl font-semibold tracking-tight">Account</h1>
      <p className="mt-1 text-sm text-muted">{user?.primaryEmail || user?.displayName}</p>
      <div className="mt-6">{profile && <CreditsChip credits={profile.credits} plan={profile.plan} />}</div>
      <p className="mt-2 text-sm text-muted">
        {profile ? `${profile.videosThisMonth} / ${profile.videoLimit} videos this cycle` : ""}
      </p>
      <h2 className="mt-10 font-display text-lg font-semibold">Credit history</h2>
      <ul className="mt-3 divide-y divide-line rounded-xl border border-line bg-surface">
        {events.length === 0 && <li className="p-4 text-sm text-muted">No credit events yet.</li>}
        {events.map((e) => (
          <li key={e.id} className="flex items-center justify-between p-4 text-sm">
            <span>{e.reason}</span>
            <span className={`tabular-nums ${e.amount < 0 ? "text-danger" : "text-ok"}`}>
              {e.amount > 0 ? "+" : ""}
              {e.amount}
            </span>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
