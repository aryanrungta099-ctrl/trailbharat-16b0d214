
ALTER TABLE public.trek_overrides
  ADD COLUMN IF NOT EXISTS is_flagship boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS noindex boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_trek_overrides_flagship ON public.trek_overrides(is_flagship) WHERE is_flagship = true;
CREATE INDEX IF NOT EXISTS idx_trek_overrides_noindex ON public.trek_overrides(noindex) WHERE noindex = true;

-- Auto-flag AI-generated content as noindex until reviewed
UPDATE public.trek_overrides SET noindex = true WHERE content_source = 'ai_generated';
-- Mark already-inserted editorial flagships
UPDATE public.trek_overrides SET is_flagship = true
  WHERE trek_id IN ('kedarkantha','roopkund','valley-of-flowers','har-ki-dun','brahmatal','hampta-pass');
