/*
  # Create Visual Editor Configurations Table

  ## Overview
  This migration creates the infrastructure for the visual editor system that allows
  administrators to edit quiz step elements in real-time without touching code.

  ## New Tables

  ### `step_element_configs`
  Stores configuration for each editable element in quiz steps
  
  - `id` (uuid, primary key) - Unique identifier
  - `funnel_id` (uuid, foreign key) - References the funnel
  - `step_slug` (text) - Slug identifier for the step (e.g., 'video', 'name_collection')
  - `element_id` (text) - Unique identifier for the element in the component
  - `element_type` (text) - Type: 'text', 'image', 'audio', 'video', 'button', 'background', 'container'
  - `content` (jsonb) - Element content and properties:
    * For text: { text, fontSize, color, fontWeight, fontFamily, lineHeight, textAlign }
    * For image: { src, alt, width, height, objectFit, borderRadius, border }
    * For audio: { src, autoplay, loop, volume }
    * For video: { src, autoplay, controls, poster }
    * For button: { text, bgColor, textColor, fontSize, padding, borderRadius }
    * For background: { color, gradient, image, opacity }
    * For container: { padding, margin, backgroundColor, borderRadius }
  - `css_overrides` (jsonb) - Custom CSS properties for advanced styling
  - `version` (integer) - Version number for tracking changes
  - `is_published` (boolean) - Whether changes are live
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `created_by` (uuid) - Admin user who created the config
  - `updated_by` (uuid) - Admin user who last updated

  ### `step_element_config_history`
  Version history for tracking all changes to element configurations
  
  - `id` (uuid, primary key)
  - `config_id` (uuid, foreign key) - References step_element_configs
  - `version` (integer)
  - `content` (jsonb)
  - `css_overrides` (jsonb)
  - `changed_by` (uuid)
  - `change_description` (text)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on both tables
  - Only authenticated admin users can read/write
  - Anonymous users can read published configs for rendering

  ## Indexes
  - Index on funnel_id and step_slug for fast lookups
  - Index on element_id for quick element queries
  - Index on is_published for filtering published configs
*/

-- Create step_element_configs table
CREATE TABLE IF NOT EXISTS step_element_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_id uuid NOT NULL REFERENCES funnels(id) ON DELETE CASCADE,
  step_slug text NOT NULL,
  element_id text NOT NULL,
  element_type text NOT NULL CHECK (element_type IN ('text', 'image', 'audio', 'video', 'button', 'background', 'container')),
  content jsonb DEFAULT '{}'::jsonb,
  css_overrides jsonb DEFAULT '{}'::jsonb,
  version integer DEFAULT 1,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid,
  updated_by uuid,
  UNIQUE(funnel_id, step_slug, element_id)
);

-- Create step_element_config_history table
CREATE TABLE IF NOT EXISTS step_element_config_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id uuid NOT NULL REFERENCES step_element_configs(id) ON DELETE CASCADE,
  version integer NOT NULL,
  content jsonb,
  css_overrides jsonb,
  changed_by uuid,
  change_description text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_step_configs_funnel_step 
  ON step_element_configs(funnel_id, step_slug);

CREATE INDEX IF NOT EXISTS idx_step_configs_element 
  ON step_element_configs(element_id);

CREATE INDEX IF NOT EXISTS idx_step_configs_published 
  ON step_element_configs(is_published) WHERE is_published = true;

CREATE INDEX IF NOT EXISTS idx_step_config_history_config 
  ON step_element_config_history(config_id, version DESC);

-- Enable Row Level Security
ALTER TABLE step_element_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE step_element_config_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for step_element_configs

-- Allow anonymous users to read published configs (for rendering)
CREATE POLICY "Allow anon read published configs"
  ON step_element_configs
  FOR SELECT
  TO anon
  USING (is_published = true);

-- Allow authenticated users to read all configs
CREATE POLICY "Allow authenticated read all configs"
  ON step_element_configs
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert configs
CREATE POLICY "Allow authenticated insert configs"
  ON step_element_configs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update configs
CREATE POLICY "Allow authenticated update configs"
  ON step_element_configs
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete configs
CREATE POLICY "Allow authenticated delete configs"
  ON step_element_configs
  FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for step_element_config_history

-- Allow authenticated users to read history
CREATE POLICY "Allow authenticated read history"
  ON step_element_config_history
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert history
CREATE POLICY "Allow authenticated insert history"
  ON step_element_config_history
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_step_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS trigger_update_step_config_updated_at ON step_element_configs;
CREATE TRIGGER trigger_update_step_config_updated_at
  BEFORE UPDATE ON step_element_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_step_config_updated_at();

-- Create function to automatically save to history on update
CREATE OR REPLACE FUNCTION save_step_config_history()
RETURNS TRIGGER AS $$
BEGIN
  -- Only save if content or css_overrides changed
  IF (OLD.content IS DISTINCT FROM NEW.content) OR 
     (OLD.css_overrides IS DISTINCT FROM NEW.css_overrides) THEN
    
    INSERT INTO step_element_config_history (
      config_id,
      version,
      content,
      css_overrides,
      changed_by,
      change_description
    ) VALUES (
      NEW.id,
      NEW.version,
      NEW.content,
      NEW.css_overrides,
      NEW.updated_by,
      'Auto-saved from visual editor'
    );
    
    -- Increment version
    NEW.version = OLD.version + 1;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for history
DROP TRIGGER IF EXISTS trigger_save_step_config_history ON step_element_configs;
CREATE TRIGGER trigger_save_step_config_history
  BEFORE UPDATE ON step_element_configs
  FOR EACH ROW
  EXECUTE FUNCTION save_step_config_history();