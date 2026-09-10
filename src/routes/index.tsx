import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Clapperboard,
  Image as ImageIcon,
  Music4,
  ScrollText,
  Mic,
  Wand2,
  Play,
} from "lucide-react";
import { useEffect, useState } from "react";

import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import { Button } from "@/components/ui/button";
import { TEMPLATES } from "@/lib/videonova";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "VIDEONOVA AI — Turn Your Ideas Into Stunning AI Videos" },
      {
        name: "description",
        content:
          "Generate cinematic, social-ready and professional videos from simple prompts and images with the VIDEONOVA AI creation studio.",
      },
      { property: "og:title", content: "VIDEONOVA AI — AI Video Generation Studio" },
      {
        property: "og:description",
        content:
          "Describe it. Generate it. Make it yours. Cinematic AI video generation from prompts and images.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://render-craft-co.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://render-craft-co.lovable.app/" }],
  }),
  component: Landing,
});

const STEPS = [
  "Preparing your video...",
  "Generating scenes...",
  "Rendering video...",
  "Adding audio...",
  "Finalising...",
];

function PreviewCard() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 1900);
    return () => clearInterval(t);
  }, []);
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="glass glow-border rounded-3xl p-4">
      <div className="relative aspect-video overflow-hidden rounded-2xl aurora">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-background/50 backdrop-blur">
            <Play className="size-6 text-primary" />
          </span>
        </div>
        <div className="absolute inset-x-4 bottom-4 rounded-xl bg-background/70 p-3 backdrop-blur">
          <div className="flex items-center justify-between text-xs">
            <span className="text-foreground">{STEPS[step]}</span>
            <span className="text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      <p className="mt-3 px-1 text-xs text-muted-foreground">
        Live preview of the studio's generation flow.
      </p>
    </div>
  );
}

const FEATURES = [
  { icon: Clapperboard, title: "Text to Video", body: "Turn ideas into cinematic scenes." },
  { icon: ImageIcon, title: "Image to Video", body: "Bring static images to life." },
  { icon: ScrollText, title: "AI Prompt Intelligence", body: "Vague ideas become directed shots." },
  { icon: Mic, title: "AI Voice", body: "Natural voiceovers — coming next." },
  { icon: Music4, title: "AI Music", body: "Original soundtracks — coming next." },
  { icon: Wand2, title: "Smart Editing", body: "Let AI handle repetitive editing." },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 aurora opacity-70" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/50 px-3 py-1 text-xs text-muted-foreground">
              <Sparkle /> Real AI video generation, built in
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] sm:text-6xl">
              Turn Your Ideas Into <span className="text-gradient">Stunning AI Videos.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Generate cinematic, social-ready and professional videos from simple prompts and
              images — powered by intelligent AI creation tools.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/studio">
                  Start Creating Free <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/templates">Explore Templates</Link>
              </Button>
            </div>
          </div>
          <PreviewCard />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="text-center text-3xl font-bold sm:text-4xl">
          One Prompt. Endless Possibilities.
        </h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6 transition-colors hover:border-primary/40">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15">
                <f.icon className="size-5 text-primary" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold sm:text-3xl">Start from a template</h2>
          <Link to="/templates" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEMPLATES.slice(0, 4).map((t) => (
            <Link
              key={t.id}
              to="/studio"
              search={{ template: t.id }}
              className="glass group rounded-2xl p-4 transition-colors hover:border-primary/40"
            >
              <div className="aspect-video rounded-xl aurora" />
              <h3 className="mt-3 text-sm font-semibold group-hover:text-primary">{t.name}</h3>
              <p className="text-xs text-muted-foreground">
                {t.category} · {t.duration}s · {t.aspectRatio}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-border/60">
        <div className="absolute inset-0 aurora opacity-60" />
        <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
          <h2 className="text-3xl font-extrabold sm:text-5xl">
            Your next video starts with one idea.
          </h2>
          <p className="mt-4 text-muted-foreground">Describe it. Generate it. Make it yours.</p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/studio">Start Creating Free</Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Sparkle() {
  return <span className="size-1.5 rounded-full bg-primary" />;
}
