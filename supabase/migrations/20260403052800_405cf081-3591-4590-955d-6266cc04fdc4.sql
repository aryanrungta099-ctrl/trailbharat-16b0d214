
CREATE TABLE public.wishlisted_treks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  trek_id TEXT NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, trek_id)
);

ALTER TABLE public.wishlisted_treks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own wishlisted treks"
ON public.wishlisted_treks FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own wishlist"
ON public.wishlisted_treks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their own wishlist"
ON public.wishlisted_treks FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
