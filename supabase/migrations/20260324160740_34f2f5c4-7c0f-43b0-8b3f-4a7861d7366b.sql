
-- Tea houses managed by admin, linked to trek routes and villages
CREATE TABLE public.trek_tea_houses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trek_id TEXT NOT NULL,
  village TEXT NOT NULL,
  name TEXT NOT NULL,
  contact_number TEXT DEFAULT '',
  facilities TEXT[] DEFAULT '{}',
  price_range TEXT DEFAULT '',
  description TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.trek_tea_houses ENABLE ROW LEVEL SECURITY;

-- Everyone can read tea houses
CREATE POLICY "Tea houses viewable by everyone" ON public.trek_tea_houses FOR SELECT TO public USING (true);

-- Admins can manage tea houses
CREATE POLICY "Admins can insert tea houses" ON public.trek_tea_houses FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update tea houses" ON public.trek_tea_houses FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete tea houses" ON public.trek_tea_houses FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Trek content overrides - allows admin to edit trek data stored in code
CREATE TABLE public.trek_overrides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trek_id TEXT NOT NULL UNIQUE,
  description TEXT,
  highlights TEXT[],
  itinerary_json JSONB,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.trek_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trek overrides viewable by everyone" ON public.trek_overrides FOR SELECT TO public USING (true);
CREATE POLICY "Admins can insert trek overrides" ON public.trek_overrides FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update trek overrides" ON public.trek_overrides FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete trek overrides" ON public.trek_overrides FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
