/*
  # Create step_views_fn_shorts2 table

  1. New Tables
    - `step_views_fn_shorts2`
      - `id` (uuid, primary key)
      - `session_id` (text) - Session identifier
      - `step_name` (text) - Name of the step viewed
      - `viewed_at` (timestamptz) - Timestamp when step was viewed
      - `user_agent` (text) - Browser user agent
      - `ip_address` (text) - IP address (optional)
      - `ab_test_id` (uuid) - A/B test identifier (optional)
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on `step_views_fn_shorts2` table
    - Add policy for anonymous users to insert their own step views
    - Add policy for anonymous users to select step views
*/

-- Create step_views_fn_shorts2 table
CREATE TABLE IF NOT EXISTS step_views_fn_shorts2 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  step_name text NOT NULL,
  viewed_at timestamptz DEFAULT now(),
  user_agent text,
  ip_address text,
  ab_test_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE step_views_fn_shorts2 ENABLE ROW LEVEL SECURITY;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_step_views_fn_shorts2_session_id ON step_views_fn_shorts2(session_id);
CREATE INDEX IF NOT EXISTS idx_step_views_fn_shorts2_step_name ON step_views_fn_shorts2(step_name);
CREATE INDEX IF NOT EXISTS idx_step_views_fn_shorts2_viewed_at ON step_views_fn_shorts2(viewed_at);
CREATE INDEX IF NOT EXISTS idx_step_views_fn_shorts2_ab_test_id ON step_views_fn_shorts2(ab_test_id);

-- Policy: Allow anonymous users to insert step views
CREATE POLICY "Allow anonymous insert for fn_shorts2 step views"
  ON step_views_fn_shorts2
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow anonymous users to select step views (for analytics)
CREATE POLICY "Allow anonymous select for fn_shorts2 step views"
  ON step_views_fn_shorts2
  FOR SELECT
  TO anon
  USING (true);
