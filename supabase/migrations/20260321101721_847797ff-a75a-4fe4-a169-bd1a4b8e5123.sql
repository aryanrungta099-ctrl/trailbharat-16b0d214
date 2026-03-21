
-- Admin roles system
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS on user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Guesthouse listings table
CREATE TABLE public.guesthouse_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  photo_url TEXT,
  location TEXT NOT NULL,
  trek_region TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  price_range_min INTEGER NOT NULL DEFAULT 0,
  price_range_max INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL DEFAULT '',
  amenities TEXT[] NOT NULL DEFAULT '{}',
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.guesthouse_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved guesthouse listings are viewable by everyone" ON public.guesthouse_listings
  FOR SELECT USING (approved = true OR auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can create guesthouse listings" ON public.guesthouse_listings
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own guesthouse listings" ON public.guesthouse_listings
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own, admins can delete any" ON public.guesthouse_listings
  FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Guesthouse reviews
CREATE TABLE public.guesthouse_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guesthouse_listing_id UUID REFERENCES public.guesthouse_listings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (guesthouse_listing_id, user_id)
);

ALTER TABLE public.guesthouse_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone" ON public.guesthouse_reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert reviews" ON public.guesthouse_reviews
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON public.guesthouse_reviews
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Add approved column to sherpa_listings for admin approval
ALTER TABLE public.sherpa_listings ADD COLUMN IF NOT EXISTS approved BOOLEAN NOT NULL DEFAULT false;

-- Update sherpa_listings RLS to show only approved (or own or admin)
DROP POLICY IF EXISTS "Sherpa listings are viewable by everyone" ON public.sherpa_listings;
CREATE POLICY "Sherpa listings viewable if approved or own or admin" ON public.sherpa_listings
  FOR SELECT USING (approved = true OR auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Admin can delete sherpa listings
DROP POLICY IF EXISTS "Users can delete their own listings" ON public.sherpa_listings;
CREATE POLICY "Users or admins can delete sherpa listings" ON public.sherpa_listings
  FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Admin can update sherpa listings (for approval)
DROP POLICY IF EXISTS "Users can update their own listings" ON public.sherpa_listings;
CREATE POLICY "Users or admins can update sherpa listings" ON public.sherpa_listings
  FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for guesthouse photos
INSERT INTO storage.buckets (id, name, public) VALUES ('guesthouse-photos', 'guesthouse-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for guesthouse photos
CREATE POLICY "Public guesthouse photo access" ON storage.objects
  FOR SELECT USING (bucket_id = 'guesthouse-photos');

CREATE POLICY "Auth users upload guesthouse photos" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'guesthouse-photos');

-- Trigger for updated_at on guesthouse_listings
CREATE TRIGGER update_guesthouse_listings_updated_at
  BEFORE UPDATE ON public.guesthouse_listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
