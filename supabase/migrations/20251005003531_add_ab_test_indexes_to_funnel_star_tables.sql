/*
  # Add A/B Test Indexes to Funnel Star Tables

  ## Description
  Adds performance indexes for ab_test_id columns on funnel star tables
  (step_views_funnel_star2, step_views_funnel_star3, step_views_funnel_star4,
  step_views_funnel_star5). These indexes match the pattern used in the original
  migration 20251004204349 for funnel-1, funnel-tt, funnel-vsl, and funnelesp.

  ## Changes

  ### Performance Indexes
  - Create partial indexes on ab_test_id columns (WHERE ab_test_id IS NOT NULL)
  - Create composite indexes for common query patterns (ab_test_id + viewed_at DESC)
  - Indexes only on non-null values to minimize storage overhead
  - Optimizes queries filtering by ab_test_id for A/B test analytics

  ## Tables Affected
  - step_views_funnel_star2
  - step_views_funnel_star3
  - step_views_funnel_star4
  - step_views_funnel_star5

  ## Notes
  - The ab_test_id column already exists in these tables (created in migration 20251004232700)
  - This migration only adds the missing indexes for query performance
  - Follows the exact same index pattern as the original 4 funnels
  - All indexes use IF NOT EXISTS for idempotency
*/

-- Create partial indexes for efficient filtering by ab_test_id
-- Only index non-null values to minimize storage and maintain performance

-- Funnel Star 2
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_star2_ab_test_id
  ON step_views_funnel_star2(ab_test_id)
  WHERE ab_test_id IS NOT NULL;

-- Funnel Star 3
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_star3_ab_test_id
  ON step_views_funnel_star3(ab_test_id)
  WHERE ab_test_id IS NOT NULL;

-- Funnel Star 4
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_star4_ab_test_id
  ON step_views_funnel_star4(ab_test_id)
  WHERE ab_test_id IS NOT NULL;

-- Funnel Star 5
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_star5_ab_test_id
  ON step_views_funnel_star5(ab_test_id)
  WHERE ab_test_id IS NOT NULL;

-- Add composite indexes for common query patterns (ab_test_id + date)
-- These optimize queries that filter by test and sort by date

-- Funnel Star 2
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_star2_ab_test_viewed
  ON step_views_funnel_star2(ab_test_id, viewed_at DESC)
  WHERE ab_test_id IS NOT NULL;

-- Funnel Star 3
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_star3_ab_test_viewed
  ON step_views_funnel_star3(ab_test_id, viewed_at DESC)
  WHERE ab_test_id IS NOT NULL;

-- Funnel Star 4
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_star4_ab_test_viewed
  ON step_views_funnel_star4(ab_test_id, viewed_at DESC)
  WHERE ab_test_id IS NOT NULL;

-- Funnel Star 5
CREATE INDEX IF NOT EXISTS idx_step_views_funnel_star5_ab_test_viewed
  ON step_views_funnel_star5(ab_test_id, viewed_at DESC)
  WHERE ab_test_id IS NOT NULL;
