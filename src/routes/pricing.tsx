import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getProfile, upgradePlan } from "@/lib/server/profile";
import { PLANS, type PlanId } from "@/lib/types";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/pricing")({ component: Pricing });

const extras: Record<PlanId, string[]> = {
  free: ["3 videos / month", "50 credits", "Story + ranking templates", "Watermark-free preview"],
  starter: ["30 videos / month", "200 credits", "AI voice + captions", "Priority render queue"],
  creator: ["90 videos / month", "500 credits", "All formats", "Brand-ready exports"],
  business: ["200 videos / month", "1,500 credits", "Team-ready volume", "Priority support"],
};

function Pricing() {
  const { user } = useCurrentUserState();
  const [busy, setBusy] = useState<string | null>(null);

  async function subscribe(plan: Exclude<PlanId, "free">) {
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

  return (
    <div className="min-h-dvh bg-bg">
      <SiteHeader />
      <main className="mx-auto w-[min(1120px,calc(100%-1.5rem))] py-16">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Pricing that scales with you</h1>
        <p className="mt-3 max-w-xl text-muted">
          Credits power script, voice, captions, and export. Upgrade instantly in the studio
          (demo checkout — no card in this preview).
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(PLANS) as PlanId[]).map((key) => {
            const p = PLANS[key];
            const featured = key === "creator";
            return (
              <article
                key={key}
                className={`flex flex-col rounded-xl border p-6 ${featured ? "border-accent bg-ink text-white" : "border-line bg-surface"}`}
              >
                <p className={`text-sm ${featured ? "text-white/60" : "text-muted"}`}>{p.label}</p>
                <p className="mt-2 font-display text-3xl font-semibold">
                  {p.price === 0 ? "Free" : `$${p.price}`}
                  {p.price > 0 && <span className="text-base opacity-70">/mo</span>}
                </p>
                <ul className="mt-5 flex-1 space-y-2 text-sm">
                  {extras[key].map((item) => (
                    <li key={item} className="flex gap-2">
                      <Check className={`mt-0.5 size-4 shrink-0 ${featured ? "text-white" : "text-accent"}`} />
                      <span className={featured ? "text-white/80" : "text-muted"}>{item}</span>
                    </li>
                  ))}
                </ul>
                {key === "free" ? (
                  <Button asChild variant={featured ? "secondary" : "secondary"} className="mt-6">
                    <Link to="/login">Start free</Link>
                  </Button>
                ) : (
                  <Button
                    className={`mt-6 ${featured ? "bg-white text-ink hover:bg-white/90" : ""}`}
                    variant={featured ? "default" : "secondary"}
                    disabled={busy === key}
                    onClick={() => void subscribe(key as Exclude<PlanId, "free">)}
                  >
                    {busy === key ? "Activating…" : "Choose plan"}
                  </Button>
                )}
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
