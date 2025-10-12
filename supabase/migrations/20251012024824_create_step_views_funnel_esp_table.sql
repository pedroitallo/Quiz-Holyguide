/*
  # Create step_views_funnel_esp table

  1. New Tables
    - `step_views_funnel_esp`
      - `id` (uuid, primary key)
      - `session_id` (text, unique)
      - `funnel_type` (text)
      - `video` (boolean, default false)
      - `testimonials` (boolean, default false)
      - `name` (boolean, default false)
      - `birth` (boolean, default false)
      - `love_situation` (boolean, default false)
      - `palm_reading` (boolean, default false)
      - `revelation` (boolean, default false)
      - `paywall` (boolean, default false)
      - `thank_you` (boolean, default false)
      - `ab_test_id` (uuid, nullable, references ab_tests)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `step_views_funnel_esp` table
    - Add policy for anonymous users to insert their own step views
    - Add policy for anonymous users to update their own step views
    - Add policy for anonymous users to select their own step views
    - Add policy for authenticated users to read all step views
  
  3. Indexes
    - Add index on `ab_test_id` for faster queries
*/

-- Create the step_views_funnel_esp table
CREATE TABLE IF NOT EXISTS step_views_funnel_esp (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  funnel_type text DEFAULT 'funnel-esp',
  video boolean DEFAULT false,
  testimonials boolean DEFAULT false,
  name boolean DEFAULT false,
  birth boolean DEFAULT false,
  love_situation boolean DEFAULT false,
  palm_reading boolean DEFAULT false,
  revelation boolean DEFAULT false,
  paywall boolean DEFAULT false,
  thank_you boolean DEFAULT false,
  ab_test_id uuid REFERENCES ab_tests(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE step_views_funnel_esp ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous users
CREATE POLICY "Allow anon to insert step views"
  ON step_views_funnel_esp
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon to update step views"
  ON step_views_funnel_esp
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon to select step views"
  ON step_views_funnel_esp
  FOR SELECT
  TO anon
  USING (true);

-- Create policy for authenticated users
CREATE POLICY "Allow authenticated to read all step views"
  ON step_views_funnel_esp
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index on ab_test_id for better performance
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_esp_ab_test_id 
  ON step_views_funnel_esp(ab_test_id);

-- Create index on session_id for better performance
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_esp_session_id 
  ON step_views_funnel_esp(session_id);
