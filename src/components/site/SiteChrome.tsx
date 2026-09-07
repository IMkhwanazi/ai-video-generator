import { Link } from "@tanstack/react-router";
import { Sparkles, Menu } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/studio", label: "AI Video" },
  { to: "/templates", label: "Templates" },
  { to: "/pricing", label: "Pricing" },
  { to: "/projects", label: "Projects" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary/20 glow-border">
        <Sparkles className="size-4 text-primary" />
      </span>
      <span className="font-display text-base font-extrabold tracking-tight">
        VIDEONOVA <span className="text-primary">AI</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/studio">Start Creating</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>
      {open && (
        <nav className="grid gap-1 border-t border-border/60 px-4 py-3 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-muted-foreground">Create without limits.</p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">Product</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/studio" className="hover:text-foreground">
                AI Video Studio
              </Link>
            </li>
            <li>
              <Link to="/templates" className="hover:text-foreground">
                Templates
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="hover:text-foreground">
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/projects" className="hover:text-foreground">
                Your projects
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">Made with</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Text to video</li>
            <li>Image to video</li>
            <li>Prompt intelligence</li>
            <li>Secure media storage</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">Coming next</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Accounts &amp; credits</li>
            <li>AI voiceover &amp; music</li>
            <li>Timeline editor</li>
            <li>Brand kit</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 px-4 py-5 text-center text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} VIDEONOVA AI. All rights reserved.
      </div>
    </footer>
  );
}
