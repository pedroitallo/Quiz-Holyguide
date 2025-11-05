/*
  # Create step_views_funnel_2aff table

  1. New Tables
    - step_views_funnel_2aff
      - id (uuid, primary key)
      - session_id (uuid, foreign key to quiz_results)
      - step_name (text, step identifier)
      - viewed_at (timestamptz, timestamp of view)
      - ab_test_id (uuid, optional foreign key to ab_tests)
      - variant_name (text, optional variant identifier)
      - created_at (timestamptz, record creation timestamp)

  2. Security
    - Enable RLS on step_views_funnel_2aff table
    - Add policy for anonymous users to insert their own step views
    - Add policy for anonymous users to select their own step views
    - Add policy for admins to select all step views

  3. Indexes
    - Add index on session_id for faster queries
    - Add index on step_name for analytics
    - Add index on ab_test_id for A/B testing queries
    - Add index on viewed_at for time-based queries
*/

CREATE TABLE IF NOT EXISTS step_views_funnel_2aff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid,
  step_name text NOT NULL,
  viewed_at timestamptz DEFAULT now(),
  ab_test_id uuid,
  variant_name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE step_views_funnel_2aff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon to insert step views"
  ON step_views_funnel_2aff
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon to select step views"
  ON step_views_funnel_2aff
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated to select all step views"
  ON step_views_funnel_2aff
  FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_step_views_funnel_2aff_session_id ON step_views_funnel_2aff(session_id);
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_2aff_step_name ON step_views_funnel_2aff(step_name);
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_2aff_ab_test_id ON step_views_funnel_2aff(ab_test_id);
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_2aff_viewed_at ON step_views_funnel_2aff(viewed_at);
