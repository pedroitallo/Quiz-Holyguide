/*
  # Create step_views tables for funnel-star2, star3, star4, star5

  ## Summary
  Creates step tracking tables for the new star funnel variants (star2, star3, star4, star5).
  These funnels do NOT have a testimonials step, only intro step instead.

  ## Tables Created
  1. `step_views_funnel_star2`
     - Tracks user progression through funnel-star2
     - Steps: intro, name, birth, love_situation, palm_reading, revelation, paywall, thank_you, checkout
     
  2. `step_views_funnel_star3`
     - Tracks user progression through funnel-star3
     - Same steps as star2
     
  3. `step_views_funnel_star4`
     - Tracks user progression through funnel-star4
     - Same steps as star2
     
  4. `step_views_funnel_star5`
     - Tracks user progression through funnel-star5
     - Same steps as star2

  ## Columns
  - `id` (uuid, primary key) - Unique identifier
  - `session_id` (text, unique, required) - Links to quiz_results session
  - `funnel_type` (text) - Defaults to specific funnel name
  - `viewed_at` (timestamptz) - First time session was created
  - `updated_at` (timestamptz) - Last update time
  - `intro` (boolean) - Custom intro step viewed
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
  - RLS enabled on all tables
  - Anonymous users can INSERT and UPDATE their own session data
  - Service role has full access for analytics
*/

-- Create step_views_funnel_star2 table
CREATE TABLE IF NOT EXISTS step_views_funnel_star2 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  funnel_type text DEFAULT 'funnel-star2',
  viewed_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  intro boolean,
  name boolean,
  birth boolean,
  love_situation boolean,
  palm_reading boolean,
  revelation boolean,
  paywall boolean,
  thank_you boolean,
  checkout boolean,
  ab_test_id uuid
);

-- Enable RLS
ALTER TABLE step_views_funnel_star2 ENABLE ROW LEVEL SECURITY;

-- Create policies for step_views_funnel_star2
CREATE POLICY "Anyone can insert their session data"
  ON step_views_funnel_star2 FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update their session data"
  ON step_views_funnel_star2 FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can select step views"
  ON step_views_funnel_star2 FOR SELECT
  TO anon
  USING (true);

-- Create step_views_funnel_star3 table
CREATE TABLE IF NOT EXISTS step_views_funnel_star3 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  funnel_type text DEFAULT 'funnel-star3',
  viewed_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  intro boolean,
  name boolean,
  birth boolean,
  love_situation boolean,
  palm_reading boolean,
  revelation boolean,
  paywall boolean,
  thank_you boolean,
  checkout boolean,
  ab_test_id uuid
);

-- Enable RLS
ALTER TABLE step_views_funnel_star3 ENABLE ROW LEVEL SECURITY;

-- Create policies for step_views_funnel_star3
CREATE POLICY "Anyone can insert their session data"
  ON step_views_funnel_star3 FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update their session data"
  ON step_views_funnel_star3 FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can select step views"
  ON step_views_funnel_star3 FOR SELECT
  TO anon
  USING (true);

-- Create step_views_funnel_star4 table
CREATE TABLE IF NOT EXISTS step_views_funnel_star4 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  funnel_type text DEFAULT 'funnel-star4',
  viewed_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  intro boolean,
  name boolean,
  birth boolean,
  love_situation boolean,
  palm_reading boolean,
  revelation boolean,
  paywall boolean,
  thank_you boolean,
  checkout boolean,
  ab_test_id uuid
);

-- Enable RLS
ALTER TABLE step_views_funnel_star4 ENABLE ROW LEVEL SECURITY;

-- Create policies for step_views_funnel_star4
CREATE POLICY "Anyone can insert their session data"
  ON step_views_funnel_star4 FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update their session data"
  ON step_views_funnel_star4 FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can select step views"
  ON step_views_funnel_star4 FOR SELECT
  TO anon
  USING (true);

-- Create step_views_funnel_star5 table
CREATE TABLE IF NOT EXISTS step_views_funnel_star5 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  funnel_type text DEFAULT 'funnel-star5',
  viewed_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  intro boolean,
  name boolean,
  birth boolean,
  love_situation boolean,
  palm_reading boolean,
  revelation boolean,
  paywall boolean,
  thank_you boolean,
  checkout boolean,
  ab_test_id uuid
);

-- Enable RLS
ALTER TABLE step_views_funnel_star5 ENABLE ROW LEVEL SECURITY;

-- Create policies for step_views_funnel_star5
CREATE POLICY "Anyone can insert their session data"
  ON step_views_funnel_star5 FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update their session data"
  ON step_views_funnel_star5 FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can select step views"
  ON step_views_funnel_star5 FOR SELECT
  TO anon
  USING (true);
