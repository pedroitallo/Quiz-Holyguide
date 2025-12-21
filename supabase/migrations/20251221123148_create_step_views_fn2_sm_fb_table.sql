/*
  # Create step_views_fn2_sm_fb table

  1. New Tables
    - `step_views_fn2_sm_fb`
      - `id` (uuid, primary key)
      - `session_id` (text) - Identificador da sessão
      - `step_name` (text) - Nome do step visualizado
      - `funnel_type` (text) - Tipo do funil (fn2-sm-fb)
      - `viewed_at` (timestamptz) - Data/hora da visualização
      - `created_at` (timestamptz) - Data de criação do registro
      - `ab_test_id` (uuid, nullable) - ID do teste A/B associado

  2. Security
    - Enable RLS on `step_views_fn2_sm_fb` table
    - Add policy for anonymous users to insert their own step views
    - Add policy for anonymous users to select step views

  3. Indexes
    - Create index on session_id for faster queries
    - Create index on ab_test_id for A/B testing queries
*/

-- Create table
CREATE TABLE IF NOT EXISTS step_views_fn2_sm_fb (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  step_name text NOT NULL,
  funnel_type text NOT NULL DEFAULT 'fn2-sm-fb',
  viewed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  ab_test_id uuid
);

-- Enable RLS
ALTER TABLE step_views_fn2_sm_fb ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous users to insert
CREATE POLICY "Allow anonymous insert on step_views_fn2_sm_fb"
  ON step_views_fn2_sm_fb
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policies for anonymous users to select
CREATE POLICY "Allow anonymous select on step_views_fn2_sm_fb"
  ON step_views_fn2_sm_fb
  FOR SELECT
  TO anon
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_step_views_fn2_sm_fb_session_id 
  ON step_views_fn2_sm_fb(session_id);

CREATE INDEX IF NOT EXISTS idx_step_views_fn2_sm_fb_ab_test_id 
  ON step_views_fn2_sm_fb(ab_test_id);

CREATE INDEX IF NOT EXISTS idx_step_views_fn2_sm_fb_viewed_at 
  ON step_views_fn2_sm_fb(viewed_at DESC);
