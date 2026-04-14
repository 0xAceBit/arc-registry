
-- Make user_id nullable on project_insights (wallet-only users won't have auth user_id)
ALTER TABLE public.project_insights ALTER COLUMN user_id DROP NOT NULL;

-- Make user_id nullable on project_submissions
ALTER TABLE public.project_submissions ALTER COLUMN user_id DROP NOT NULL;

-- Drop old RLS policies on project_insights that require auth
DROP POLICY IF EXISTS "Authenticated users can add insights" ON public.project_insights;

-- Allow anyone to insert insights (wallet-verified, no auth needed)
CREATE POLICY "Anyone can add insights"
ON public.project_insights
FOR INSERT
WITH CHECK (true);

-- Drop old submission insert policy
DROP POLICY IF EXISTS "Users can submit projects" ON public.project_submissions;

-- Allow anyone to submit projects
CREATE POLICY "Anyone can submit projects"
ON public.project_submissions
FOR INSERT
WITH CHECK (true);

-- Drop old view-own policy, allow anyone to view own submissions by making it public read
DROP POLICY IF EXISTS "Users can view own submissions" ON public.project_submissions;

-- Allow anyone to view submissions (for admin display)
-- Admins already have full access via existing policy
