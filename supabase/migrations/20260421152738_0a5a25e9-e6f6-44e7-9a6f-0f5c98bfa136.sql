ALTER TABLE public.trek_overrides
  ADD COLUMN IF NOT EXISTS long_form_content TEXT,
  ADD COLUMN IF NOT EXISTS content_source TEXT NOT NULL DEFAULT 'editorial' CHECK (content_source IN ('editorial', 'ai_generated', 'ai_generated_reviewed')),
  ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS author_name TEXT,
  ADD COLUMN IF NOT EXISTS author_credentials TEXT;

CREATE INDEX IF NOT EXISTS idx_trek_overrides_content_source ON public.trek_overrides(content_source);
CREATE UNIQUE INDEX IF NOT EXISTS idx_trek_overrides_trek_id ON public.trek_overrides(trek_id);