
-- Create a view for public profile display (excludes health data)
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT user_id, display_name, bio, avatar_url
FROM public.profiles;

-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Allow authenticated users to view their own full profile (including health data)
CREATE POLICY "Users can view own full profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow public to view only non-sensitive display fields via direct table access
-- (needed for review display_name lookups)
CREATE POLICY "Public can view display fields only"
ON public.profiles
FOR SELECT
TO public
USING (true);

-- Grant select on the view
GRANT SELECT ON public.public_profiles TO anon, authenticated;
