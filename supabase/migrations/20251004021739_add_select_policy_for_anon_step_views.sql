/*
  # Add SELECT Policy for Anonymous Users on Step Views Tables

  Allows anonymous users to read their own step view data so they can update existing records.

  ## Changes
  - Add SELECT policy for anon role on all step_views tables
  - This allows the tracking function to fetch existing records before updating

  ## Security
  - Anonymous users can read all records (needed for checking if session exists)
  - Anonymous users can insert and update records
  - Only authenticated admins can delete records
*/

-- Add SELECT policy for anonymous users on step_views_funnel_1
CREATE POLICY "Anonymous users can read funnel-1 views"
  ON step_views_funnel_1 FOR SELECT
  TO anon
  USING (true);

-- Add SELECT policy for anonymous users on step_views_funnel_tt
CREATE POLICY "Anonymous users can read funnel-tt views"
  ON step_views_funnel_tt FOR SELECT
  TO anon
  USING (true);

-- Add SELECT policy for anonymous users on step_views_funnel_vsl
CREATE POLICY "Anonymous users can read funnel-vsl views"
  ON step_views_funnel_vsl FOR SELECT
  TO anon
  USING (true);

-- Add SELECT policy for anonymous users on step_views_funnelesp
CREATE POLICY "Anonymous users can read funnelesp views"
  ON step_views_funnelesp FOR SELECT
  TO anon
  USING (true);
