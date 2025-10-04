/*
  # Add result field to ab_tests table

  1. Changes
    - Add `result` column to `ab_tests` table
      - Type: TEXT
      - Nullable: true
      - Description: Stores the result/conclusion of a completed A/B test

  2. Purpose
    - Allow admins to document the outcome and learnings from completed A/B tests
    - Helps maintain historical records of test results
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ab_tests' AND column_name = 'result'
  ) THEN
    ALTER TABLE ab_tests ADD COLUMN result TEXT;
  END IF;
END $$;
