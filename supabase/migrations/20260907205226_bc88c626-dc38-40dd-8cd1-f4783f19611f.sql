CREATE TABLE public.generations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL,
  title TEXT,
  prompt TEXT NOT NULL,
  enhanced_prompt TEXT,
  negative_prompt TEXT,
  mode TEXT NOT NULL DEFAULT 'text',
  duration INTEGER NOT NULL DEFAULT 8,
  aspect_ratio TEXT NOT NULL DEFAULT '16:9',
  resolution TEXT NOT NULL DEFAULT '720p',
  style TEXT,
  camera TEXT,
  lighting TEXT,
  model_tier TEXT NOT NULL DEFAULT 'balanced',
  provider TEXT NOT NULL DEFAULT 'lovable',
  provider_job_id TEXT,
  status TEXT NOT NULL DEFAULT 'queued',
  error_message TEXT,
  credits INTEGER NOT NULL DEFAULT 0,
  video_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX generations_device_created_idx ON public.generations (device_id, created_at DESC);

GRANT SELECT, INSERT ON public.generations TO anon;
GRANT SELECT, INSERT ON public.generations TO authenticated;
GRANT ALL ON public.generations TO service_role;

ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view generations"
  ON public.generations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create generations"
  ON public.generations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_generations_updated_at
BEFORE UPDATE ON public.generations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();