import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Captions,
  Clapperboard,
  Mic2,
  Scissors,
  Sparkles,
  Timer,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/types";

export const Route = createFileRoute("/")({ component: Home });

const features = [
  {
    icon: Scissors,
    title: "Auto-clip highlights",
    body: "Drop a long take or a link. Clipora finds the beats worth posting.",
  },
  {
    icon: Mic2,
    title: "AI voiceover",
    body: "Natural narration from your script. No mic, no booth, no retakes.",
  },
  {
    icon: Captions,
    title: "Captions that sync",
    body: "Styled subtitles timed to each scene, ready for silent autoplay.",
  },
  {
    icon: Clapperboard,
    title: "Timeline in the browser",
    body: "Trim, reorder, and preview in 9:16 without installing an editor.",
  },
];

const steps = [
  { n: "01", title: "Start from an idea", body: "Pick a format: story, ranking, commentary, or clip." },
  { n: "02", title: "Let AI assemble it", body: "Script, voice, and captions land on a vertical timeline." },
  { n: "03", title: "Polish and export", body: "Tweak timing, then export a ready-to-post Short." },
];

function Home() {
  return (
    <div className="min-h-dvh bg-bg">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden px-5 pb-20 pt-16 md:pt-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% -10%, #dbe4f8 0%, transparent 60%)",
            }}
          />
          <div className="relative mx-auto max-w-4xl text-center">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted">
              <Sparkles className="size-3.5 text-accent" />
              Join creators shipping daily Shorts
            </p>
            <h1 className="font-display text-[clamp(2.4rem,7vw,4.6rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-ink">
              Create short-form
              <br />
              content using AI
              <br />
              in seconds
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
              Auto-clip videos, generate voiceovers and captions, edit on a timeline,
              and export ready-to-post — all in your browser.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="pill">
                <Link to="/login">Sign up — it's free</Link>
              </Button>
              <Button asChild size="pill" variant="secondary">
                <a href="#how">See how it works</a>
              </Button>
            </div>
            <p className="mt-4 text-xs text-subtle">No credit card. Free plan included.</p>
          </div>
        </section>

        <section id="features" className="mx-auto w-[min(1120px,calc(100%-1.5rem))] pb-20">
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((f) => (
              <article
                key={f.title}
                className="rounded-xl border border-line bg-surface p-6 shadow-[0_8px_30px_rgba(11,18,32,0.04)]"
              >
                <f.icon className="size-5 text-accent" />
                <h2 className="mt-4 font-display text-lg font-semibold">{f.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="how" className="bg-ink px-5 py-20 text-white">
          <div className="mx-auto w-[min(1120px,100%)]">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/50">Workflow</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">Three steps. Then post.</h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {steps.map((s) => (
                <div key={s.n}>
                  <p className="font-display text-sm text-white/40">{s.n}</p>
                  <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-[min(1120px,calc(100%-1.5rem))] py-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight">Simple pricing</h2>
              <p className="mt-2 text-sm text-muted">Credits cover script, voice, captions, and export.</p>
            </div>
            <Button asChild variant="ghost">
              <Link to="/pricing">Full details</Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {(Object.keys(PLANS) as Array<keyof typeof PLANS>).map((key) => {
              const p = PLANS[key];
              const featured = key === "creator";
              return (
                <article
                  key={key}
                  className={`rounded-xl border p-5 ${featured ? "border-accent bg-accent text-white" : "border-line bg-surface"}`}
                >
                  <p className={`text-sm ${featured ? "text-white/70" : "text-muted"}`}>{p.label}</p>
                  <p className="mt-2 font-display text-3xl font-semibold">
                    {p.price === 0 ? "Free" : `$${p.price}`}
                    {p.price > 0 && <span className="text-base font-medium opacity-70">/mo</span>}
                  </p>
                  <p className={`mt-3 text-sm ${featured ? "text-white/80" : "text-muted"}`}>
                    {p.videos} videos · {p.credits} credits
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="px-5 pb-24">
          <div className="mx-auto flex w-[min(900px,100%)] flex-col items-center rounded-2xl bg-ink px-6 py-14 text-center text-white">
            <Timer className="size-6 text-white/70" />
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight">
              Ship the next Short before the idea cools.
            </h2>
            <p className="mt-3 max-w-md text-sm text-white/65">
              Open the studio, drop a topic, and walk out with a vertical cut.
            </p>
            <Button asChild size="pill" className="mt-8 bg-white text-ink hover:bg-white/90">
              <Link to="/login">Start free</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
