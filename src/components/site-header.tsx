import { Link } from "@tanstack/react-router";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span
        className={`grid size-8 place-items-center rounded-md ${dark ? "bg-white text-ink" : "bg-ink text-white"}`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
          <path d="M3 2.2c0-.7.8-1.1 1.4-.7l7.2 4.8c.6.4.6 1.2 0 1.6L4.4 12.7c-.6.4-1.4 0-1.4-.7V2.2Z" />
        </svg>
      </span>
      <span className={`font-display text-[15px] font-semibold tracking-tight ${dark ? "text-white" : "text-ink"}`}>
        Clipora
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const { user, isPending } = useCurrentUserState();
  return (
    <header className="sticky top-3 z-40 mx-auto w-[min(1120px,calc(100%-1.25rem))]">
      <div className="flex h-14 items-center justify-between rounded-full border border-line bg-surface/90 px-3 shadow-[0_8px_30px_rgba(11,18,32,0.06)] backdrop-blur">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          <a href="/#features" className="hover:text-ink">
            Features
          </a>
          <a href="/#how" className="hover:text-ink">
            How it works
          </a>
          <Link to="/pricing" className="hover:text-ink">
            Pricing
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-line" />
          ) : user ? (
            <>
              <Button asChild size="sm" variant="ghost">
                <Link to="/dashboard">Studio</Link>
              </Button>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </>
          ) : (
            <>
              <SignedOut>
                <Button asChild size="sm" variant="ghost">
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild size="pill" className="h-10 px-5">
                  <Link to="/login">Try Clipora</Link>
                </Button>
              </SignedOut>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
