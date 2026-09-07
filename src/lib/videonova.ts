// Shared, client-safe types and option catalogs for the VIDEONOVA AI studio.

export type GenerationMode = "text" | "image";

export type ModelTier = "fast" | "balanced" | "cinematic" | "quality";

export interface VideoSettings {
  mode: GenerationMode;
  prompt: string;
  negativePrompt: string;
  duration: number;
  aspectRatio: "16:9" | "9:16";
  resolution: "360p" | "720p" | "1080p";
  style: string;
  camera: string;
  lighting: string;
  modelTier: ModelTier;
}

export const DURATIONS = [5, 8, 10] as const;
export const ASPECT_RATIOS = ["16:9", "9:16"] as const;
export const RESOLUTIONS = ["360p", "720p", "1080p"] as const;

export const STYLES = [
  "Cinematic",
  "Photorealistic",
  "Commercial",
  "Documentary",
  "3D",
  "Anime",
  "Fashion",
  "Luxury",
  "Cyberpunk",
  "Minimalist",
  "Vintage Film",
  "Social Media",
];

export const CAMERAS = [
  "Static",
  "Pan",
  "Tilt",
  "Dolly",
  "Tracking",
  "Crane",
  "Handheld",
  "Drone",
  "Orbit",
  "Zoom",
];

export const LIGHTING = [
  "Natural",
  "Studio",
  "Golden Hour",
  "Neon",
  "Dramatic",
  "Soft",
  "Low-key",
  "High-key",
];

export interface ModelTierInfo {
  id: ModelTier;
  label: string;
  blurb: string;
  speed: string;
  quality: string;
  creditFactor: number;
}

export const MODEL_TIERS: ModelTierInfo[] = [
  {
    id: "fast",
    label: "Fast",
    blurb: "Quick drafts to test an idea",
    speed: "Fastest",
    quality: "Draft",
    creditFactor: 0.4,
  },
  {
    id: "balanced",
    label: "Balanced",
    blurb: "Good quality at a sensible cost",
    speed: "Fast",
    quality: "Good",
    creditFactor: 1,
  },
  {
    id: "cinematic",
    label: "Cinematic",
    blurb: "Richer motion and detail",
    speed: "Medium",
    quality: "High",
    creditFactor: 1.8,
  },
  {
    id: "quality",
    label: "High Quality",
    blurb: "Maximum fidelity for finals",
    speed: "Slowest",
    quality: "Maximum",
    creditFactor: 3.5,
  },
];

export const RESOLUTION_FACTOR: Record<VideoSettings["resolution"], number> = {
  "360p": 0.5,
  "720p": 1,
  "1080p": 1.6,
};

export function estimateCredits(settings: Pick<VideoSettings, "duration" | "resolution" | "modelTier">) {
  const tier = MODEL_TIERS.find((t) => t.id === settings.modelTier) ?? MODEL_TIERS[1]!;
  return Math.round(settings.duration * 6 * tier.creditFactor * RESOLUTION_FACTOR[settings.resolution]);
}

export const DEFAULT_SETTINGS: VideoSettings = {
  mode: "text",
  prompt: "",
  negativePrompt: "",
  duration: 8,
  aspectRatio: "16:9",
  resolution: "720p",
  style: "Cinematic",
  camera: "Dolly",
  lighting: "Golden Hour",
  modelTier: "balanced",
};

export type GenerationStatus =
  | "queued"
  | "processing"
  | "generating"
  | "rendering"
  | "completed"
  | "failed"
  | "cancelled";

export const STATUS_COPY: Record<GenerationStatus, string> = {
  queued: "Preparing your video...",
  processing: "Generating scenes...",
  generating: "Generating scenes...",
  rendering: "Rendering video...",
  completed: "Your video is ready.",
  failed: "Something went wrong while generating your video.",
  cancelled: "Generation cancelled.",
};

export interface TemplateItem {
  id: string;
  name: string;
  category: string;
  duration: number;
  aspectRatio: VideoSettings["aspectRatio"];
  style: string;
  camera: string;
  lighting: string;
  prompt: string;
}

export const TEMPLATES: TemplateItem[] = [
  {
    id: "luxury-coffee",
    name: "Luxury Coffee Advert",
    category: "Advertisements",
    duration: 8,
    aspectRatio: "16:9",
    style: "Commercial",
    camera: "Dolly",
    lighting: "Golden Hour",
    prompt:
      "A cinematic advertisement for a luxury South African coffee brand. Close-up of freshly roasted beans tumbling in slow motion, espresso pouring into a ceramic cup, steam rising dramatically, a stylish young professional savouring the first sip in a modern Cape Town cafe. Warm amber tones, shallow depth of field; soft jazz and gentle cafe ambience.",
  },
  {
    id: "sneaker-drop",
    name: "Sneaker Product Launch",
    category: "Product Launch",
    duration: 8,
    aspectRatio: "9:16",
    style: "Fashion",
    camera: "Orbit",
    lighting: "Neon",
    prompt:
      "A high-energy vertical launch film for a limited-edition sneaker. The shoe rotates on a reflective plinth as neon magenta and cyan light sweeps across it, dust particles drifting through the beams, then a fast cut to a dancer's feet landing on wet city asphalt. Punchy electronic beat.",
  },
  {
    id: "property-tour",
    name: "Real Estate Showcase",
    category: "Real Estate",
    duration: 10,
    aspectRatio: "16:9",
    style: "Photorealistic",
    camera: "Drone",
    lighting: "Natural",
    prompt:
      "A smooth drone reveal of a modern clifftop villa at sunrise, gliding over the infinity pool towards floor-to-ceiling glass, ocean glinting below. Calm, aspirational piano score.",
  },
  {
    id: "explainer-saas",
    name: "SaaS Explainer Scene",
    category: "Business",
    duration: 8,
    aspectRatio: "16:9",
    style: "Minimalist",
    camera: "Tracking",
    lighting: "Studio",
    prompt:
      "A clean, minimal 3D scene explaining a software product: floating translucent interface panels assemble in mid-air above a matte desk, soft violet accent light, camera tracks gently left to right. Understated ambient soundtrack, no dialogue.",
  },
  {
    id: "travel-reel",
    name: "Travel Reel",
    category: "Travel",
    duration: 8,
    aspectRatio: "9:16",
    style: "Cinematic",
    camera: "Handheld",
    lighting: "Golden Hour",
    prompt:
      "A vertical travel reel: a traveller walks a narrow coastal path at golden hour, handheld camera following just behind, sea spray catching the light, then turns to look back at the camera smiling. Warm uplifting acoustic music and gentle waves.",
  },
  {
    id: "fitness-promo",
    name: "Fitness Studio Promo",
    category: "Fitness",
    duration: 8,
    aspectRatio: "9:16",
    style: "Commercial",
    camera: "Handheld",
    lighting: "Dramatic",
    prompt:
      "A gritty vertical gym promo: chalk dust in a shaft of hard side light, an athlete chalking their hands, a heavy barbell lift in slow motion, sweat and determination. Driving percussive score, no dialogue.",
  },
  {
    id: "restaurant-hero",
    name: "Restaurant Hero Shot",
    category: "Restaurants",
    duration: 5,
    aspectRatio: "16:9",
    style: "Photorealistic",
    camera: "Pan",
    lighting: "Soft",
    prompt:
      "A slow pan across a chef plating a fine-dining dish on dark stone, herb oil dotted with tweezers, steam curling upward, warm candlelight in the background. Subtle kitchen ambience.",
  },
  {
    id: "music-visual",
    name: "Music Visualiser",
    category: "Music",
    duration: 8,
    aspectRatio: "16:9",
    style: "Cyberpunk",
    camera: "Zoom",
    lighting: "Neon",
    prompt:
      "An abstract cyberpunk visualiser: liquid chrome shapes pulse and morph inside a neon-lit tunnel, the camera pushing forward continuously in a single unbroken shot. Deep electronic bass with a rising synth line.",
  },
];
