/*
  # Create step_views_funnel_vsl1 table

  1. New Tables
    - `step_views_funnel_vsl1`
      - `id` (uuid, primary key)
      - `session_id` (text)
      - `step_name` (text)
      - `viewed_at` (timestamptz)
      - `ab_test_id` (uuid, nullable, foreign key)
      - `variant_id` (text, nullable)

  2. Security
    - Enable RLS on `step_views_funnel_vsl1` table
    - Add policy for anonymous users to insert their own step views
    - Add policy for anonymous users to select step views

  3. Indexes
    - Add index on session_id for faster queries
    - Add index on step_name for analytics
    - Add indexes on ab_test_id and variant_id for A/B testing queries
*/

CREATE TABLE IF NOT EXISTS step_views_funnel_vsl1 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  step_name text NOT NULL,
  viewed_at timestamptz DEFAULT now(),
  ab_test_id uuid REFERENCES ab_tests(id),
  variant_id text
);

ALTER TABLE step_views_funnel_vsl1 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert step views for funnel-vsl1"
  ON step_views_funnel_vsl1
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can select step views for funnel-vsl1"
  ON step_views_funnel_vsl1
  FOR SELECT
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS idx_step_views_funnel_vsl1_session ON step_views_funnel_vsl1(session_id);
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_vsl1_step_name ON step_views_funnel_vsl1(step_name);
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_vsl1_ab_test ON step_views_funnel_vsl1(ab_test_id);
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_vsl1_variant ON step_views_funnel_vsl1(variant_id);
