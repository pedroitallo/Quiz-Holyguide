/*
  # Create Step Views Funnel Aff Table

  1. New Tables
    - `step_views_funnel_aff`
      - `id` (uuid, primary key)
      - `session_id` (text) - Unique identifier for the user session
      - `step_name` (text) - Name of the step being viewed
      - `timestamp` (timestamptz) - When the step was viewed
      - `funnel_type` (text) - Always 'funnel-aff' for this table
      - `ab_test_id` (uuid, nullable) - Optional reference to AB test
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on `step_views_funnel_aff` table
    - Add policies for anonymous users to insert step views
    - Add policies for authenticated users to select their own step views

  3. Indexes
    - Create index on session_id for faster lookups
    - Create index on step_name for analytics queries
    - Create index on ab_test_id for AB testing analysis
*/

CREATE TABLE IF NOT EXISTS step_views_funnel_aff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  step_name text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  funnel_type text DEFAULT 'funnel-aff',
  ab_test_id uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE step_views_funnel_aff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert step views"
  ON step_views_funnel_aff
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can select step views"
  ON step_views_funnel_aff
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_step_views_funnel_aff_session_id ON step_views_funnel_aff(session_id);
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_aff_step_name ON step_views_funnel_aff(step_name);
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_aff_ab_test_id ON step_views_funnel_aff(ab_test_id);
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_aff_timestamp ON step_views_funnel_aff(timestamp);
