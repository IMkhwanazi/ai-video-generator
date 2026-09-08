// Provider abstraction for AI video generation.
//
// Adding a new provider (Runway, Kling, Luma, ...) means implementing
// VideoProvider and registering it in `getVideoProvider()`. Nothing in the UI
// depends on provider specifics.

import type { ModelTier, VideoSettings } from "./videonova";

const GATEWAY = "https://ai.gateway.lovable.dev/v1";

export interface GenerateRequest {
  prompt: string;
  negativePrompt?: string;
  duration: number;
  aspectRatio: VideoSettings["aspectRatio"];
  resolution: VideoSettings["resolution"];
  modelTier: ModelTier;
  style?: string;
  camera?: string;
  lighting?: string;
  imageBase64?: string;
  imageMimeType?: string;
}

/** Deterministic prompt assembly so the same settings always read the same way. */
export function composeFinalPrompt(req: {
  prompt: string;
  style?: string;
  camera?: string;
  lighting?: string;
}) {
  const base = req.prompt.trim().replace(/\s+$/g, "");
  const parts: string[] = [];
  if (req.style) parts.push(`Visual style: ${req.style}`);
  if (req.camera) parts.push(`Camera: ${req.camera}`);
  if (req.lighting) parts.push(`Lighting: ${req.lighting}`);
  if (!parts.length) return base;
  const tail = `${parts.join(". ")}.`;
  return base.endsWith(".") ? `${base} ${tail}` : `${base}. ${tail}`;
}

export type ProviderStatus = "processing" | "completed" | "failed";

export interface ProviderJob {
  jobId: string;
  status: ProviderStatus;
  error?: string;
}

export interface VideoProvider {
  readonly id: string;
  generateVideo(req: GenerateRequest): Promise<ProviderJob>;
  getGenerationStatus(jobId: string): Promise<ProviderJob>;
  cancelGeneration(jobId: string): Promise<void>;
  downloadVideo(jobId: string): Promise<ArrayBuffer>;
}

export class ProviderError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly retryable: boolean,
  ) {
    super(message);
  }
}

const MODEL_BY_TIER: Record<ModelTier, string> = {
  fast: "google/gemini-omni-1.1-flash",
  balanced: "google/veo-3.1-lite",
  cinematic: "google/veo-3.1-fast",
  quality: "google/veo-3.1",
};

function nearestVeoDuration(seconds: number) {
  return [4, 6, 8].reduce((best, option) =>
    Math.abs(option - seconds) < Math.abs(best - seconds) ? option : best,
  );
}

function friendlyError(status: number, message: string) {
  if (status === 402) return message || "This workspace is out of AI credits for video generation.";
  if (status === 429) return "The video engine is busy right now. Please try again in a moment.";
  if (status === 400) return message || "That request couldn't be generated. Try adjusting your prompt.";
  return message || "The video engine is unavailable right now.";
}

class LovableVideoProvider implements VideoProvider {
  readonly id = "lovable";

  private key(): string {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new ProviderError("Video generation is not configured.", 401, false);
    return key;
  }

  private async request(path: string, init?: RequestInit) {
    const res = await fetch(`${GATEWAY}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.key()}`,
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { message?: string } | null;
      throw new ProviderError(
        friendlyError(res.status, body?.message ?? ""),
        res.status,
        res.status === 429 || res.status >= 500,
      );
    }
    return res;
  }

  private buildBody(req: GenerateRequest) {
    const model = MODEL_BY_TIER[req.modelTier];

    if (model === "google/gemini-omni-1.1-flash") {
      const input: unknown[] = [{ type: "text", text: this.composePrompt(req) }];
      if (req.imageBase64) {
        input.push({
          type: "image",
          data: req.imageBase64,
          mime_type: req.imageMimeType ?? "image/png",
        });
      }
      return {
        model,
        input,
        response_format: {
          type: "video",
          resolution: req.resolution,
          duration: `${Math.min(10, Math.max(3, Math.round(req.duration)))}s`,
          aspect_ratio: req.aspectRatio,
        },
      };
    }

    // Veo family
    const resolution = req.resolution === "360p" ? "720p" : req.resolution;
    const durationSeconds = resolution === "1080p" || req.imageBase64 ? 8 : nearestVeoDuration(req.duration);
    const instance: Record<string, unknown> = { prompt: this.composePrompt(req) };
    if (req.imageBase64) {
      instance["image"] = {
        bytesBase64Encoded: req.imageBase64,
        mimeType: req.imageMimeType ?? "image/png",
      };
    }
    const parameters: Record<string, unknown> = {
      durationSeconds,
      resolution,
      sampleCount: 1,
      generateAudio: true,
    };
    if (!req.imageBase64) parameters["aspectRatio"] = req.aspectRatio;
    if (req.negativePrompt) parameters["negativePrompt"] = req.negativePrompt;

    return { model, instances: [instance], parameters };
  }

  private composePrompt(req: GenerateRequest) {
    return composeFinalPrompt(req);
  }

  async generateVideo(req: GenerateRequest): Promise<ProviderJob> {
    const res = await this.request("/videos", {
      method: "POST",
      body: JSON.stringify(this.buildBody(req)),
    });
    const job = (await res.json()) as { id: string; status?: string };
    return { jobId: job.id, status: "processing" };
  }

  async getGenerationStatus(jobId: string): Promise<ProviderJob> {
    const res = await this.request(`/videos/${jobId}`);
    const job = (await res.json()) as {
      id: string;
      status: string;
      error?: { code?: string; message?: string };
    };
    if (job.status === "completed") return { jobId, status: "completed" };
    if (job.status === "failed") {
      return {
        jobId,
        status: "failed",
        error:
          job.error?.code === "moderation_blocked"
            ? "This request was blocked by content safety. Try a different prompt or image."
            : (job.error?.message ?? "The video could not be generated."),
      };
    }
    return { jobId, status: "processing" };
  }

  async cancelGeneration(): Promise<void> {
    // The gateway has no cancel endpoint; the job is abandoned locally.
  }

  async downloadVideo(jobId: string): Promise<ArrayBuffer> {
    const res = await this.request(`/videos/${jobId}/content`);
    return res.arrayBuffer();
  }
}

export function getVideoProvider(): VideoProvider {
  const configured = process.env["VIDEO_PROVIDER"] ?? "lovable";
  switch (configured) {
    case "lovable":
    default:
      return new LovableVideoProvider();
  }
}
