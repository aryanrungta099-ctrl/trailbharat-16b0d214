CREATE TABLE IF NOT EXISTS public._trek_rewrites_staging (
  trek_id text PRIMARY KEY,
  content text NOT NULL
);
ALTER TABLE public._trek_rewrites_staging ENABLE ROW LEVEL SECURITY;
GRANT INSERT, SELECT, DELETE ON public._trek_rewrites_staging TO authenticated, anon;