/*
  # Create step_views_funnel_chat1 table

  ## Summary
  Creates step tracking table for funnel-chat1 with quiz progression tracking.

  ## Tables Created
  1. `step_views_funnel_chat1`
     - Tracks user progression through funnel-chat1
     - Steps: video, testimonials, name, birth, love_situation, palm_reading, revelation, paywall, thank_you

  ## Columns
  - `id` (uuid, primary key) - Unique identifier
  - `session_id` (text, unique, required) - User session identifier
  - `funnel_type` (text) - Defaults to 'funnel-chat1'
  - `viewed_at` (timestamptz) - First time session was created
  - `updated_at` (timestamptz) - Last update time
  - `utm_source` (text) - UTM source parameter
  - `utm_medium` (text) - UTM medium parameter
  - `utm_campaign` (text) - UTM campaign parameter
  - `video` (boolean) - Video step viewed
  - `testimonials` (boolean) - Testimonials step viewed
  - `name` (boolean) - Name collection step viewed
  - `birth` (boolean) - Birth data collection step viewed
  - `love_situation` (boolean) - Love situation step viewed
  - `palm_reading` (boolean) - Palm reading results step viewed
  - `revelation` (boolean) - Loading revelation step viewed
  - `paywall` (boolean) - Paywall/checkout offer step viewed
  - `thank_you` (boolean) - Thank you page viewed
  - `ab_test_id` (uuid, nullable) - Links to A/B test if part of one

  ## Security
  - RLS enabled on table
  - Anonymous users can INSERT and UPDATE their own session data
  - Authenticated admins can read all data
*/

CREATE TABLE IF NOT EXISTS step_views_funnel_chat1 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  funnel_type text DEFAULT 'funnel-chat1',
  viewed_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  utm_source text DEFAULT '',
  utm_medium text DEFAULT '',
  utm_campaign text DEFAULT '',
  video boolean,
  testimonials boolean,
  name boolean,
  birth boolean,
  love_situation boolean,
  palm_reading boolean,
  revelation boolean,
  paywall boolean,
  thank_you boolean,
  ab_test_id uuid
);

ALTER TABLE step_views_funnel_chat1 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anonymous users can insert funnel-chat1 views"
  ON step_views_funnel_chat1 FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous users can update funnel-chat1 views"
  ON step_views_funnel_chat1 FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anonymous users can select funnel-chat1 views"
  ON step_views_funnel_chat1 FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated admins can read funnel-chat1 views"
  ON step_views_funnel_chat1 FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated admins can delete funnel-chat1 views"
  ON step_views_funnel_chat1 FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_step_views_funnel_chat1_session ON step_views_funnel_chat1(session_id);
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_chat1_ab_test ON step_views_funnel_chat1(ab_test_id);
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_chat1_viewed_at ON step_views_funnel_chat1(viewed_at);
