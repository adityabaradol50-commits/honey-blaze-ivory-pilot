import { Link, useRouterState } from "@tanstack/react-router";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Logo } from "@/components/site-header";
import { UserButton } from "@/lib/auth/gates";
import { Clapperboard, CreditCard, LayoutGrid, Plus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function StudioShell({ children }: { children: React.ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (isPending) {
    return (
      <div className="grid min-h-dvh place-items-center bg-bg">
        <div className="h-10 w-40 animate-pulse rounded-full bg-line" />
      </div>
    );
  }
  if (!user) return <RedirectToSignIn to="/login" />;

  const links = [
    { to: "/dashboard", label: "Projects", icon: LayoutGrid },
    { to: "/create", label: "New", icon: Plus },
    { to: "/pricing", label: "Plans", icon: CreditCard },
    { to: "/account", label: "Account", icon: Settings },
  ];

  return (
    <div className="min-h-dvh bg-bg">
      <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
        <div className="mx-auto flex h-14 w-[min(1200px,calc(100%-1.25rem))] items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo />
            <nav className="hidden items-center gap-1 md:flex">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    "inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm",
                    pathname === l.to ? "bg-accent-soft text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  <l.icon className="size-4" />
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted sm:inline">{user.displayName}</span>
            <UserButton />
          </div>
        </div>
      </header>
      <div className="mx-auto w-[min(1200px,calc(100%-1.25rem))] py-6 pb-24 md:pb-10">{children}</div>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface md:hidden">
        <div className="grid grid-cols-4">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "flex h-14 flex-col items-center justify-center gap-1 text-[11px]",
                pathname === l.to ? "text-accent" : "text-muted",
              )}
            >
              <l.icon className="size-4" />
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

export function CreditsChip({ credits, plan }: { credits: number; plan: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs">
      <Clapperboard className="size-3.5 text-accent" />
      <span className="font-medium tabular-nums">{credits} credits</span>
      <span className="text-subtle">· {plan}</span>
    </div>
  );
}
