import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  estimateCredits,
  type GenerationStatus,
  type VideoSettings,
} from "./videonova";

const settingsSchema = z.object({
  deviceId: z.string().min(8).max(64),
  mode: z.enum(["text", "image"]),
  prompt: z.string().min(4).max(24000),
  negativePrompt: z.string().max(500).optional().default(""),
  duration: z.number().int().min(3).max(10),
  aspectRatio: z.enum(["16:9", "9:16"]),
  resolution: z.enum(["360p", "720p", "1080p"]),
  style: z.string().max(60),
  camera: z.string().max(60),
  lighting: z.string().max(60),
  modelTier: z.enum(["fast", "balanced", "cinematic", "quality"]),
  imageBase64: z.string().max(8_000_000).optional(),
  imageMimeType: z.string().max(80).optional(),
});

const BLOCKED = [
  "child porn",
  "csam",
  "nude child",
  "rape",
  "bestiality",
  "how to make a bomb",
  "build a bomb",
  "make meth",
  "nonconsensual",
  "non-consensual nude",
  "revenge porn",
];

function safetyCheck(prompt: string) {
  const lower = prompt.toLowerCase();
  const hit = BLOCKED.find((term) => lower.includes(term));
  if (hit) {
    throw new Error(
      "This request can't be generated because it appears to involve unsafe or prohibited content. Please describe a different scene.",
    );
  }
}

async function chat(messages: Array<{ role: string; content: string }>) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI features are not configured.");
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "openai/gpt-5.6-sol", reasoning_effort: "none", messages }),
  });
  if (!res.ok) {
    if (res.status === 429) throw new Error("The AI is busy right now — try again in a moment.");
    if (res.status === 402) throw new Error("This workspace is out of AI credits.");
    throw new Error("The AI couldn't respond right now.");
  }
  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

export const enhancePrompt = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        prompt: z.string().min(3).max(24000),
        style: z.string().max(60).optional(),
        camera: z.string().max(60).optional(),
        lighting: z.string().max(60).optional(),
        duration: z.number().int().min(3).max(10).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    safetyCheck(data.prompt);
    const enhanced = await chat([
      {
        role: "system",
        content:
          "You are a cinematography director writing prompts for an AI video model. Expand the user's idea into ONE vivid English paragraph (max 110 words) describing a single continuous scene: subject, environment, camera movement, lens feel, lighting, motion, composition, atmosphere and audio direction. No lists, no headings, no quotation marks, no on-screen text instructions unless the user asked for text.",
      },
      {
        role: "user",
        content: `Idea: ${data.prompt}\nVisual style: ${data.style ?? "Cinematic"}\nCamera: ${data.camera ?? "Dolly"}\nLighting: ${data.lighting ?? "Natural"}\nLength: about ${data.duration ?? 8} seconds`,
      },
    ]);
    return { enhanced: enhanced || data.prompt };
  });

export const createGeneration = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => settingsSchema.parse(input))
  .handler(async ({ data }) => {
    safetyCheck(data.prompt);
    const { getVideoProvider, ProviderError } = await import("./video-provider.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const provider = getVideoProvider();

    try {
      const job = await provider.generateVideo({
        prompt: data.prompt,
        negativePrompt: data.negativePrompt,
        duration: data.duration,
        aspectRatio: data.aspectRatio,
        resolution: data.resolution,
        modelTier: data.modelTier,
        ...(data.imageBase64 ? { imageBase64: data.imageBase64 } : {}),
        ...(data.imageMimeType ? { imageMimeType: data.imageMimeType } : {}),
      });

      const { data: row, error } = await supabaseAdmin
        .from("generations")
        .insert({
          device_id: data.deviceId,
          title: data.prompt.slice(0, 70),
          prompt: data.prompt,
          negative_prompt: data.negativePrompt || null,
          mode: data.mode,
          duration: data.duration,
          aspect_ratio: data.aspectRatio,
          resolution: data.resolution,
          style: data.style,
          camera: data.camera,
          lighting: data.lighting,
          model_tier: data.modelTier,
          provider: provider.id,
          provider_job_id: job.jobId,
          status: "processing",
          credits: estimateCredits({
            duration: data.duration,
            resolution: data.resolution,
            modelTier: data.modelTier,
          } as VideoSettings),
        })
        .select("id")
        .single();

      if (error) throw new Error("Your video started but couldn't be saved. Please try again.");
      return { id: row.id as string };
    } catch (err) {
      if (err instanceof ProviderError) throw new Error(err.message);
      throw err;
    }
  });

export interface GenerationView {
  id: string;
  status: GenerationStatus;
  title: string;
  prompt: string;
  duration: number;
  aspectRatio: string;
  resolution: string;
  modelTier: string;
  credits: number;
  createdAt: string;
  error: string | null;
  videoUrl: string | null;
}

export const getGeneration = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }): Promise<GenerationView> => {
    const { getVideoProvider, ProviderError } = await import("./video-provider.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: row, error } = await supabaseAdmin
      .from("generations")
      .select("*")
      .eq("id", data.id)
      .single();
    if (error || !row) throw new Error("That video could not be found.");

    let status = row.status as GenerationStatus;
    let videoPath = row.video_path as string | null;
    let errorMessage = row.error_message as string | null;

    if (status !== "completed" && status !== "failed" && row.provider_job_id) {
      const provider = getVideoProvider();
      try {
        const job = await provider.getGenerationStatus(row.provider_job_id);
        if (job.status === "completed") {
          const bytes = await provider.downloadVideo(row.provider_job_id);
          const path = `${row.device_id}/${row.id}.mp4`;
          const upload = await supabaseAdmin.storage
            .from("generated-videos")
            .upload(path, bytes, { contentType: "video/mp4", upsert: true });
          if (upload.error) throw new Error("The finished video couldn't be saved.");
          videoPath = path;
          status = "completed";
          await supabaseAdmin
            .from("generations")
            .update({ status, video_path: path })
            .eq("id", row.id);
        } else if (job.status === "failed") {
          status = "failed";
          errorMessage = job.error ?? "The video could not be generated.";
          await supabaseAdmin
            .from("generations")
            .update({ status, error_message: errorMessage })
            .eq("id", row.id);
        } else {
          status = "rendering";
        }
      } catch (err) {
        if (err instanceof ProviderError && !err.retryable) {
          status = "failed";
          errorMessage = err.message;
          await supabaseAdmin
            .from("generations")
            .update({ status, error_message: errorMessage })
            .eq("id", row.id);
        }
      }
    }

    let videoUrl: string | null = null;
    if (videoPath) {
      const signed = await supabaseAdmin.storage
        .from("generated-videos")
        .createSignedUrl(videoPath, 3600);
      videoUrl = signed.data?.signedUrl ?? null;
    }

    return {
      id: row.id as string,
      status,
      title: (row.title as string | null) ?? "Untitled video",
      prompt: row.prompt as string,
      duration: row.duration as number,
      aspectRatio: row.aspect_ratio as string,
      resolution: row.resolution as string,
      modelTier: row.model_tier as string,
      credits: row.credits as number,
      createdAt: row.created_at as string,
      error: errorMessage,
      videoUrl,
    };
  });

export const listGenerations = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ deviceId: z.string().min(8).max(64) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows } = await supabaseAdmin
      .from("generations")
      .select("id, title, status, duration, aspect_ratio, resolution, model_tier, credits, created_at, video_path")
      .eq("device_id", data.deviceId)
      .order("created_at", { ascending: false })
      .limit(30);

    const items = await Promise.all(
      (rows ?? []).map(async (row) => {
        let videoUrl: string | null = null;
        if (row.video_path) {
          const signed = await supabaseAdmin.storage
            .from("generated-videos")
            .createSignedUrl(row.video_path as string, 3600);
          videoUrl = signed.data?.signedUrl ?? null;
        }
        return {
          id: row.id as string,
          title: (row.title as string | null) ?? "Untitled video",
          status: row.status as GenerationStatus,
          duration: row.duration as number,
          aspectRatio: row.aspect_ratio as string,
          resolution: row.resolution as string,
          modelTier: row.model_tier as string,
          credits: row.credits as number,
          createdAt: row.created_at as string,
          videoUrl,
        };
      }),
    );
    return { items };
  });
