# AI Video Generator

Absolutely. If you're using an AI website builder such as Lovable, Bolt, Replit, v0, or another code-generation platform, you want a detailed product prompt that specifies the UI, AI workflow, backend logic, generation pipeline, user dashboard, and monetisation.

Here’s a comprehensive prompt you can paste directly into an AI website builder: BUILD PROMPT — AI VIDEO GENERATION PLATFORM.  Build a fully functional, production-ready AI video generation web application called VIDEONOVA AI. The platform should be an advanced AI content creation studio that allows users to generate professional-quality videos from text prompts, images, scripts, and existing media. The website must feel like a premium AI SaaS product rather than a simple landing page. The priority is functionality, speed, reliability, excellent UX, and a realistic AI-video-generation workflow.

1. CORE PRODUCT

Create an AI-powered video creation platform where users can:

Generate videos from text prompts.

Generate videos from images.

Turn scripts into complete videos.

Create cinematic AI scenes.

Generate social-media videos.

Create advertisements.

Create product videos.

Create explainer videos.

Create educational videos.

Create music/video visualisers.

Generate multiple scenes within one video.

Add AI voiceovers.

Add background music.

Add subtitles/captions.

Edit generated videos.

Regenerate individual scenes.

Extend videos.

Change video style.

Export finished videos.

The application should behave like a combination of an AI video generator, creative studio, and lightweight video editor.

2. VISUAL IDENTITY

Design the platform with a premium futuristic aesthetic.

Colour palette

Primary:

Deep black

Charcoal

White

Accent:

Electric violet

Soft blue/purple gradients

Use subtle gradients, glassmorphism, soft shadows, glowing borders, and smooth animations.

Avoid excessive visual effects. The interface must remain professional and easy to use.

Typography

Use a modern sans-serif font such as:

Inter

Geist

Manrope

Use large, confident headings and highly readable interface text.

3. LANDING PAGE

Create a high-converting landing page.

Navigation

Logo:

VIDEONOVA AI

Navigation:

AI Video

Features

Templates

Pricing

Resources

Login

Start Creating

Primary CTA:

Create Your First Video

Secondary CTA:

Watch Demo

HERO SECTION

Headline:

Turn Your Ideas Into Stunning AI Videos.

Subheadline:

Generate cinematic, social-ready and professional videos from simple prompts, images and scripts — powered by intelligent AI creation tools.

CTA:

Start Creating Free

Secondary CTA:

Explore Templates

Add an interactive video preview on the right side.

The preview should display AI-generated cinematic content.

Include a small interface showing:

"Generating video..."

with an animated progress indicator.

4. AI VIDEO GENERATOR

This is the most important part of the application.

Create a powerful AI video-generation workspace.

The user should be able to access it through:

Create → AI Video

The interface should have a professional creative-studio layout.

LEFT SIDEBAR

Include:

Create

Projects

Templates

Assets

Voices

Music

Brand Kit

AI Tools

Exports

Settings

5. VIDEO CREATION WORKSPACE

Create a large workspace divided into:

Left panel

Prompt and generation controls.

Centre

Video preview/canvas.

Bottom

Timeline.

Right panel

Advanced settings.

6. PROMPT INPUT

Create a large prompt box.

Placeholder:

Describe the video you want to create...

Example:

"Create a cinematic 20-second advertisement for a luxury South African coffee brand. Show close-up shots of freshly roasted coffee beans, espresso pouring into a ceramic cup, steam rising dramatically, and a stylish young professional enjoying the coffee in a modern café."

Include:

Enhance Prompt

The AI should automatically improve vague prompts by adding:

Camera movement

Lighting

Composition

Subject details

Environment

Motion

Cinematic direction

Visual style

7. GENERATION MODES

Allow users to select:

Text → Video

Generate video entirely from a written prompt.

Image → Video

Upload an image and animate it.

Script → Video

Paste a script and automatically generate scenes.

Storyboard → Video

Create individual scenes and combine them.

Product → Video

Upload a product image and generate an advertisement.

Video → Video

Upload an existing video and transform its visual style.

8. VIDEO SETTINGS

Allow users to configure:

Duration

5 seconds

10 seconds

15 seconds

30 seconds

60 seconds

Custom

Aspect Ratio

16:9

9:16

1:1

4:5

Resolution

720p

1080p

4K

FPS

24 FPS

30 FPS

60 FPS

Visual Style

Cinematic

Photorealistic

Commercial

Anime

Documentary

3D

Cartoon

Fashion

Luxury

Cyberpunk

Minimalist

Vintage

Film

Social Media

Camera

Static

Pan

Tilt

Dolly

Tracking

Crane

Handheld

Drone

Orbit

Zoom

Lighting

Natural

Studio

Golden Hour

Neon

Dramatic

Soft

Low-key

High-key

9. NEGATIVE PROMPT

Include an advanced optional field:

Negative Prompt

Example:

"blurry, distorted face, extra fingers, unrealistic movement, low quality, warped objects"

Allow users to hide/show advanced settings.

10. AI GENERATION ENGINE

Build the application architecture so that AI video models can be connected through APIs.

Do NOT create a fake generation system that simply displays a pre-existing video.

Implement a proper asynchronous generation architecture.

The application should support configurable AI providers.

Create an abstraction layer such as:

VideoGenerationProvider

with support for providers such as:

Runway

Kling

Luma

Google Veo

OpenAI-compatible video APIs

Other future video-generation providers

The provider should be configurable through environment variables.

Example architecture:

User Prompt
      ↓
Prompt Enhancement AI
      ↓
Scene Generator
      ↓
Video Generation Provider
      ↓
Generation Queue
      ↓
Processing
      ↓
Storage
      ↓
Video Preview
      ↓
AI Editing
      ↓
Export

Never expose API keys to the frontend.

11. GENERATION QUEUE

Video generation can take time, therefore implement a real asynchronous job system.

When a user clicks:

Generate Video

create a generation job.

Display:

Preparing your video...

Then:

Generating scenes...

Then:

Rendering video...

Then:

Adding audio...

Then:

Finalising...

Then:

Your video is ready.

The UI must remain responsive while generation occurs.

Users should be able to navigate away and return to their project.

12. GENERATION STATUS

Each generation should have a status:

Queued

Processing

Generating

Rendering

Completed

Failed

Cancelled

If generation fails:

Display:

Something went wrong while generating your video.

Buttons:

Retry

Change Settings

Contact Support

13. MULTI-SCENE GENERATION

Allow users to create multiple scenes.

Example:

Scene 1

5 seconds

Description:
"Drone shot over Cape Town at sunrise."

Scene 2

5 seconds

Description:
"Close-up of a luxury coffee cup."

Scene 3

5 seconds

Description:
"Young professional drinking coffee."

Scene 4

5 seconds

Description:
"Product logo and call-to-action."

Each scene should have:

Prompt

Duration

Camera

Style

Transition

Regenerate button

Duplicate button

Delete button

Preview

Allow the user to generate individual scenes instead of regenerating the entire video.

14. STORYBOARD

Create a visual storyboard.

Each scene should appear as a card:

Scene 01
Thumbnail
Duration
Prompt

Scene 02
Thumbnail
Duration
Prompt

Allow drag-and-drop reordering.

Add:

+ Add Scene

15. AI SCRIPT GENERATOR

Create an AI script-generation tool.

User enters:

What should the video be about?

Example:

"Create a 30-second advertisement for a luxury sneaker brand."

Allow users to choose:

Platform

Duration

Audience

Tone

Language

Generate:

Hook

Voiceover

Scenes

Visual directions

On-screen text

CTA

Button:

Generate Script

Then:

Convert Script to Video

16. AI VOICEOVER

Create a voice-generation system.

Users can select:

Voice

Male

Female

Neutral

Tone

Professional

Energetic

Calm

Dramatic

Friendly

Luxury

Storytelling

Language

Support multiple languages.

Allow:

Preview Voice

and:

Generate Voiceover

Synchronise voiceover timing with scenes.

17. AI MUSIC

Create an AI music generator.

Allow users to describe:

"Create an uplifting cinematic soundtrack with African-inspired percussion."

Options:

Cinematic

Corporate

Hip-hop

Electronic

Ambient

Afrobeat

Lo-fi

Inspirational

Luxury

Controls:

Volume

Fade in

Fade out

Start position

18. AUTO CAPTIONS

Automatically generate subtitles.

Support:

Word-by-word captions

Standard subtitles

Highlight captions

Karaoke style

Social media captions

Allow:

Font selection

Size

Position

Animation

Colour

Background

19. AI VIDEO EDITOR

Create a lightweight browser-based editor.

Timeline features:

Video tracks

Audio tracks

Text tracks

Subtitle tracks

Scene transitions

Trim

Split

Crop

Resize

Rotate

Speed

Volume

Fade

Filters

Allow users to drag scenes around the timeline.

20. AI EDITING TOOLS

Add an AI Tools section containing:

Remove Background

Automatically remove backgrounds.

Object Removal

Remove unwanted objects.

Video Upscaler

Improve video resolution.

Frame Interpolation

Create smoother motion.

Video Extension

Extend an existing generated scene.

Style Transfer

Transform the visual style.

Lip Sync

Synchronise speech with a character.

Face Animation

Animate portraits.

Image Animation

Turn static images into moving scenes.

Smart Crop

Automatically resize content for different platforms.

21. SOCIAL MEDIA MODE

Create a dedicated:

Social Video

mode.

Platforms:

TikTok

Instagram Reels

YouTube Shorts

YouTube

Facebook

LinkedIn

Automatically configure:

Aspect ratio

Duration

Caption placement

Hook

CTA

Safe zones

Allow:

Generate Social Video

22. TEMPLATES

Create a template marketplace/library.

Categories:

Advertisements

TikTok

Instagram

YouTube

Business

Education

Real Estate

Fashion

Restaurants

Fitness

Travel

Music

Product Launch

Personal Branding

Each template should display:

Preview

Duration

Aspect ratio

Style

Use Template

23. PROJECT DASHBOARD

Create a dashboard displaying:

Welcome back 👋

Create something amazing today.

Buttons:

New Video

From Template

Upload Media

Then display:

Recent Projects

Cards containing:

Thumbnail

Project name

Date

Duration

Resolution

Status

More menu

24. ASSET LIBRARY

Users should have a central asset library.

Categories:

Videos

Images

Audio

Voiceovers

Music

Logos

Fonts

Allow:

Upload

Search

Filter

Delete

Rename

Download

25. BRAND KIT

Allow businesses and creators to save:

Logo

Brand colours

Fonts

Brand voice

Intro

Outro

Watermark

When generating a video, users can enable:

Use Brand Kit

The AI should automatically incorporate the saved brand identity.

26. EXPORT SYSTEM

Create a professional export modal.

Options:

Format

MP4

MOV

WebM

Resolution

720p

1080p

4K

Quality

Standard

High

Maximum

Watermark

None

Brand watermark

Display estimated processing time.

Button:

Export Video

After completion:

Download

Share

Copy Link

27. USER AUTHENTICATION

Implement secure authentication.

Support:

Email/password

Google login

Apple login

Create:

Login

Sign Up

Forgot Password

Email Verification

Use secure session management.

28. CREDIT SYSTEM

Implement a credit-based generation system.

Example:

Free

100 credits/month

Creator

1,000 credits/month

Pro

5,000 credits/month

Studio

20,000 credits/month

Show:

Credits remaining: 742

Before generation:

This video will use approximately 80 credits.

If insufficient:

Get More Credits

29. BILLING

Create subscription management.

Include:

Current plan

Credits

Renewal date

Payment method

Billing history

Upgrade

Downgrade

Cancel subscription

Use Stripe or another secure payment provider.

Never store raw card information.

30. ADMIN DASHBOARD

Create an admin panel.

Admin should see:

Users

Total users

Active users

New users

Subscription status

Generations

Total generations

Successful generations

Failed generations

Average generation time

Revenue

Monthly revenue

Subscriptions

Credit purchases

AI Providers

Display provider status:

Online

Degraded

Offline

Allow administrators to configure providers and model availability.

31. DATABASE

Use a scalable relational database such as PostgreSQL.

Create tables for:

users

subscriptions

projects

scenes

generations

generation_jobs

assets

videos

audio

templates

credits

transactions

brand_kits

exports

notifications

Use proper foreign keys and indexes.

32. FILE STORAGE

Use scalable object storage for:

Videos

Images

Audio

Thumbnails

Project assets

Do not store large video files directly inside the relational database.

Use signed URLs for private media.

33. PERFORMANCE

Performance is extremely important.

Implement:

Lazy loading

CDN delivery

Image optimisation

Video thumbnails

Background processing

Caching

Database indexing

API request throttling

Job queues

Retry logic

Error handling

The application should remain responsive even while videos are being generated.

34. RESPONSIVE DESIGN

The platform must work on:

Desktop

Laptop

Tablet

Mobile

The video editor should prioritise desktop but remain usable on tablets and mobile.

35. SECURITY

Implement:

Authentication

Authorisation

Rate limiting

Input validation

API key protection

Secure file uploads

File type validation

Signed media URLs

CSRF protection where applicable

XSS protection

SQL injection protection

Secure environment variables

Never expose AI provider API keys in client-side JavaScript.

36. CONTENT SAFETY

Implement moderation before sending prompts to external generation models.

Flag or reject requests involving:

Illegal content

Explicit sexual content

Exploitative content

Dangerous instructions

Non-consensual intimate imagery

Impersonation/deceptive deepfakes

Copyright-infringing requests where applicable

For sensitive generation requests, provide a clear explanation rather than silently failing.

37. NOTIFICATIONS

Create notifications for:

Video generation complete

Generation failed

Export complete

Credits running low

Subscription renewal

System announcements

Support browser notifications where permitted.

38. SEARCH

Implement global search.

Users should be able to search:

Projects

Videos

Templates

Assets

Scripts

39. USER EXPERIENCE

The application should feel extremely fast.

Use:

Skeleton loaders

Progress indicators

Optimistic UI where appropriate

Toast notifications

Smooth transitions

Keyboard shortcuts

Autosave

Undo/redo

Autosave projects automatically.

Show:

Saved

or:

Saving...

40. EMPTY STATES

Do not leave blank pages.

For example:

"No projects yet."

Then:

Create your first AI video →

Use helpful illustrations and clear CTAs.

41. ERROR STATES

Every API request must have proper error handling.

Never show raw backend errors to users.

Instead show understandable messages.

Example:

"Your video couldn't be generated this time. Try again or adjust your prompt."

Buttons:

Retry

Edit Prompt

42. AI PROMPT INTELLIGENCE

Build an AI prompt enhancement layer.

If the user writes:

"Make a video of a car."

The system should internally expand it into a detailed generation prompt containing:

Subject

Environment

Camera

Lighting

Motion

Composition

Style

Duration

Atmosphere

The user should be able to see the enhanced prompt and edit it.

43. GENERATION PREVIEW

Before spending credits, display:

Generation Summary

Duration:
10 seconds

Resolution:
1080p

Aspect Ratio:
16:9

Model:
Selected AI model

Estimated credits:
50

Buttons:

Generate

Cancel

44. MODEL SELECTION

Create an advanced model selector.

Example:

AI Video Model

Fast

Balanced

Cinematic

High Quality

Display:

Speed

Quality

Credit cost

Allow the backend to map these options to actual providers/models.

Do not hardcode provider-specific assumptions into the frontend.

45. API ARCHITECTURE

Use a clean backend architecture.

Suggested structure:

/frontend
/backend
/services
/providers
/database
/storage
/workers
/api

Create a provider interface:

generateVideo()
getGenerationStatus()
cancelGeneration()
extendVideo()
generateImageToVideo()

Each provider adapter should implement the interface.

This allows new AI video providers to be added without rewriting the application.

46. REAL-TIME GENERATION STATUS

Use WebSockets or Server-Sent Events where appropriate.

When a generation job changes:

Backend:

generation_status = processing

Frontend immediately updates the interface.

Do not require users to manually refresh the page.

47. API ENDPOINTS

Create secure endpoints similar to:

POST /api/video/generate
GET /api/video/generations/:id
POST /api/video/generations/:id/cancel
POST /api/video/generations/:id/retry
POST /api/video/generations/:id/extend

POST /api/scenes
PUT /api/scenes/:id
DELETE /api/scenes/:id

POST /api/scripts/generate
POST /api/voice/generate
POST /api/music/generate

POST /api/export
GET /api/projects
POST /api/projects
PUT /api/projects/:id
DELETE /api/projects/:id

Validate every request server-side.

48. DEMO MODE

If API keys are not configured during development, create a Demo Mode.

Demo Mode should simulate:

Generation queue

Progress

Scene generation

Video completion

Export

Clearly label Demo Mode.

Do not pretend that simulated videos are actual AI-generated videos.

The architecture must make replacing Demo Mode with real providers straightforward.

49. LANDING PAGE FEATURES

Add a section:

One Prompt. Endless Possibilities.

Feature cards:

Text to Video

Turn ideas into cinematic scenes.

Image to Video

Bring static images to life.

AI Scripts

Generate scripts designed for engagement.

AI Voice

Create natural voiceovers.

AI Music

Generate original background music.

Smart Editing

Let AI handle repetitive editing.

50. FINAL CTA

Create a large CTA section:

Your next video starts with one idea.

Subheading:

Describe it. Generate it. Make it yours.

Button:

Start Creating Free

51. FOOTER

Include:

VIDEONOVA AI

"Create without limits."

Links:

Product
Features
Templates
Pricing
API
Documentation
Company
About
Careers
Contact
Privacy
Terms
Security

Social links.

52. TECH STACK

Use a modern production-ready stack.

Preferred:

Frontend:

Next.js

React

TypeScript

Tailwind CSS

UI:

shadcn/ui

Lucide icons

Backend:

Next.js API routes or dedicated Node.js backend

Database:

PostgreSQL

ORM:

Prisma

Authentication:

Auth.js or equivalent

Storage:

S3-compatible object storage

Payments:

Stripe

Queue:

Redis + BullMQ or equivalent

Real-time:

WebSockets or Server-Sent Events

Deployment:

Vercel for frontend

Scalable cloud infrastructure for workers/backend

53. CODE QUALITY

Write clean, modular, maintainable production-quality code.

Use:

TypeScript

Strong typing

Reusable components

Service layers

Provider abstractions

Error boundaries

Validation schemas

API middleware

Environment variables

Unit tests

Integration tests

Do not put everything into one massive component.

54. IMPORTANT FUNCTIONALITY REQUIREMENT

Do NOT build this as merely a visual mockup.

Every major button should have a functional flow.

For example:

Generate Video
→ validate request
→ estimate credits
→ create generation job
→ send job to provider
→ track status
→ store output
→ update project
→ display completed video.

Regenerate Scene
→ create scene-generation job
→ process scene
→ replace scene output
→ update timeline.

Export
→ process project
→ render video
→ create export
→ provide secure download/share link.

55. FINAL QUALITY STANDARD

The finished application should feel comparable to a modern commercial AI SaaS platform.

Prioritise:

Functional AI video generation

Fast and responsive UI

Excellent user experience

Reliable generation pipeline

Scalable architecture

Professional video editor

High-quality visual design

Secure API architecture

Proper error handling

Easy integration of future AI models

Build the application so that a real AI video-generation API can be connected immediately through environment variables without requiring major frontend changes.

Do not use fake functionality in production paths.

If an external AI provider is unavailable, gracefully display the appropriate status and allow the user to retry or switch models.The final product should feel like a serious AI video-generation company, not a prototype.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fb712df9-ebea-4a4f-92b0-3c0d393866ec).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
