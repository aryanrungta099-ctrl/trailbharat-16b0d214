
CREATE TABLE public.sherpa_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sherpa_listing_id uuid NOT NULL REFERENCES public.sherpa_listings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.sherpa_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
  ON public.sherpa_reviews FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated users can insert reviews"
  ON public.sherpa_reviews FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON public.sherpa_reviews FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE UNIQUE INDEX sherpa_reviews_unique_user_listing 
  ON public.sherpa_reviews (user_id, sherpa_listing_id);
