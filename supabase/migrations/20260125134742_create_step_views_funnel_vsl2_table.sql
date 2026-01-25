/*
  # Create step_views_funnel_vsl2 table

  1. New Tables
    - `step_views_funnel_vsl2`
      - `id` (uuid, primary key)
      - `session_id` (text) - Identificador único da sessão do usuário
      - `step_name` (text) - Nome do passo visualizado
      - `viewed_at` (timestamptz) - Data/hora da visualização
      - `utm_source` (text) - Origem do tráfego
      - `utm_medium` (text) - Meio do tráfego
      - `utm_campaign` (text) - Campanha do tráfego
      - `src` (text) - Parâmetro src adicional
      - `ab_test_id` (text, nullable) - ID do teste A/B associado
      - `ab_variant` (text, nullable) - Variante do teste A/B

  2. Security
    - Enable RLS on `step_views_funnel_vsl2` table
    - Add policy for anonymous users to insert their own step views

  3. Indexes
    - Index on session_id for fast lookups
    - Index on viewed_at for time-based queries
    - Index on ab_test_id for A/B test analysis
*/

CREATE TABLE IF NOT EXISTS step_views_funnel_vsl2 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  step_name text NOT NULL,
  viewed_at timestamptz DEFAULT now(),
  utm_source text DEFAULT 'direct',
  utm_medium text DEFAULT 'organic',
  utm_campaign text DEFAULT 'none',
  src text DEFAULT '',
  ab_test_id text,
  ab_variant text
);

ALTER TABLE step_views_funnel_vsl2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous users to insert step views"
  ON step_views_funnel_vsl2
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous users to select their step views"
  ON step_views_funnel_vsl2
  FOR SELECT
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS idx_step_views_funnel_vsl2_session_id 
  ON step_views_funnel_vsl2(session_id);

CREATE INDEX IF NOT EXISTS idx_step_views_funnel_vsl2_viewed_at 
  ON step_views_funnel_vsl2(viewed_at);

CREATE INDEX IF NOT EXISTS idx_step_views_funnel_vsl2_ab_test_id 
  ON step_views_funnel_vsl2(ab_test_id);
