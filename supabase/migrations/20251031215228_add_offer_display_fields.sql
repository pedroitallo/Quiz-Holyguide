/*
  # Add display fields to offers table

  1. Changes
    - Add `traffic_source` column for traffic source tracking
    - Add `language` column for offer language
    - Add `platform` column for checkout platform (Cartpanda, Samcart, etc)
    - Add `checkout_url` column for the checkout link
  
  2. Notes
    - All fields are optional initially
    - Default values set for common scenarios
*/

-- Add traffic_source column
ALTER TABLE offers 
ADD COLUMN IF NOT EXISTS traffic_source text;

-- Add language column
ALTER TABLE offers 
ADD COLUMN IF NOT EXISTS language text DEFAULT 'en-US';

-- Add platform column
ALTER TABLE offers 
ADD COLUMN IF NOT EXISTS platform text DEFAULT 'Cartpanda';

-- Add checkout_url column
ALTER TABLE offers 
ADD COLUMN IF NOT EXISTS checkout_url text;
