/*
  # Create A/B Test Variant Metrics Table

  1. New Tables
    - `ab_test_variant_metrics`
      - `id` (uuid, primary key)
      - `ab_test_id` (uuid, foreign key to ab_tests)
      - `variant_name` (text) - Nome da variante (variant_a, variant_b, etc)
      - `checkout_count` (integer) - Número manual de checkouts
      - `sales_count` (integer) - Número manual de vendas
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `ab_test_variant_metrics` table
    - Add policy for authenticated users to read all metrics
    - Add policy for authenticated users to insert/update metrics
    - Add policy for anon users to read metrics (for analytics dashboard)

  3. Indexes
    - Index on ab_test_id for faster lookups
    - Unique constraint on (ab_test_id, variant_name) to prevent duplicates
*/

CREATE TABLE IF NOT EXISTS ab_test_variant_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ab_test_id uuid NOT NULL REFERENCES ab_tests(id) ON DELETE CASCADE,
  variant_name text NOT NULL,
  checkout_count integer DEFAULT 0,
  sales_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(ab_test_id, variant_name)
);

ALTER TABLE ab_test_variant_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon to read metrics"
  ON ab_test_variant_metrics
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated to read metrics"
  ON ab_test_variant_metrics
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated to insert metrics"
  ON ab_test_variant_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated to update metrics"
  ON ab_test_variant_metrics
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_ab_test_variant_metrics_ab_test_id 
  ON ab_test_variant_metrics(ab_test_id);

CREATE INDEX IF NOT EXISTS idx_ab_test_variant_metrics_variant_name 
  ON ab_test_variant_metrics(variant_name);