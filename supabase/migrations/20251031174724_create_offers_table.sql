/*
  # Create offers table

  1. New Tables
    - `offers`
      - `id` (uuid, primary key)
      - `application_id` (uuid, foreign key to applications)
      - `name` (text, offer name)
      - `description` (text, offer description)
      - `price` (numeric, offer price)
      - `currency` (text, currency code like BRL, USD)
      - `checkouts` (jsonb, array of checkout configurations)
      - `status` (text, active/inactive)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `offers` table
    - Add policy for authenticated admins to manage offers
    - Add policy for anon users to read active offers
*/

CREATE TABLE IF NOT EXISTS offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  price numeric DEFAULT 0,
  currency text DEFAULT 'BRL',
  checkouts jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon users can read active offers"
  ON offers
  FOR SELECT
  TO anon
  USING (status = 'active');

CREATE POLICY "Authenticated users can read all offers"
  ON offers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert offers"
  ON offers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update offers"
  ON offers
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete offers"
  ON offers
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_offers_application_id ON offers(application_id);
CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);