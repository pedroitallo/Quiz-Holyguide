/*
  # Create quiz results table

  1. New Tables
    - `quiz_results`
      - `id` (uuid, primary key)
      - `funnel_type` (text) - Type of funnel (funnel-1, funnelesp)
      - `name` (text) - User's name
      - `birth_date` (date) - User's birth date
      - `birth_day` (text) - Day component
      - `birth_month` (text) - Month component  
      - `birth_year` (text) - Year component
      - `love_situation` (text) - User's love situation
      - `current_step` (integer) - Current step in funnel
      - `last_step_viewed` (integer) - Last step viewed
      - `pitch_step_viewed` (boolean) - Whether pitch step was viewed
      - `checkout_step_clicked` (boolean) - Whether checkout was clicked
      - `utm_source` (text) - UTM source parameter
      - `utm_medium` (text) - UTM medium parameter
      - `utm_campaign` (text) - UTM campaign parameter
      - `src` (text) - Source parameter
      - `started_at` (timestamptz) - When quiz was started
      - `created_at` (timestamptz) - Record creation time
      - `updated_at` (timestamptz) - Last update time

  2. Security
    - Enable RLS on `quiz_results` table
    - Add policy for service role to manage all data
    - Add policy for authenticated users to read their own data
*/

CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_type text NOT NULL DEFAULT '',
  name text DEFAULT '',
  birth_date date,
  birth_day text DEFAULT '',
  birth_month text DEFAULT '',
  birth_year text DEFAULT '',
  love_situation text DEFAULT '',
  current_step integer DEFAULT 1,
  last_step_viewed integer DEFAULT 1,
  pitch_step_viewed boolean DEFAULT false,
  checkout_step_clicked boolean DEFAULT false,
  utm_source text DEFAULT '',
  utm_medium text DEFAULT '',
  utm_campaign text DEFAULT '',
  src text DEFAULT '',
  started_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Policy for service role to manage all data (for server-side operations)
CREATE POLICY "Service role can manage all quiz results"
  ON quiz_results
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy for authenticated users to read their own data (for dashboard access)
CREATE POLICY "Users can read their own quiz results"
  ON quiz_results
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index for better performance on common queries
CREATE INDEX IF NOT EXISTS idx_quiz_results_funnel_type ON quiz_results(funnel_type);
CREATE INDEX IF NOT EXISTS idx_quiz_results_created_at ON quiz_results(created_at);
CREATE INDEX IF NOT EXISTS idx_quiz_results_current_step ON quiz_results(current_step);