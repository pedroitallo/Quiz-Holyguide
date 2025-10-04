/*
  # Add A/B Test ID to Step Views Tables

  ## Description
  Adds ab_test_id column to all step_views tracking tables to enable isolated
  data collection for A/B tests. This allows tests to start with "zero" data
  while preserving historical data from funnels.

  ## Changes

  ### step_views_funnel_* tables
  - Add `ab_test_id` (uuid, nullable) to all 4 tables:
    - step_views_funnel_1
    - step_views_funnel_tt
    - step_views_funnel_vsl
    - step_views_funnelesp
  - Links session tracking to specific A/B test

  ## Indexes
  - Create partial indexes on ab_test_id columns for optimal query performance
  - Indexes only on non-null values to minimize overhead
  - Composite indexes for common query patterns (ab_test_id + date)

  ## Backward Compatibility
  - All columns are nullable (default: NULL)
  - Existing queries work unchanged (ab_test_id = NULL for historical data)
  - New queries can filter by ab_test_id for test-specific analytics

  ## Security
  - No RLS changes needed
  - Existing policies remain unchanged
  - ab_test_id is just a data field, not a security boundary

  ## Usage
  - When A/B test is active: new records get ab_test_id = test UUID
  - When no test is active: new records get ab_test_id = NULL (same as before)
  - Analytics can filter by ab_test_id to isolate test data
  - Resetting test data only affects records with specific ab_test_id
*/

-- Add ab_test_id to step_views_funnel_1
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'step_views_funnel_1' AND column_name = 'ab_test_id'
  ) THEN
    ALTER TABLE step_views_funnel_1 ADD COLUMN ab_test_id uuid;
    COMMENT ON COLUMN step_views_funnel_1.ab_test_id IS 'Links this session to a specific A/B test. NULL means general funnel data.';
  END IF;
END $$;

-- Add ab_test_id to step_views_funnel_tt
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'step_views_funnel_tt' AND column_name = 'ab_test_id'
  ) THEN
    ALTER TABLE step_views_funnel_tt ADD COLUMN ab_test_id uuid;
    COMMENT ON COLUMN step_views_funnel_tt.ab_test_id IS 'Links this session to a specific A/B test. NULL means general funnel data.';
  END IF;
END $$;

-- Add ab_test_id to step_views_funnel_vsl
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'step_views_funnel_vsl' AND column_name = 'ab_test_id'
  ) THEN
    ALTER TABLE step_views_funnel_vsl ADD COLUMN ab_test_id uuid;
    COMMENT ON COLUMN step_views_funnel_vsl.ab_test_id IS 'Links this session to a specific A/B test. NULL means general funnel data.';
  END IF;
END $$;

-- Add ab_test_id to step_views_funnelesp
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'step_views_funnelesp' AND column_name = 'ab_test_id'
  ) THEN
    ALTER TABLE step_views_funnelesp ADD COLUMN ab_test_id uuid;
    COMMENT ON COLUMN step_views_funnelesp.ab_test_id IS 'Links this session to a specific A/B test. NULL means general funnel data.';
  END IF;
END $$;

-- Create partial indexes for efficient filtering by ab_test_id
-- Only index non-null values to minimize storage and maintain performance
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_1_ab_test_id 
  ON step_views_funnel_1(ab_test_id) 
  WHERE ab_test_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_step_views_funnel_tt_ab_test_id 
  ON step_views_funnel_tt(ab_test_id) 
  WHERE ab_test_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_step_views_funnel_vsl_ab_test_id 
  ON step_views_funnel_vsl(ab_test_id) 
  WHERE ab_test_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_step_views_funnelesp_ab_test_id 
  ON step_views_funnelesp(ab_test_id) 
  WHERE ab_test_id IS NOT NULL;

-- Add composite indexes for common query patterns (ab_test_id + date)
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_1_ab_test_viewed 
  ON step_views_funnel_1(ab_test_id, viewed_at DESC) 
  WHERE ab_test_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_step_views_funnel_tt_ab_test_viewed 
  ON step_views_funnel_tt(ab_test_id, viewed_at DESC) 
  WHERE ab_test_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_step_views_funnel_vsl_ab_test_viewed 
  ON step_views_funnel_vsl(ab_test_id, viewed_at DESC) 
  WHERE ab_test_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_step_views_funnelesp_ab_test_viewed 
  ON step_views_funnelesp(ab_test_id, viewed_at DESC) 
  WHERE ab_test_id IS NOT NULL;