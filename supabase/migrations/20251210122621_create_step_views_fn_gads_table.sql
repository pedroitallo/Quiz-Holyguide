/*
  # Create step_views_fn_gads table for tracking fn-gads funnel interactions

  1. New Tables
    - `step_views_fn_gads`
      - `id` (uuid, primary key)
      - `session_id` (text) - identifies the user session
      - `step_name` (text) - name of the step being viewed
      - `viewed_at` (timestamptz) - timestamp of when step was viewed
      - `user_agent` (text, nullable) - browser user agent string
      - `ip_address` (text, nullable) - user IP address
      - `utm_source` (text, nullable) - UTM tracking parameter
      - `utm_medium` (text, nullable) - UTM tracking parameter
      - `utm_campaign` (text, nullable) - UTM tracking parameter
      - `src` (text, nullable) - source tracking parameter
      - `ab_test_id` (uuid, nullable) - reference to AB test if applicable
      - `ab_test_variant` (text, nullable) - variant name if in AB test
      - `created_at` (timestamptz) - record creation timestamp

  2. Security
    - Enable RLS on `step_views_fn_gads` table
    - Add policy for anonymous users to insert their own step views
    - Add policy for anonymous users to select step views for analytics

  3. Indexes
    - Add index on `session_id` for faster session lookups
    - Add index on `step_name` for analytics queries
    - Add index on `viewed_at` for time-based queries
    - Add index on `ab_test_id` and `ab_test_variant` for AB testing analytics
*/

-- Create the step_views_fn_gads table
CREATE TABLE IF NOT EXISTS step_views_fn_gads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  step_name text NOT NULL,
  viewed_at timestamptz DEFAULT now() NOT NULL,
  user_agent text,
  ip_address text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  src text,
  ab_test_id uuid,
  ab_test_variant text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE step_views_fn_gads ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous users to insert step views
CREATE POLICY "Allow anonymous insert on step_views_fn_gads"
  ON step_views_fn_gads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow anonymous users to select step views (for analytics)
CREATE POLICY "Allow anonymous select on step_views_fn_gads"
  ON step_views_fn_gads
  FOR SELECT
  TO anon
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_step_views_fn_gads_session_id ON step_views_fn_gads(session_id);
CREATE INDEX IF NOT EXISTS idx_step_views_fn_gads_step_name ON step_views_fn_gads(step_name);
CREATE INDEX IF NOT EXISTS idx_step_views_fn_gads_viewed_at ON step_views_fn_gads(viewed_at);
CREATE INDEX IF NOT EXISTS idx_step_views_fn_gads_ab_test ON step_views_fn_gads(ab_test_id, ab_test_variant);
