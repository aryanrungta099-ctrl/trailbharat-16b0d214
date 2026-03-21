
CREATE TABLE public.completed_treks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  trek_id text NOT NULL,
  completed_at date NOT NULL DEFAULT CURRENT_DATE,
  notes text DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, trek_id)
);

ALTER TABLE public.completed_treks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own completed treks"
  ON public.completed_treks FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own completed treks"
  ON public.completed_treks FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own completed treks"
  ON public.completed_treks FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Completed treks are publicly viewable"
  ON public.completed_treks FOR SELECT TO public
  USING (true);
