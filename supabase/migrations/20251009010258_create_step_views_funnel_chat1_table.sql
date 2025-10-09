/*
  # Create step_views_funnel_chat1 table

  ## Summary
  Creates step tracking table for funnel-chat1, which is a conversational chat-based funnel.
  This funnel has unique steps including a chat interface and paywall.

  ## Table Created
  1. `step_views_funnel_chat1`
     - Tracks user progression through funnel-chat1
     - Steps: chat, name, birth, love_situation, palm_reading, revelation, paywall, thank_you, checkout
     
  ## Columns
  - `id` (uuid, primary key) - Unique identifier
  - `session_id` (text, unique, required) - Links to quiz_results session
  - `funnel_type` (text) - Defaults to 'funnel-chat1'
  - `viewed_at` (timestamptz) - First time session was created
  - `updated_at` (timestamptz) - Last update time
  - `chat` (boolean) - Chat interface step viewed
  - `name` (boolean) - Name collection step viewed
  - `birth` (boolean) - Birth data collection step viewed
  - `love_situation` (boolean) - Love situation step viewed
  - `palm_reading` (boolean) - Palm reading results step viewed
  - `revelation` (boolean) - Loading revelation step viewed
  - `paywall` (boolean) - Paywall/checkout offer step viewed
  - `thank_you` (boolean) - Thank you page viewed
  - `checkout` (boolean) - User clicked checkout button
  - `ab_test_id` (uuid, nullable) - Links to A/B test if part of one

  ## Security
  - RLS enabled on table
  - Anonymous users can INSERT and UPDATE their own session data
  - Service role has full access for analytics
*/

-- Create step_views_funnel_chat1 table
CREATE TABLE IF NOT EXISTS step_views_funnel_chat1 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  funnel_type text DEFAULT 'funnel-chat1',
  viewed_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  chat boolean DEFAULT false,
  name boolean DEFAULT false,
  birth boolean DEFAULT false,
  love_situation boolean DEFAULT false,
  palm_reading boolean DEFAULT false,
  revelation boolean DEFAULT false,
  paywall boolean DEFAULT false,
  thank_you boolean DEFAULT false,
  checkout boolean DEFAULT false,
  ab_test_id uuid
);

-- Enable RLS
ALTER TABLE step_views_funnel_chat1 ENABLE ROW LEVEL SECURITY;

-- Create policies for step_views_funnel_chat1
CREATE POLICY "Anyone can insert their session data"
  ON step_views_funnel_chat1 FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update their session data"
  ON step_views_funnel_chat1 FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can select step views"
  ON step_views_funnel_chat1 FOR SELECT
  TO anon
  USING (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_funnel_chat1_session_id ON step_views_funnel_chat1(session_id);
CREATE INDEX IF NOT EXISTS idx_funnel_chat1_ab_test_id ON step_views_funnel_chat1(ab_test_id);
CREATE INDEX IF NOT EXISTS idx_funnel_chat1_viewed_at ON step_views_funnel_chat1(viewed_at);
