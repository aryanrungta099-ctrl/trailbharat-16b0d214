INSERT INTO public.trek_overrides (trek_id, long_form_content, content_source, updated_at)
SELECT trek_id, content, 'ai_generated', now()
FROM public._trek_rewrites_staging
ON CONFLICT (trek_id) DO UPDATE SET
  long_form_content = EXCLUDED.long_form_content,
  content_source = 'ai_generated',
  updated_at = now();

DROP TABLE public._trek_rewrites_staging;