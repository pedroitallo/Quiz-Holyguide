/*
  # Cleanup Step Views Tables

  Removes unnecessary tables and columns from the step tracking system.

  ## Changes
  1. Drop the old quiz_step_views table
  2. Remove UTM columns from all step_views tables
     - step_views_funnel_1
     - step_views_funnel_tt
     - step_views_funnel_vsl
     - step_views_funnelesp

  ## Rationale
  - Simplifies the tracking system by removing redundant data
  - Each funnel has its own dedicated table
  - Session tracking is sufficient without UTM parameters in these tables
*/

-- Drop the old quiz_step_views table
DROP TABLE IF EXISTS quiz_step_views CASCADE;

-- Remove UTM columns from step_views_funnel_1
ALTER TABLE step_views_funnel_1 
  DROP COLUMN IF EXISTS utm_source,
  DROP COLUMN IF EXISTS utm_medium,
  DROP COLUMN IF EXISTS utm_campaign;

-- Remove UTM columns from step_views_funnel_tt
ALTER TABLE step_views_funnel_tt 
  DROP COLUMN IF EXISTS utm_source,
  DROP COLUMN IF EXISTS utm_medium,
  DROP COLUMN IF EXISTS utm_campaign;

-- Remove UTM columns from step_views_funnel_vsl
ALTER TABLE step_views_funnel_vsl 
  DROP COLUMN IF EXISTS utm_source,
  DROP COLUMN IF EXISTS utm_medium,
  DROP COLUMN IF EXISTS utm_campaign;

-- Remove UTM columns from step_views_funnelesp
ALTER TABLE step_views_funnelesp 
  DROP COLUMN IF EXISTS utm_source,
  DROP COLUMN IF EXISTS utm_medium,
  DROP COLUMN IF EXISTS utm_campaign;
