-- Drop existing INSERT policies on companies that might be restrictive
DROP POLICY IF EXISTS "Anyone can create companies for signup" ON public.companies;
DROP POLICY IF EXISTS "Authenticated users can create companies" ON public.companies;

-- Recreate as explicitly PERMISSIVE policies
CREATE POLICY "Anyone can create companies for signup"
ON public.companies
AS PERMISSIVE
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Authenticated users can create companies"
ON public.companies
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (true);