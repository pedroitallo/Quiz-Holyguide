/*
  # Create step_views_fnshort_vsl1 Table

  1. New Tables
    - `step_views_fnshort_vsl1`
      - `id` (uuid, primary key) - Unique identifier
      - `session_id` (uuid) - Quiz session identifier
      - `step_name` (text) - Name of the step viewed (e.g., 'video', 'testimonials', 'name', 'birth', 'love_situation', 'palm_reading', 'revelation', 'paywall', 'thank_you')
      - `viewed_at` (timestamptz) - Timestamp of when the step was viewed
      - `created_at` (timestamptz) - Record creation timestamp
      - `ab_test_id` (uuid, nullable) - Reference to A/B test if applicable

  2. Security
    - Enable RLS on `step_views_fnshort_vsl1` table
    - Add policy for anonymous users to insert step views
    - Add policy for anonymous users to select their own step views

  3. Indexes
    - Index on `session_id` for efficient session queries
    - Index on `step_name` for analytics queries
    - Index on `viewed_at` for time-based queries
    - Index on `ab_test_id` for A/B test analytics
*/

-- Create the step_views_fnshort_vsl1 table
CREATE TABLE IF NOT EXISTS step_views_fnshort_vsl1 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL,
  step_name text NOT NULL,
  viewed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  ab_test_id uuid REFERENCES ab_tests(id) ON DELETE SET NULL
);

-- Enable Row Level Security
ALTER TABLE step_views_fnshort_vsl1 ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous users to insert step views
CREATE POLICY "Allow anonymous insert on step_views_fnshort_vsl1"
  ON step_views_fnshort_vsl1
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow anonymous users to select step views
CREATE POLICY "Allow anonymous select on step_views_fnshort_vsl1"
  ON step_views_fnshort_vsl1
  FOR SELECT
  TO anon
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_step_views_fnshort_vsl1_session_id
  ON step_views_fnshort_vsl1(session_id);

CREATE INDEX IF NOT EXISTS idx_step_views_fnshort_vsl1_step_name
  ON step_views_fnshort_vsl1(step_name);

CREATE INDEX IF NOT EXISTS idx_step_views_fnshort_vsl1_viewed_at
  ON step_views_fnshort_vsl1(viewed_at);

CREATE INDEX IF NOT EXISTS idx_step_views_fnshort_vsl1_ab_test_id
  ON step_views_fnshort_vsl1(ab_test_id);
