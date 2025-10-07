/*
  # Enhance ab_tests table

  1. Changes
    - Add `tags` (text[]) - Tags para organização
    - Add `notes` (text) - Notas e hipóteses do teste
    - Add `sample_size_target` (int) - Tamanho de amostra alvo
    - Add `winner_variant` (text) - Variante vencedora declarada

  2. Notes
    - Usa ALTER TABLE com IF NOT EXISTS para evitar erros se colunas já existirem
*/

-- Add new columns to ab_tests if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ab_tests' AND column_name = 'tags'
  ) THEN
    ALTER TABLE ab_tests ADD COLUMN tags text[] DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ab_tests' AND column_name = 'notes'
  ) THEN
    ALTER TABLE ab_tests ADD COLUMN notes text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ab_tests' AND column_name = 'sample_size_target'
  ) THEN
    ALTER TABLE ab_tests ADD COLUMN sample_size_target int DEFAULT 1000;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ab_tests' AND column_name = 'winner_variant'
  ) THEN
    ALTER TABLE ab_tests ADD COLUMN winner_variant text;
  END IF;
END $$;

-- Create index for tags
CREATE INDEX IF NOT EXISTS ab_tests_tags_idx ON ab_tests USING gin(tags);
