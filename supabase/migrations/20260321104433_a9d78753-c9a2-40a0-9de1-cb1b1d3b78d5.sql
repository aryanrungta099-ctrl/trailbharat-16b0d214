
-- Add photo_urls and approved columns to experiences
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS photo_urls text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS approved boolean NOT NULL DEFAULT false;

-- Add food_options, room_photo_urls, view_photo_urls to guesthouse_listings
ALTER TABLE public.guesthouse_listings ADD COLUMN IF NOT EXISTS food_options text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.guesthouse_listings ADD COLUMN IF NOT EXISTS room_photo_urls text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.guesthouse_listings ADD COLUMN IF NOT EXISTS view_photo_urls text[] NOT NULL DEFAULT '{}';

-- Add gallery_urls to sherpa_listings
ALTER TABLE public.sherpa_listings ADD COLUMN IF NOT EXISTS gallery_urls text[] NOT NULL DEFAULT '{}';

-- Create agency_listings table
CREATE TABLE public.agency_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  logo_url text,
  description text NOT NULL DEFAULT '',
  website text,
  contact_number text NOT NULL,
  email text,
  treks_offered text[] NOT NULL DEFAULT '{}',
  price_range_min integer NOT NULL DEFAULT 0,
  price_range_max integer NOT NULL DEFAULT 0,
  established_year integer,
  team_size integer,
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.agency_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agency listings viewable if approved or own or admin" ON public.agency_listings
  FOR SELECT TO public USING (approved = true OR auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can create agency listings" ON public.agency_listings
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users or admins can update agency listings" ON public.agency_listings
  FOR UPDATE TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users or admins can delete agency listings" ON public.agency_listings
  FOR DELETE TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

-- Create agency_reviews table
CREATE TABLE public.agency_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_listing_id uuid NOT NULL REFERENCES public.agency_listings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  rating integer NOT NULL,
  comment text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.agency_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews viewable by everyone" ON public.agency_reviews
  FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated users can insert reviews" ON public.agency_reviews
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON public.agency_reviews
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create trek_reviews table
CREATE TABLE public.trek_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trek_id text NOT NULL,
  user_id uuid NOT NULL,
  rating integer NOT NULL,
  comment text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.trek_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trek reviews viewable by everyone" ON public.trek_reviews
  FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated users can insert trek reviews" ON public.trek_reviews
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trek reviews" ON public.trek_reviews
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Admins can delete any review
CREATE POLICY "Admins can delete trek reviews" ON public.trek_reviews
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete agency reviews" ON public.agency_reviews
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('experience-photos', 'experience-photos', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('agency-photos', 'agency-photos', true) ON CONFLICT DO NOTHING;

-- Storage policies for experience-photos
CREATE POLICY "Anyone can read experience photos" ON storage.objects FOR SELECT TO public USING (bucket_id = 'experience-photos');
CREATE POLICY "Authenticated users can upload experience photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'experience-photos');

-- Storage policies for agency-photos
CREATE POLICY "Anyone can read agency photos" ON storage.objects FOR SELECT TO public USING (bucket_id = 'agency-photos');
CREATE POLICY "Authenticated users can upload agency photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'agency-photos');

-- Update updated_at trigger for agency_listings
CREATE TRIGGER update_agency_listings_updated_at BEFORE UPDATE ON public.agency_listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Admin can manage experiences (approve/delete)
CREATE POLICY "Admins can update experiences" ON public.experiences
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete experiences" ON public.experiences
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Admin can delete sherpa/guesthouse reviews
CREATE POLICY "Admins can delete sherpa reviews" ON public.sherpa_reviews
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete guesthouse reviews" ON public.guesthouse_reviews
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
