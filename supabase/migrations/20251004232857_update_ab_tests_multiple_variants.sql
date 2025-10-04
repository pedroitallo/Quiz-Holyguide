/*
  # Update A/B Tests table to support multiple variants (A, B, C, D, E)

  ## Summary
  Modifies the ab_tests table to support up to 5 funnel variants instead of just control/test.
  Changes naming from "control_funnel" and "test_funnel" to variant_a, variant_b, variant_c, variant_d, variant_e.

  ## Changes
  1. Add new columns for variants A through E
  2. Keep old columns for backward compatibility (will be deprecated)
  3. Update constraints to allow flexible variant configuration

  ## Migration Strategy
  - Adds new columns: variant_a, variant_b, variant_c, variant_d, variant_e
  - All variants are optional except variant_a and variant_b (minimum 2 variants required)
  - Old columns (control_funnel, test_funnel) remain for existing data

  ## Security
  - No changes to RLS policies
  - Maintains existing security model
*/

-- Add new variant columns
DO $$
BEGIN
  -- Add variant_a column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ab_tests' AND column_name = 'variant_a'
  ) THEN
    ALTER TABLE ab_tests ADD COLUMN variant_a text;
  END IF;

  -- Add variant_b column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ab_tests' AND column_name = 'variant_b'
  ) THEN
    ALTER TABLE ab_tests ADD COLUMN variant_b text;
  END IF;

  -- Add variant_c column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ab_tests' AND column_name = 'variant_c'
  ) THEN
    ALTER TABLE ab_tests ADD COLUMN variant_c text;
  END IF;

  -- Add variant_d column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ab_tests' AND column_name = 'variant_d'
  ) THEN
    ALTER TABLE ab_tests ADD COLUMN variant_d text;
  END IF;

  -- Add variant_e column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ab_tests' AND column_name = 'variant_e'
  ) THEN
    ALTER TABLE ab_tests ADD COLUMN variant_e text;
  END IF;
END $$;

-- Migrate existing data from control_funnel/test_funnel to variant_a/variant_b
UPDATE ab_tests 
SET 
  variant_a = control_funnel,
  variant_b = test_funnel
WHERE variant_a IS NULL AND variant_b IS NULL;

-- Make control_funnel and test_funnel nullable for new records
ALTER TABLE ab_tests ALTER COLUMN control_funnel DROP NOT NULL;
ALTER TABLE ab_tests ALTER COLUMN test_funnel DROP NOT NULL;

-- Add comment explaining the new structure
COMMENT ON COLUMN ab_tests.variant_a IS 'Variant A funnel (required, minimum 2 variants needed)';
COMMENT ON COLUMN ab_tests.variant_b IS 'Variant B funnel (required, minimum 2 variants needed)';
COMMENT ON COLUMN ab_tests.variant_c IS 'Variant C funnel (optional, for 3-way tests)';
COMMENT ON COLUMN ab_tests.variant_d IS 'Variant D funnel (optional, for 4-way tests)';
COMMENT ON COLUMN ab_tests.variant_e IS 'Variant E funnel (optional, for 5-way tests)';
COMMENT ON COLUMN ab_tests.control_funnel IS 'DEPRECATED: Use variant_a instead';
COMMENT ON COLUMN ab_tests.test_funnel IS 'DEPRECATED: Use variant_b instead';
