import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — VIDEONOVA AI" },
      {
        name: "description",
        content:
          "Simple credit plans for AI video generation: Free, Creator, Pro and Studio. Start free, upgrade when you need more.",
      },
      { property: "og:title", content: "Pricing — VIDEONOVA AI" },
      {
        property: "og:description",
        content: "Free, Creator, Pro and Studio credit plans for AI video generation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Pricing,
});

const PLANS = [
  {
    name: "Free",
    price: "R0",
    credits: "100 free credits every day",
    features: ["720p videos", "Up to 10 seconds", "Templates library", "Watermarked exports"],
  },
  {
    name: "Creator",
    price: "R249",
    credits: "1 000 credits / month",
    featured: true,
    features: ["1080p videos", "No watermark", "Prompt enhancement", "Priority queue"],
  },
  {
    name: "Pro",
    price: "R899",
    credits: "5 000 credits / month",
    features: ["1080p videos", "Cinematic quality tier", "Faster rendering", "Email support"],
  },
  {
    name: "Studio",
    price: "R2 999",
    credits: "20 000 credits / month",
    features: ["Highest quality tier", "Bulk generation", "Team seats (soon)", "Priority support"],
  },
];

function Pricing() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Pricing</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Credits are used per video — longer, sharper and higher-quality videos cost more. Paid
          plans go live with accounts; generating is free while we're in preview.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`glass rounded-2xl p-6 ${p.featured ? "glow-border border-primary/50" : ""}`}
            >
              <h2 className="text-lg font-semibold">{p.name}</h2>
              <p className="mt-3 text-3xl font-extrabold">{p.price}</p>
              <p className="text-xs text-muted-foreground">per month</p>
              <p className="mt-3 text-sm text-primary">{p.credits}</p>
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-6 w-full" variant={p.featured ? "default" : "outline"}>
                <Link to="/studio">Start creating</Link>
              </Button>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
