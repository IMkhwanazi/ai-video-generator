import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import { TEMPLATES } from "@/lib/videonova";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Video Templates — VIDEONOVA AI" },
      {
        name: "description",
        content:
          "Ready-made prompts for adverts, product launches, property tours, travel reels and more. Open one in the studio and generate.",
      },
      { property: "og:title", content: "Video Templates — VIDEONOVA AI" },
      {
        property: "og:description",
        content: "Start from a proven prompt and generate your video in seconds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Templates,
});

function Templates() {
  const categories = [...new Set(TEMPLATES.map((t) => t.category))];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Templates</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Pick a starting point — the studio opens with the prompt, style and camera already set.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <span
              key={c}
              className="rounded-full border border-border/70 bg-card/50 px-3 py-1 text-xs text-muted-foreground"
            >
              {c}
            </span>
          ))}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((t) => (
            <Link
              key={t.id}
              to="/studio"
              search={{ template: t.id }}
              className="glass group rounded-2xl p-4 transition-colors hover:border-primary/40"
            >
              <div className="aspect-video rounded-xl aurora" />
              <h2 className="mt-3 font-semibold group-hover:text-primary">{t.name}</h2>
              <p className="text-xs text-muted-foreground">
                {t.category} · {t.duration}s · {t.aspectRatio} · {t.style}
              </p>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{t.prompt}</p>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
