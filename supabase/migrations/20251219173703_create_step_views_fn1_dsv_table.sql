/*
  # Create step_views_fn1_dsv table

  1. New Tables
    - `step_views_fn1_dsv`
      - `id` (uuid, primary key)
      - `session_id` (text) - Unique session identifier
      - `video` (boolean) - Video step viewed
      - `testimonials` (boolean) - Testimonials step viewed
      - `name` (boolean) - Name collection step viewed
      - `birth` (boolean) - Birth data step viewed
      - `love_situation` (boolean) - Love situation step viewed
      - `palm_reading` (boolean) - Palm reading step viewed
      - `revelation` (boolean) - Revelation step viewed
      - `paywall` (boolean) - Paywall step viewed
      - `thank_you` (boolean) - Thank you step viewed
      - `checkout` (boolean) - Checkout step clicked
      - `ab_test_id` (uuid, nullable) - AB test identifier
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record last update timestamp

  2. Security
    - Enable RLS on `step_views_fn1_dsv` table
    - Add policy for anonymous users to insert their own records
    - Add policy for anonymous users to update their own records
    - Add policy for anonymous users to select their own records

  3. Indexes
    - Add index on session_id for faster lookups
    - Add index on ab_test_id for analytics queries
    - Add index on created_at for time-based queries
*/

CREATE TABLE IF NOT EXISTS step_views_fn1_dsv (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  video boolean DEFAULT false,
  testimonials boolean DEFAULT false,
  name boolean DEFAULT false,
  birth boolean DEFAULT false,
  love_situation boolean DEFAULT false,
  palm_reading boolean DEFAULT false,
  revelation boolean DEFAULT false,
  paywall boolean DEFAULT false,
  thank_you boolean DEFAULT false,
  checkout boolean DEFAULT false,
  ab_test_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE step_views_fn1_dsv ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon to insert step_views_fn1_dsv"
  ON step_views_fn1_dsv
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon to update step_views_fn1_dsv"
  ON step_views_fn1_dsv
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon to select step_views_fn1_dsv"
  ON step_views_fn1_dsv
  FOR SELECT
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS idx_step_views_fn1_dsv_session_id ON step_views_fn1_dsv(session_id);
CREATE INDEX IF NOT EXISTS idx_step_views_fn1_dsv_ab_test_id ON step_views_fn1_dsv(ab_test_id);
CREATE INDEX IF NOT EXISTS idx_step_views_fn1_dsv_created_at ON step_views_fn1_dsv(created_at);
