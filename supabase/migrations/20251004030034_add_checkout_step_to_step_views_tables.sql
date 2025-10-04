/*
  # Add checkout step to all step_views tables

  1. Changes
    - Add `checkout` boolean column to step_views_funnel_1 table
    - Add `checkout` boolean column to step_views_funnel_tt table
    - Add `checkout` boolean column to step_views_funnel_vsl table
    - Add `checkout` boolean column to step_views_funnelesp table
    - Default value: null
    - This field tracks when a user views the checkout step (after paywall)
  
  2. Purpose
    - Track user engagement with the checkout page in all funnels
    - Measure conversion funnel: paywall → checkout view → purchase
    - Enable analytics on checkout page views and abandonment
    
  3. Notes
    - This step comes after the paywall step
    - Replaces the thank_you step functionality
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'step_views_funnel_1' AND column_name = 'checkout'
  ) THEN
    ALTER TABLE step_views_funnel_1 ADD COLUMN checkout boolean DEFAULT null;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'step_views_funnel_tt' AND column_name = 'checkout'
  ) THEN
    ALTER TABLE step_views_funnel_tt ADD COLUMN checkout boolean DEFAULT null;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'step_views_funnel_vsl' AND column_name = 'checkout'
  ) THEN
    ALTER TABLE step_views_funnel_vsl ADD COLUMN checkout boolean DEFAULT null;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'step_views_funnelesp' AND column_name = 'checkout'
  ) THEN
    ALTER TABLE step_views_funnelesp ADD COLUMN checkout boolean DEFAULT null;
  END IF;
END $$;