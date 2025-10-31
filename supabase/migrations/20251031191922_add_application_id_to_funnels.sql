/*
  # Add application_id to funnels table

  1. Changes
    - Add `application_id` column to `funnels` table
    - Create foreign key constraint to `applications` table
    - Update existing funnels to use first available application
  
  2. Notes
    - Column is nullable initially to allow updating existing records
    - After setting values, make it NOT NULL
*/

-- Add application_id column
ALTER TABLE funnels 
ADD COLUMN IF NOT EXISTS application_id uuid;

-- Add foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'funnels_application_id_fkey' 
    AND table_name = 'funnels'
  ) THEN
    ALTER TABLE funnels 
    ADD CONSTRAINT funnels_application_id_fkey 
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Update existing funnels with first application ID if exists
DO $$
DECLARE
  first_app_id uuid;
BEGIN
  -- Get first application ID
  SELECT id INTO first_app_id FROM applications LIMIT 1;
  
  -- Update funnels without application_id
  IF first_app_id IS NOT NULL THEN
    UPDATE funnels 
    SET application_id = first_app_id 
    WHERE application_id IS NULL;
  END IF;
END $$;
