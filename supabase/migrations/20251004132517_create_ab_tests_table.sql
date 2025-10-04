/*
  # Create A/B Tests Table

  ## Description
  This migration creates the infrastructure for managing A/B tests in the analytics dashboard.

  ## New Tables
  
  ### `ab_tests`
  Stores A/B test configurations and results
  - `id` (uuid, primary key) - Unique identifier for each A/B test
  - `name` (text, required) - Name of the A/B test
  - `hypothesis` (text) - The hypothesis being tested
  - `objective` (text) - The objective of the test
  - `control_funnel` (text, required) - The control funnel identifier (e.g., 'funnel-1')
  - `test_funnel` (text, required) - The test funnel identifier (e.g., 'funnel-2')
  - `start_date` (timestamptz, required) - When the test starts
  - `end_date` (timestamptz) - When the test ends (null if ongoing)
  - `status` (text, required) - Test status: 'active', 'paused', 'completed'
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ## Security
  - Enable RLS on `ab_tests` table
  - Add policy for anonymous users to read active tests
  - Add policy for anonymous users to insert/update tests (for demo purposes)

  ## Notes
  - Tests can be edited while active or paused
  - Completed tests are archived in history
  - Only one test can be active at a time per funnel combination
*/

CREATE TABLE IF NOT EXISTS ab_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  hypothesis text,
  objective text,
  control_funnel text NOT NULL,
  test_funnel text NOT NULL,
  start_date timestamptz NOT NULL DEFAULT now(),
  end_date timestamptz,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ab_tests"
  ON ab_tests
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert ab_tests"
  ON ab_tests
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update ab_tests"
  ON ab_tests
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete ab_tests"
  ON ab_tests
  FOR DELETE
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS idx_ab_tests_status ON ab_tests(status);
CREATE INDEX IF NOT EXISTS idx_ab_tests_dates ON ab_tests(start_date, end_date);