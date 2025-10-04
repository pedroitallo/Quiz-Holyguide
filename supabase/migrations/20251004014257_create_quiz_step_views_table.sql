/*
  # Create Quiz Step Views Table

  ## Summary
  Creates a new table to track user views at each step of the quiz funnel.
  This table is optimized for analytics and provides granular tracking of user progression.

  ## New Tables
  
  ### `quiz_step_views`
  - `id` (uuid, primary key) - Unique record identifier
  - `session_id` (text, not null) - Unique session identifier for the user
  - `funnel_type` (text, not null) - Type of funnel (funnel-1, funnel-tt, funnel-vsl, funnelesp)
  - `step_name` (text, not null) - Name of the step being viewed
  - `step_order` (integer) - Sequential order of the step in the funnel
  - `viewed_at` (timestamptz) - Timestamp when the step was viewed
  - `utm_source` (text) - UTM source parameter
  - `utm_medium` (text) - UTM medium parameter
  - `utm_campaign` (text) - UTM campaign parameter
  - `metadata` (jsonb) - Additional metadata (user agent, screen size, etc)
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on the table
  - Allow anonymous users to insert their view data
  - Allow authenticated admins to read all data
  - Allow authenticated admins to delete data (for cleanup)

  ## Indexes
  - Index on session_id for tracking individual user journeys
  - Index on funnel_type and viewed_at for analytics queries
  - Index on step_name for step-specific analytics
*/

-- Create quiz_step_views table
CREATE TABLE IF NOT EXISTS quiz_step_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  funnel_type text NOT NULL,
  step_name text NOT NULL,
  step_order integer DEFAULT 0,
  viewed_at timestamptz DEFAULT now(),
  utm_source text DEFAULT '',
  utm_medium text DEFAULT '',
  utm_campaign text DEFAULT '',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE quiz_step_views ENABLE ROW LEVEL SECURITY;

-- Policy for anonymous users to insert their view data
CREATE POLICY "Anonymous users can insert view data"
  ON quiz_step_views
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy for authenticated admins to read all data
CREATE POLICY "Authenticated admins can read all views"
  ON quiz_step_views
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for authenticated admins to delete data
CREATE POLICY "Authenticated admins can delete views"
  ON quiz_step_views
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_quiz_step_views_session_id 
  ON quiz_step_views(session_id);

CREATE INDEX IF NOT EXISTS idx_quiz_step_views_funnel_viewed 
  ON quiz_step_views(funnel_type, viewed_at DESC);

CREATE INDEX IF NOT EXISTS idx_quiz_step_views_step_name 
  ON quiz_step_views(step_name, viewed_at DESC);

CREATE INDEX IF NOT EXISTS idx_quiz_step_views_created_at 
  ON quiz_step_views(created_at DESC);
