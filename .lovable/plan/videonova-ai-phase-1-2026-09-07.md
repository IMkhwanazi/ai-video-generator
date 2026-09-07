# VIDEONOVA AI — Phase 1

A premium AI video studio: a high-converting landing page plus a working creation workspace where a prompt really turns into a video. No sign-up in this phase.

## What you'll be able to do

- Land on a polished marketing page: hero, live "generating" preview, feature grid, templates strip, pricing, final call to action, footer.
- Open the studio and describe a video, or upload an image to animate.
- Pick duration, aspect ratio, resolution, visual style, camera and lighting, plus optional advanced settings (negative prompt, model tier).
- Press "Enhance prompt" to have AI expand a vague idea into a detailed cinematic description you can still edit.
- Review a generation summary (duration, size, model, estimated credits) before starting.
- Watch real progress steps — preparing, generating, rendering, finalising — while the page stays usable.
- Play the finished video, download it, retry on failure, or generate a variation.
- Browse a template library that pre-fills the studio with a ready-made prompt and settings.
- View plans and pricing on a dedicated page.

## Pages

- `/` — landing page
- `/studio` — creation workspace (left prompt panel, centre preview, right settings, scene strip at the bottom)
- `/templates` — template library
- `/pricing` — plans
- `/projects` — recent generations from this browser

## Look and feel

Deep black and charcoal surfaces, white text, electric violet accent with soft blue-purple gradients. Glass panels, glowing borders, restrained motion. Manrope for headings, Inter for interface text. Fully responsive; the studio is desktop-first but stacks cleanly on tablet and phone.

## How generation works

Videos are generated with Lovable's built-in AI, so it works immediately with no external accounts or keys. The flow: your prompt is optionally enhanced by AI, a job is created on the server, the studio polls its status, and the finished video is stored and shown. Keys stay server-side only. Failures surface a plain-language message with retry and edit-prompt options.

Because video generation is expensive, it only ever starts from an explicit click, one job at a time, with a confirmation summary first.

## Storage and accounts

This phase needs the built-in backend (Lovable Cloud) so finished videos are stored safely and jobs survive a page refresh. Generated videos and job records are kept there; the project list on this device links to them. Sign-in, saved projects per user, credits enforcement, and Stripe checkout come in the next phase — pricing is presented but not yet purchasable.

## Technical notes

- TanStack Start routes; the studio uses server functions for enhance-prompt, create-job, poll-status, and store-output.
- Video generation goes through a `VideoProvider` interface (`generateVideo`, `getStatus`, `cancel`, `extend`) with a Lovable AI adapter first, so another provider can be added later without touching the UI.
- Lovable Cloud tables: `generations` (prompt, settings, status, provider job id, output path, error), `projects`, `templates` seeded with literal rows. Private storage bucket for MP4s, served via signed URLs.
- Job creation is one endpoint; the client polls a status endpoint every 5–10s and the server stores the MP4 to the bucket on completion.
- Prompt input is validated and length-capped server-side; unsafe requests are refused with a clear explanation.

## Later phases (not in this build)

Accounts, credits and billing, voiceover, music, captions, multi-scene storyboard editing, timeline editor, AI editing tools, brand kit, asset library, admin dashboard.
