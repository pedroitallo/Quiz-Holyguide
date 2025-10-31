/*
  # Enhance funnels table with complete fields

  1. Changes
    - Add offer_id (uuid, foreign key to offers)
    - Add language (text, funnel language like pt-BR, en-US)
    - Add traffic_source (text, traffic source like Facebook, Google)
    - Add slug (text, unique funnel slug)
    - Add url (text, complete funnel URL)
    - Add description (text, funnel description)
    - Add status (text, active/inactive/paused)
    - Ensure proper indexes for performance

  2. Security
    - No RLS changes needed, uses existing policies
*/

DO $$
BEGIN
  -- Add offer_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'funnels' AND column_name = 'offer_id'
  ) THEN
    ALTER TABLE funnels ADD COLUMN offer_id uuid REFERENCES offers(id) ON DELETE SET NULL;
  END IF;

  -- Add language
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'funnels' AND column_name = 'language'
  ) THEN
    ALTER TABLE funnels ADD COLUMN language text DEFAULT 'pt-BR';
  END IF;

  -- Add traffic_source
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'funnels' AND column_name = 'traffic_source'
  ) THEN
    ALTER TABLE funnels ADD COLUMN traffic_source text;
  END IF;

  -- Add slug
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'funnels' AND column_name = 'slug'
  ) THEN
    ALTER TABLE funnels ADD COLUMN slug text UNIQUE;
  END IF;

  -- Add url
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'funnels' AND column_name = 'url'
  ) THEN
    ALTER TABLE funnels ADD COLUMN url text;
  END IF;

  -- Add description
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'funnels' AND column_name = 'description'
  ) THEN
    ALTER TABLE funnels ADD COLUMN description text DEFAULT '';
  END IF;

  -- Add status if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'funnels' AND column_name = 'status'
  ) THEN
    ALTER TABLE funnels ADD COLUMN status text DEFAULT 'active';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_funnels_offer_id ON funnels(offer_id);
CREATE INDEX IF NOT EXISTS idx_funnels_language ON funnels(language);
CREATE INDEX IF NOT EXISTS idx_funnels_traffic_source ON funnels(traffic_source);
CREATE INDEX IF NOT EXISTS idx_funnels_slug ON funnels(slug);
CREATE INDEX IF NOT EXISTS idx_funnels_status ON funnels(status);