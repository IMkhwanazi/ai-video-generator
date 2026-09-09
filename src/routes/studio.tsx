import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles, Wand2, Download, Undo2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DAILY_FREE_CREDITS, getCreditBalance } from "@/lib/credits.functions";
import {
  createGeneration,
  enhancePrompt,
  getGeneration,
  type GenerationView,
} from "@/lib/video.functions";
import {
  ASPECT_RATIOS,
  CAMERAS,
  DEFAULT_SETTINGS,
  DURATIONS,
  LIGHTING,
  MODEL_TIERS,
  RESOLUTIONS,
  STATUS_COPY,
  STYLES,
  TEMPLATES,
  estimateCredits,
  type VideoSettings,
} from "@/lib/videonova";

export const Route = createFileRoute("/studio")({
  validateSearch: (search: Record<string, unknown>): { template?: string } => {
    const t = search["template"];
    return typeof t === "string" ? { template: t } : {};
  },
  head: () => ({
    meta: [
      { title: "AI Video Studio — VIDEONOVA AI" },
      {
        name: "description",
        content:
          "Describe a scene, tune the look, and generate a cinematic AI video in the VIDEONOVA AI studio.",
      },
      { property: "og:title", content: "AI Video Studio — VIDEONOVA AI" },
      {
        property: "og:description",
        content: "Prompt, style, camera and lighting controls for real AI video generation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Studio,
});

function useDeviceId() {
  const [id, setId] = useState("");
  useEffect(() => {
    let v = localStorage.getItem("videonova_device_id");
    if (!v) {
      v = crypto.randomUUID();
      localStorage.setItem("videonova_device_id", v);
    }
    setId(v);
  }, []);
  return id;
}

function Studio() {
  const { template } = Route.useSearch();
  const deviceId = useDeviceId();
  const [settings, setSettings] = useState<VideoSettings>(DEFAULT_SETTINGS);
  const [enhancing, setEnhancing] = useState(false);
  const [preEnhance, setPreEnhance] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [job, setJob] = useState<GenerationView | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const runEnhance = useServerFn(enhancePrompt);
  const runCreate = useServerFn(createGeneration);
  const runGet = useServerFn(getGeneration);
  const runBalance = useServerFn(getCreditBalance);

  useEffect(() => {
    if (!deviceId) return;
    runBalance({ data: { deviceId } })
      .then((r) => setBalance(r.remaining))
      .catch(() => setBalance(null));
  }, [deviceId, runBalance]);

  useEffect(() => {
    if (!template) return;
    const t = TEMPLATES.find((x) => x.id === template);
    if (!t) return;
    setSettings((s) => ({
      ...s,
      prompt: t.prompt,
      duration: t.duration,
      aspectRatio: t.aspectRatio,
      style: t.style,
      camera: t.camera,
      lighting: t.lighting,
    }));
  }, [template]);

  useEffect(() => () => void (timer.current && clearInterval(timer.current)), []);

  const credits = useMemo(() => estimateCredits(settings), [settings]);
  const previewPrompt = useMemo(() => {
    const base = settings.prompt.trim();
    if (!base) return "";
    const tail = `Visual style: ${settings.style}. Camera: ${settings.camera}. Lighting: ${settings.lighting}.`;
    return base.endsWith(".") ? `${base} ${tail}` : `${base}. ${tail}`;
  }, [settings.prompt, settings.style, settings.camera, settings.lighting]);
  const set = <K extends keyof VideoSettings>(key: K, value: VideoSettings[K]) =>
    setSettings((s) => ({ ...s, [key]: value }));

  function poll(id: string) {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(async () => {
      try {
        const view = await runGet({ data: { id } });
        setJob(view);
        if (view.status === "completed" || view.status === "failed") {
          if (timer.current) clearInterval(timer.current);
          if (view.status === "failed") toast.error(view.error ?? STATUS_COPY.failed);
        }
      } catch {
        /* keep polling */
      }
    }, 4000);
  }

  async function onEnhance() {
    if (settings.prompt.trim().length < 3) {
      toast.error("Describe your idea first.");
      return;
    }
    setEnhancing(true);
    try {
      const res = await runEnhance({
        data: {
          prompt: settings.prompt,
          style: settings.style,
          camera: settings.camera,
          lighting: settings.lighting,
          duration: settings.duration,
        },
      });
      setPreEnhance(settings.prompt);
      set("prompt", res.enhanced);
      toast.success("Prompt enhanced — your original is kept");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't enhance that prompt.");
    } finally {
      setEnhancing(false);
    }
  }

  async function onGenerate() {
    if (settings.prompt.trim().length < 4) {
      toast.error("Describe the video you want.");
      return;
    }
    if (!deviceId) return;
    setSubmitting(true);
    setJob(null);
    try {
      const res = await runCreate({
        data: {
          deviceId,
          mode: "text",
          prompt: settings.prompt,
          negativePrompt: settings.negativePrompt,
          duration: settings.duration,
          aspectRatio: settings.aspectRatio,
          resolution: settings.resolution,
          style: settings.style,
          camera: settings.camera,
          lighting: settings.lighting,
          modelTier: settings.modelTier,
        },
      });
      toast.success("Generation started");
      setBalance(res.creditsRemaining);
      poll(res.id);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Generation couldn't start.");
      if (deviceId) {
        runBalance({ data: { deviceId } })
          .then((r) => setBalance(r.remaining))
          .catch(() => undefined);
      }
    } finally {
      setSubmitting(false);
    }
  }

  const busy = submitting || (job !== null && job.status !== "completed" && job.status !== "failed");
  const outOfCredits = balance !== null && credits > balance;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold">AI Video Studio</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Describe a scene, tune the look, then generate.
            </p>
          </div>
          <div className="glass rounded-xl px-4 py-2 text-right">
            <p className="text-sm font-semibold text-primary">
              {balance ?? DAILY_FREE_CREDITS} / {DAILY_FREE_CREDITS} free credits today
            </p>
            <p className="text-xs text-muted-foreground">Refills every day at midnight UTC</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1.4fr_1fr]">
          <section className="glass rounded-2xl p-5">
            <Label htmlFor="prompt">Your idea</Label>
            <Textarea
              id="prompt"
              value={settings.prompt}
              onChange={(e) => set("prompt", e.target.value)}
              rows={9}
              placeholder="A slow dolly through a neon-lit Johannesburg street after rain..."
              className="mt-2 resize-none"
            />
            <Button
              variant="outline"
              className="mt-3 w-full"
              onClick={onEnhance}
              disabled={enhancing}
            >
              {enhancing ? (
                <Loader2 className="mr-1 size-4 animate-spin" />
              ) : (
                <Wand2 className="mr-1 size-4" />
              )}
              Enhance prompt
            </Button>
            {preEnhance !== null && (
              <Button
                variant="ghost"
                className="mt-2 w-full"
                onClick={() => {
                  set("prompt", preEnhance);
                  setPreEnhance(null);
                  toast.success("Original description restored");
                }}
              >
                <Undo2 className="mr-1 size-4" /> Undo enhance
              </Button>
            )}


            <Label htmlFor="negative" className="mt-5 block">
              Avoid (optional)
            </Label>
            <Input
              id="negative"
              value={settings.negativePrompt}
              onChange={(e) => set("negativePrompt", e.target.value)}
              placeholder="blurry, distorted faces, watermark"
              className="mt-2"
            />
          </section>

          <section className="glass rounded-2xl p-5">
            <div
              className={`relative overflow-hidden rounded-xl aurora ${
                settings.aspectRatio === "9:16" ? "mx-auto aspect-[9/16] max-w-xs" : "aspect-video"
              }`}
            >
              {job?.videoUrl ? (
                <video src={job.videoUrl} controls className="size-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                  <Sparkles className="size-7 text-primary" />
                  <p className="px-6 text-sm text-muted-foreground">
                    {job ? STATUS_COPY[job.status] : "Your video will appear here."}
                  </p>
                  {busy && <Loader2 className="size-5 animate-spin text-primary" />}
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button
                onClick={onGenerate}
                disabled={busy || !deviceId || outOfCredits}
                size="lg"
              >
                {busy ? <Loader2 className="mr-1 size-4 animate-spin" /> : null}
                Generate video
              </Button>
              <span className="text-sm text-muted-foreground">≈ {credits} credits</span>
              {job?.videoUrl && (
                <Button asChild variant="outline">
                  <a href={job.videoUrl} download>
                    <Download className="mr-1 size-4" /> Download
                  </a>
                </Button>
              )}
            </div>
            {job?.status === "failed" && (
              <p className="mt-3 text-sm text-destructive">{job.error ?? STATUS_COPY.failed}</p>
            )}
            {(job?.finalPrompt || settings.prompt.trim()) && (
              <details className="mt-4 rounded-lg border border-border/60 p-3">
                <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
                  Prompt sent to the engine
                </summary>
                <p className="mt-2 whitespace-pre-wrap text-xs text-muted-foreground">
                  {job?.finalPrompt ?? previewPrompt}
                </p>
              </details>
            )}
          </section>

          <section className="glass space-y-4 rounded-2xl p-5">
            <Picker
              label="Duration"
              value={String(settings.duration)}
              options={DURATIONS.map((d) => ({ value: String(d), label: `${d} seconds` }))}
              onChange={(v) => set("duration", Number(v))}
            />
            <Picker
              label="Aspect ratio"
              value={settings.aspectRatio}
              options={ASPECT_RATIOS.map((a) => ({ value: a, label: a }))}
              onChange={(v) => set("aspectRatio", v as VideoSettings["aspectRatio"])}
            />
            <Picker
              label="Resolution"
              value={settings.resolution}
              options={RESOLUTIONS.map((r) => ({ value: r, label: r }))}
              onChange={(v) => set("resolution", v as VideoSettings["resolution"])}
            />
            <Picker
              label="Style"
              value={settings.style}
              options={STYLES.map((s) => ({ value: s, label: s }))}
              onChange={(v) => set("style", v)}
            />
            <Picker
              label="Camera"
              value={settings.camera}
              options={CAMERAS.map((s) => ({ value: s, label: s }))}
              onChange={(v) => set("camera", v)}
            />
            <Picker
              label="Lighting"
              value={settings.lighting}
              options={LIGHTING.map((s) => ({ value: s, label: s }))}
              onChange={(v) => set("lighting", v)}
            />
            <Picker
              label="Quality"
              value={settings.modelTier}
              options={MODEL_TIERS.map((t) => ({ value: t.id, label: t.label }))}
              onChange={(v) => set("modelTier", v as VideoSettings["modelTier"])}
            />
            <p className="text-xs text-muted-foreground">
              Need a starting point?{" "}
              <Link to="/templates" className="text-primary hover:underline">
                Browse templates
              </Link>
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Picker({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label className="mb-2 block">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
