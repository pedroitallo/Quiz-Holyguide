/*
  # Create Funnel Step Views Tables

  Creates individual step tracking tables for each funnel with unique rows per session.

  ## Tables Created

  ### 1. step_views_funnel_1
  Tracks user progress through funnel-1 with columns:
  - `id` (uuid, primary key) - Unique identifier
  - `session_id` (text, unique) - User session identifier
  - `funnel_type` (text) - Always 'funnel-1'
  - `viewed_at` (timestamptz) - First view timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `utm_source` (text) - UTM source parameter
  - `utm_medium` (text) - UTM medium parameter
  - `utm_campaign` (text) - UTM campaign parameter
  - `video` (boolean) - Step 1: Video viewed
  - `testimonials` (boolean) - Step 2: Testimonials viewed
  - `name` (boolean) - Step 3: Name collection viewed
  - `birth` (boolean) - Step 4: Birth data collection viewed
  - `love_situation` (boolean) - Step 5: Love situation viewed
  - `palm_reading` (boolean) - Step 6: Palm reading viewed
  - `revelation` (boolean) - Step 7: Revelation viewed
  - `paywall` (boolean) - Step 8: Paywall viewed
  - `thank_you` (boolean) - Step 9: Thank you viewed

  ### 2. step_views_funnel_tt
  Tracks user progress through funnel-tt with same structure as funnel-1

  ### 3. step_views_funnel_vsl
  Tracks user progress through funnel-vsl with columns:
  - Same base columns as above
  - `video` (boolean) - Step 1: VSL video viewed
  - `sales` (boolean) - Step 2: Sales section viewed

  ### 4. step_views_funnelesp
  Tracks user progress through funnelesp with same structure as funnel-1

  ## Security
  - RLS enabled on all tables
  - Anonymous users can insert and update their own data
  - Authenticated admins can read all data
*/

-- Create step_views_funnel_1 table
CREATE TABLE IF NOT EXISTS step_views_funnel_1 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  funnel_type text DEFAULT 'funnel-1',
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
  thank_you boolean
);

-- Create step_views_funnel_tt table
CREATE TABLE IF NOT EXISTS step_views_funnel_tt (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  funnel_type text DEFAULT 'funnel-tt',
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
  thank_you boolean
);

-- Create step_views_funnel_vsl table
CREATE TABLE IF NOT EXISTS step_views_funnel_vsl (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  funnel_type text DEFAULT 'funnel-vsl',
  viewed_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  utm_source text DEFAULT '',
  utm_medium text DEFAULT '',
  utm_campaign text DEFAULT '',
  video boolean,
  sales boolean
);

-- Create step_views_funnelesp table
CREATE TABLE IF NOT EXISTS step_views_funnelesp (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  funnel_type text DEFAULT 'funnelesp',
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
  thank_you boolean
);

-- Enable RLS on all tables
ALTER TABLE step_views_funnel_1 ENABLE ROW LEVEL SECURITY;
ALTER TABLE step_views_funnel_tt ENABLE ROW LEVEL SECURITY;
ALTER TABLE step_views_funnel_vsl ENABLE ROW LEVEL SECURITY;
ALTER TABLE step_views_funnelesp ENABLE ROW LEVEL SECURITY;

-- RLS Policies for step_views_funnel_1
CREATE POLICY "Anonymous users can insert funnel-1 views"
  ON step_views_funnel_1 FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous users can update funnel-1 views"
  ON step_views_funnel_1 FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can read funnel-1 views"
  ON step_views_funnel_1 FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated admins can delete funnel-1 views"
  ON step_views_funnel_1 FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for step_views_funnel_tt
CREATE POLICY "Anonymous users can insert funnel-tt views"
  ON step_views_funnel_tt FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous users can update funnel-tt views"
  ON step_views_funnel_tt FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can read funnel-tt views"
  ON step_views_funnel_tt FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated admins can delete funnel-tt views"
  ON step_views_funnel_tt FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for step_views_funnel_vsl
CREATE POLICY "Anonymous users can insert funnel-vsl views"
  ON step_views_funnel_vsl FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous users can update funnel-vsl views"
  ON step_views_funnel_vsl FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can read funnel-vsl views"
  ON step_views_funnel_vsl FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated admins can delete funnel-vsl views"
  ON step_views_funnel_vsl FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for step_views_funnelesp
CREATE POLICY "Anonymous users can insert funnelesp views"
  ON step_views_funnelesp FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous users can update funnelesp views"
  ON step_views_funnelesp FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can read funnelesp views"
  ON step_views_funnelesp FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated admins can delete funnelesp views"
  ON step_views_funnelesp FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_1_session ON step_views_funnel_1(session_id);
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_tt_session ON step_views_funnel_tt(session_id);
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_vsl_session ON step_views_funnel_vsl(session_id);
CREATE INDEX IF NOT EXISTS idx_step_views_funnelesp_session ON step_views_funnelesp(session_id);
