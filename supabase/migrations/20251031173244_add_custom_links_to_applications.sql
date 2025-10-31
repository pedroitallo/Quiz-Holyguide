/*
  # Add custom links support to applications table

  1. Changes
    - Add landing_page_url column to store landing page URL
    - Add webapp_url column to store web app URL
    - Add email column to store contact email
    - Add instagram_url column to store Instagram profile URL
    - Add custom_links JSONB column to store additional custom links
    - Each custom link will have: { label: string, url: string, icon?: string }

  2. Security
    - No RLS changes needed, uses existing policies
*/

-- Add new columns to applications table
DO $$
BEGIN
  -- Landing Page URL
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'applications' AND column_name = 'landing_page_url'
  ) THEN
    ALTER TABLE applications ADD COLUMN landing_page_url TEXT;
  END IF;

  -- WebApp URL
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'applications' AND column_name = 'webapp_url'
  ) THEN
    ALTER TABLE applications ADD COLUMN webapp_url TEXT;
  END IF;

  -- Email
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'applications' AND column_name = 'email'
  ) THEN
    ALTER TABLE applications ADD COLUMN email TEXT;
  END IF;

  -- Instagram URL
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'applications' AND column_name = 'instagram_url'
  ) THEN
    ALTER TABLE applications ADD COLUMN instagram_url TEXT;
  END IF;

  -- Custom Links (JSONB array)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'applications' AND column_name = 'custom_links'
  ) THEN
    ALTER TABLE applications ADD COLUMN custom_links JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;