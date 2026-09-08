# Keep the video faithful to the prompt

Right now the video you get back can drift from what you typed. Three real causes exist in the app today:

1. The Style, Camera and Lighting choices are saved with the job but never sent to the video engine — only the raw text goes through, so those settings have no effect on the result.
2. Long descriptions (over ~1800 characters) are silently rewritten by the AI into a short paragraph, which can drop names, colours, actions and other specifics you wrote.
3. "Enhance prompt" replaces your text outright, so your original wording is lost and a second generation can look like a different scene.

## What changes

- Every generation sends one consistently assembled prompt: your description first, then the chosen style, camera movement and lighting appended as a short cinematic line, so the same settings always produce the same framing language.
- Shortening long text becomes detail-preserving: the instruction changes from "distill" to "compress without inventing or removing concrete details" (subjects, counts, colours, wardrobe, location, actions, on-screen text, mood), and the hard character cut becomes a last-resort fallback that trims at a sentence boundary rather than mid-word.
- The exact text sent to the engine is saved with the job, so re-running or reviewing a video shows what actually produced it.
- "Enhance prompt" keeps your original: the enhanced version fills the editor, but the original stays recoverable with an "Undo enhance" action, and the enhancer is instructed to preserve every concrete detail instead of replacing them with generic cinematic phrasing.
- The Studio preview panel shows a small "Prompt sent to the engine" summary before and after generating, so there are no surprises.

## Technical notes

- `src/lib/video-provider.server.ts`: extend `GenerateRequest` with optional `style`, `camera`, `lighting`; implement `composePrompt` to append a single deterministic clause (`Visual style: X. Camera: Y. Lighting: Z.`) when they are set, for both the Gemini and Veo request bodies. No other provider behaviour changes.
- `src/lib/video.functions.ts`: pass style/camera/lighting into `provider.generateVideo`; rewrite the condensing system prompt to preserve concrete details and raise the trigger threshold to ~4000 characters; replace the blind `slice(0, 1800)` with a sentence-boundary trim; store the final composed prompt in a new `final_prompt` column on `generations` and return it from `getGeneration`.
- Migration: `alter table public.generations add column final_prompt text;` (nullable, no grant changes needed).
- `src/routes/studio.tsx`: keep the pre-enhance prompt in state with an Undo enhance button; render the returned `final_prompt` under the preview when present.

Not included: multi-scene consistency, seeds/character locking, or reference-image identity — those need a different provider feature set and can follow later.
