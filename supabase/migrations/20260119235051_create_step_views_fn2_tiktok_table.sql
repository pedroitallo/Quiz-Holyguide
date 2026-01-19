/*
  # Create Step Views Table for fn2-tiktok Funnel

  1. New Tables
    - `step_views_fn2_tiktok`
      - `id` (uuid, primary key)
      - `session_id` (text) - Browser session identifier
      - `step_name` (text) - Name of the step viewed
      - `ab_test_id` (text, nullable) - A/B test identifier
      - `created_at` (timestamptz) - Timestamp when step was viewed
      - `utm_source` (text, nullable) - UTM source parameter
      - `utm_medium` (text, nullable) - UTM medium parameter
      - `utm_campaign` (text, nullable) - UTM campaign parameter

  2. Security
    - Enable RLS on `step_views_fn2_tiktok` table
    - Add policy for anonymous users to insert step views
    - Add policy for authenticated users to read step views

  3. Indexes
    - Add index on `session_id` for faster session lookups
    - Add index on `step_name` for analytics queries
    - Add index on `ab_test_id` for A/B test analysis
    - Add index on `created_at` for time-based queries
*/

CREATE TABLE IF NOT EXISTS step_views_fn2_tiktok (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  step_name text NOT NULL,
  ab_test_id text,
  created_at timestamptz DEFAULT now(),
  utm_source text,
  utm_medium text,
  utm_campaign text
);

ALTER TABLE step_views_fn2_tiktok ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert on step_views_fn2_tiktok"
  ON step_views_fn2_tiktok
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon select on step_views_fn2_tiktok"
  ON step_views_fn2_tiktok
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated users to read step_views_fn2_tiktok"
  ON step_views_fn2_tiktok
  FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_step_views_fn2_tiktok_session_id ON step_views_fn2_tiktok(session_id);
CREATE INDEX IF NOT EXISTS idx_step_views_fn2_tiktok_step_name ON step_views_fn2_tiktok(step_name);
CREATE INDEX IF NOT EXISTS idx_step_views_fn2_tiktok_ab_test_id ON step_views_fn2_tiktok(ab_test_id);
CREATE INDEX IF NOT EXISTS idx_step_views_fn2_tiktok_created_at ON step_views_fn2_tiktok(created_at);
