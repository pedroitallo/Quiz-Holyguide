/*
  # Create funnel steps table

  1. New Tables
    - `funnel_steps`
      - `id` (uuid, primary key)
      - `funnel_id` (uuid, foreign key) - Referência ao funil
      - `step_order` (int) - Ordem da etapa (1, 2, 3...)
      - `step_name` (text) - Nome da etapa (ex: "video", "name_collection")
      - `component_name` (text) - Nome do componente React (ex: "VideoStep")
      - `config` (jsonb) - Configurações específicas da etapa
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `funnel_steps` table
    - Add policies for authenticated admin users
    - Add policy for anon users to read steps of active funnels
*/

-- Create funnel_steps table
CREATE TABLE IF NOT EXISTS funnel_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_id uuid NOT NULL REFERENCES funnels(id) ON DELETE CASCADE,
  step_order int NOT NULL,
  step_name text NOT NULL,
  component_name text NOT NULL,
  config jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(funnel_id, step_order)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS funnel_steps_funnel_id_idx ON funnel_steps(funnel_id);
CREATE INDEX IF NOT EXISTS funnel_steps_order_idx ON funnel_steps(funnel_id, step_order);

-- Enable RLS
ALTER TABLE funnel_steps ENABLE ROW LEVEL SECURITY;

-- Policy: Anon users can read steps of active funnels
CREATE POLICY "Anon users can view steps of active funnels"
  ON funnel_steps FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM funnels
      WHERE funnels.id = funnel_steps.funnel_id
      AND funnels.status = 'active'
    )
  );

-- Policy: Authenticated admins can view all funnel steps
CREATE POLICY "Admins can view all funnel steps"
  ON funnel_steps FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated admins can insert funnel steps
CREATE POLICY "Admins can create funnel steps"
  ON funnel_steps FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated admins can update funnel steps
CREATE POLICY "Admins can update funnel steps"
  ON funnel_steps FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated admins can delete funnel steps
CREATE POLICY "Admins can delete funnel steps"
  ON funnel_steps FOR DELETE
  TO authenticated
  USING (true);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_funnel_steps_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER funnel_steps_updated_at
  BEFORE UPDATE ON funnel_steps
  FOR EACH ROW
  EXECUTE FUNCTION update_funnel_steps_updated_at();
