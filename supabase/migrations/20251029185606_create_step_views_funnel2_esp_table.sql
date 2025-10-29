/*
  # Create step_views_funnel2_esp table

  1. New Tables
    - `step_views_funnel2_esp`
      - `id` (uuid, primary key)
      - `session_id` (text, indexed for quick lookups)
      - `step_name` (text, the name of the quiz step)
      - `ab_test_id` (text, nullable, for A/B test tracking)
      - `viewed_at` (timestamptz, default now())
      - `user_agent` (text, nullable)
      - `ip_address` (text, nullable)
      
  2. Security
    - Enable RLS on `step_views_funnel2_esp` table
    - Add policy for anonymous users to insert their own step views
    - Add policy for anonymous users to select step views
    
  3. Indexes
    - Create index on session_id for faster queries
    - Create index on step_name for analytics
    - Create index on ab_test_id for A/B test tracking
    - Create index on viewed_at for time-based queries
*/

-- Create the step_views_funnel2_esp table
CREATE TABLE IF NOT EXISTS step_views_funnel2_esp (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  step_name text NOT NULL,
  ab_test_id text,
  viewed_at timestamptz DEFAULT now(),
  user_agent text,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE step_views_funnel2_esp ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous users to insert step views
CREATE POLICY "Allow anonymous insert on step_views_funnel2_esp"
  ON step_views_funnel2_esp
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy for anonymous users to select step views
CREATE POLICY "Allow anonymous select on step_views_funnel2_esp"
  ON step_views_funnel2_esp
  FOR SELECT
  TO anon
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_step_views_funnel2_esp_session_id 
  ON step_views_funnel2_esp(session_id);

CREATE INDEX IF NOT EXISTS idx_step_views_funnel2_esp_step_name 
  ON step_views_funnel2_esp(step_name);

CREATE INDEX IF NOT EXISTS idx_step_views_funnel2_esp_ab_test_id 
  ON step_views_funnel2_esp(ab_test_id);

CREATE INDEX IF NOT EXISTS idx_step_views_funnel2_esp_viewed_at 
  ON step_views_funnel2_esp(viewed_at DESC);