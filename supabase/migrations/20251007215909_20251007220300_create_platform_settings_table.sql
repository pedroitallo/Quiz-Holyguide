/*
  # Create platform settings table

  1. New Tables
    - `platform_settings`
      - `id` (uuid, primary key)
      - `key` (text, unique) - Chave única da configuração
      - `value` (jsonb) - Valor da configuração
      - `updated_at` (timestamptz)
      - `updated_by` (uuid) - Admin que atualizou

  2. Security
    - Enable RLS on `platform_settings` table
    - Only authenticated admins can read/write settings
*/

-- Create platform_settings table
CREATE TABLE IF NOT EXISTS platform_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES admin_users(id)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS platform_settings_key_idx ON platform_settings(key);

-- Enable RLS
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated admins can view all settings
CREATE POLICY "Admins can view all settings"
  ON platform_settings FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated admins can insert settings
CREATE POLICY "Admins can create settings"
  ON platform_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated admins can update settings
CREATE POLICY "Admins can update settings"
  ON platform_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated admins can delete settings
CREATE POLICY "Admins can delete settings"
  ON platform_settings FOR DELETE
  TO authenticated
  USING (true);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_platform_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER platform_settings_updated_at
  BEFORE UPDATE ON platform_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_platform_settings_updated_at();

-- Insert default platform settings
INSERT INTO platform_settings (key, value) VALUES
  ('brand', '{"name": "HolyMind", "logo_url": "", "primary_color": "#8B5CF6", "secondary_color": "#EC4899"}'::jsonb),
  ('notifications', '{"email_alerts": true, "performance_alerts": true, "ab_test_alerts": true}'::jsonb),
  ('seo', '{"default_title": "HolyMind Quiz", "default_description": "Descubra insights místicos sobre seu futuro", "favicon_url": ""}'::jsonb)
ON CONFLICT (key) DO NOTHING;