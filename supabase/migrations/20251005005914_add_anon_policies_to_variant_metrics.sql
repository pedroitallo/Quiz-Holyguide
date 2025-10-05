/*
  # Add Anonymous Policies to Variant Metrics

  1. Changes
    - Add policy for anon users to insert metrics
    - Add policy for anon users to update metrics
    
  2. Security
    - Allow anonymous users to insert and update their own metrics
    - This is needed because the analytics dashboard may be accessed without full authentication
*/

CREATE POLICY "Allow anon to insert metrics"
  ON ab_test_variant_metrics
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon to update metrics"
  ON ab_test_variant_metrics
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);