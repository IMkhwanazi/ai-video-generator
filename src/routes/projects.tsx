import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import { Button } from "@/components/ui/button";
import { listGenerations } from "@/lib/video.functions";
import { STATUS_COPY, type GenerationStatus } from "@/lib/videonova";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Your Projects — VIDEONOVA AI" },
      {
        name: "description",
        content: "Every video you've generated on this device, ready to watch or download.",
      },
      { property: "og:title", content: "Your Projects — VIDEONOVA AI" },
      {
        property: "og:description",
        content: "Watch, download and revisit the AI videos you've generated.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Projects;
});

interface Item {
  id: string;
  title: string;
  status: GenerationStatus;
  duration: number;
  aspectRatio: string;
  resolution: string;
  createdAt: string;
  videoUrl: string | null;
}

function Projects() {
  const run = useServerFn(listGenerations);
  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    let deviceId = localStorage.getItem("videonova_device_id");
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem("videonova_device_id", deviceId);
    }
    run({ data: { deviceId } })
      .then((res) => setItems(res.items as Item[]))
      .catch(() => setItems([]));
  }, [run]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Your projects</h1>
        <p className="mt-2 text-muted-foreground">
          Videos you've generated on this device. Sign-in and shared libraries come later.
        </p>

        {items === null && (
          <div className="mt-16 flex justify-center">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        )}

        {items?.length === 0 && (
          <div className="glass mt-10 rounded-2xl p-10 text-center">
            <p className="text-muted-foreground">You haven't generated a video yet.</p>
            <Button asChild className="mt-5">
              <Link to="/studio">Create your first video</Link>
            </Button>
          </div>
        )}

        {items && items.length > 0 && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div key={item.id} className="glass rounded-2xl p-4">
                <div className="overflow-hidden rounded-xl aurora">
                  {item.videoUrl ? (
                    <video src={item.videoUrl} controls className="aspect-video w-full object-cover" />
                  ) : (
                    <div className="flex aspect-video items-center justify-center px-4 text-center text-xs text-muted-foreground">
                      {STATUS_COPY[item.status]}
                    </div>
                  )}
                </div>
                <h2 className="mt-3 line-clamp-2 text-sm font-semibold">{item.title}</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.duration}s · {item.aspectRatio} · {item.resolution} ·{" "}
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
