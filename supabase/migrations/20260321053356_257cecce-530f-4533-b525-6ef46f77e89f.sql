
-- Create storage bucket for sherpa photos
INSERT INTO storage.buckets (id, name, public) VALUES ('sherpa-photos', 'sherpa-photos', true);

-- Storage policies for sherpa photos
CREATE POLICY "Anyone can view sherpa photos" ON storage.objects FOR SELECT USING (bucket_id = 'sherpa-photos');
CREATE POLICY "Authenticated users can upload sherpa photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'sherpa-photos');
CREATE POLICY "Users can update their own sherpa photos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'sherpa-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own sherpa photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'sherpa-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create sherpa_listings table
CREATE TABLE public.sherpa_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  photo_url text,
  treks_guided text NOT NULL,
  contact_number text NOT NULL,
  price_range_min integer NOT NULL DEFAULT 0,
  price_range_max integer NOT NULL DEFAULT 0,
  description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sherpa_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sherpa listings are viewable by everyone" ON public.sherpa_listings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create listings" ON public.sherpa_listings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own listings" ON public.sherpa_listings FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own listings" ON public.sherpa_listings FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_sherpa_listings_updated_at BEFORE UPDATE ON public.sherpa_listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
