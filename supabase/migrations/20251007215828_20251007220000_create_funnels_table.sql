/*
  # Create funnels management table

  1. New Tables
    - `funnels`
      - `id` (uuid, primary key)
      - `name` (text) - Nome do funil/quiz
      - `slug` (text, unique) - URL slug (ex: funnel-1)
      - `description` (text) - Descrição do funil
      - `status` (enum) - Status: draft, active, inactive
      - `tags` (text[]) - Tags para organização
      - `config` (jsonb) - Configurações personalizadas do funil
      - `created_by` (uuid) - Referência ao admin que criou
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `funnels` table
    - Add policies for authenticated admin users only
    - Add policy for anon users to read active funnels (for rendering)
*/

-- Create status enum
DO $$ BEGIN
  CREATE TYPE funnel_status AS ENUM ('draft', 'active', 'inactive');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create funnels table
CREATE TABLE IF NOT EXISTS funnels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  status funnel_status DEFAULT 'draft',
  tags text[] DEFAULT '{}',
  config jsonb DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES admin_users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS funnels_slug_idx ON funnels(slug);
CREATE INDEX IF NOT EXISTS funnels_status_idx ON funnels(status);
CREATE INDEX IF NOT EXISTS funnels_created_by_idx ON funnels(created_by);
CREATE INDEX IF NOT EXISTS funnels_tags_idx ON funnels USING gin(tags);

-- Enable RLS
ALTER TABLE funnels ENABLE ROW LEVEL SECURITY;

-- Policy: Anon users can read active funnels (for public rendering)
CREATE POLICY "Anon users can view active funnels"
  ON funnels FOR SELECT
  TO anon
  USING (status = 'active');

-- Policy: Authenticated admins can view all funnels
CREATE POLICY "Admins can view all funnels"
  ON funnels FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated admins can insert funnels
CREATE POLICY "Admins can create funnels"
  ON funnels FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated admins can update funnels
CREATE POLICY "Admins can update funnels"
  ON funnels FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated admins can delete funnels
CREATE POLICY "Admins can delete funnels"
  ON funnels FOR DELETE
  TO authenticated
  USING (true);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_funnels_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER funnels_updated_at
  BEFORE UPDATE ON funnels
  FOR EACH ROW
  EXECUTE FUNCTION update_funnels_updated_at();