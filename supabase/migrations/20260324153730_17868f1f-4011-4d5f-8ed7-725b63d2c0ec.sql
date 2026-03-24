
-- Fix: make the view use SECURITY INVOKER so RLS of the querying user applies
ALTER VIEW public.public_profiles SET (security_invoker = on);
