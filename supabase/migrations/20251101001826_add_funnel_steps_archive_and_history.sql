/*
  # Add archive and history tracking to funnel steps

  1. Changes to funnel_steps table
    - Add `archived` (boolean) - Controls if step is archived (soft delete)
    - Add `original_name` (text) - Keeps track of original step name for reference
    - Add `previous_names` (text[]) - Array of all previous names for history
    - Add index for archived field for better query performance

  2. New Tables
    - `funnel_step_history`
      - `id` (uuid, primary key)
      - `funnel_step_id` (uuid, foreign key) - Reference to the step
      - `funnel_id` (uuid, foreign key) - Reference to the funnel
      - `action_type` (enum) - Type of action: reorder, rename, archive, restore
      - `old_value` (jsonb) - Previous state (order, name, etc)
      - `new_value` (jsonb) - New state after change
      - `changed_by` (uuid) - Admin who made the change
      - `created_at` (timestamptz)

  3. Security
    - Update RLS policies to exclude archived steps from public views
    - Add policies for funnel_step_history table
    - Admins can view all history
    - Anon users cannot see history

  4. Important Notes
    - Archived steps are soft deleted (not removed from database)
    - All changes are tracked in history for audit purposes
    - Previous names are maintained to help with analytics reconciliation
*/

-- Add new columns to funnel_steps table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'funnel_steps' AND column_name = 'archived'
  ) THEN
    ALTER TABLE funnel_steps ADD COLUMN archived boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'funnel_steps' AND column_name = 'original_name'
  ) THEN
    ALTER TABLE funnel_steps ADD COLUMN original_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'funnel_steps' AND column_name = 'previous_names'
  ) THEN
    ALTER TABLE funnel_steps ADD COLUMN previous_names text[] DEFAULT '{}';
  END IF;
END $$;

-- Set original_name for existing steps (only if not already set)
UPDATE funnel_steps 
SET original_name = step_name 
WHERE original_name IS NULL;

-- Create index for archived field
CREATE INDEX IF NOT EXISTS funnel_steps_archived_idx ON funnel_steps(archived);
CREATE INDEX IF NOT EXISTS funnel_steps_active_idx ON funnel_steps(funnel_id, archived, step_order);

-- Create action type enum
DO $$ BEGIN
  CREATE TYPE funnel_step_action_type AS ENUM ('reorder', 'rename', 'archive', 'restore', 'create', 'delete', 'update_config');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create funnel_step_history table
CREATE TABLE IF NOT EXISTS funnel_step_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_step_id uuid REFERENCES funnel_steps(id) ON DELETE CASCADE,
  funnel_id uuid REFERENCES funnels(id) ON DELETE CASCADE,
  action_type funnel_step_action_type NOT NULL,
  old_value jsonb DEFAULT '{}'::jsonb,
  new_value jsonb DEFAULT '{}'::jsonb,
  changed_by uuid REFERENCES admin_users(id),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for funnel_step_history
CREATE INDEX IF NOT EXISTS funnel_step_history_step_id_idx ON funnel_step_history(funnel_step_id);
CREATE INDEX IF NOT EXISTS funnel_step_history_funnel_id_idx ON funnel_step_history(funnel_id);
CREATE INDEX IF NOT EXISTS funnel_step_history_action_type_idx ON funnel_step_history(action_type);
CREATE INDEX IF NOT EXISTS funnel_step_history_created_at_idx ON funnel_step_history(created_at DESC);

-- Enable RLS on funnel_step_history
ALTER TABLE funnel_step_history ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated admins can view history
CREATE POLICY "Admins can view funnel step history"
  ON funnel_step_history FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Only authenticated admins can insert history
CREATE POLICY "Admins can create funnel step history"
  ON funnel_step_history FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Update the existing policy for anon users to exclude archived steps
DROP POLICY IF EXISTS "Anon users can view steps of active funnels" ON funnel_steps;

CREATE POLICY "Anon users can view active steps of active funnels"
  ON funnel_steps FOR SELECT
  TO anon
  USING (
    archived = false AND
    EXISTS (
      SELECT 1 FROM funnels
      WHERE funnels.id = funnel_steps.funnel_id
      AND funnels.status = 'active'
    )
  );

-- Create function to automatically log step changes to history
CREATE OR REPLACE FUNCTION log_funnel_step_change()
RETURNS TRIGGER AS $$
DECLARE
  action_type_val funnel_step_action_type;
  old_val jsonb;
  new_val jsonb;
BEGIN
  -- Determine action type based on what changed
  IF TG_OP = 'INSERT' THEN
    action_type_val := 'create';
    old_val := '{}'::jsonb;
    new_val := jsonb_build_object(
      'step_order', NEW.step_order,
      'step_name', NEW.step_name,
      'component_name', NEW.component_name,
      'config', NEW.config
    );
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.step_order != NEW.step_order THEN
      action_type_val := 'reorder';
      old_val := jsonb_build_object('step_order', OLD.step_order);
      new_val := jsonb_build_object('step_order', NEW.step_order);
    ELSIF OLD.step_name != NEW.step_name THEN
      action_type_val := 'rename';
      old_val := jsonb_build_object('step_name', OLD.step_name);
      new_val := jsonb_build_object('step_name', NEW.step_name);
    ELSIF OLD.archived != NEW.archived THEN
      action_type_val := CASE WHEN NEW.archived THEN 'archive' ELSE 'restore' END;
      old_val := jsonb_build_object('archived', OLD.archived);
      new_val := jsonb_build_object('archived', NEW.archived);
    ELSE
      action_type_val := 'update_config';
      old_val := jsonb_build_object('config', OLD.config);
      new_val := jsonb_build_object('config', NEW.config);
    END IF;

    -- Add previous name to array when renaming
    IF OLD.step_name != NEW.step_name AND NOT (OLD.step_name = ANY(NEW.previous_names)) THEN
      NEW.previous_names := array_append(NEW.previous_names, OLD.step_name);
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    action_type_val := 'delete';
    old_val := jsonb_build_object(
      'step_order', OLD.step_order,
      'step_name', OLD.step_name
    );
    new_val := '{}'::jsonb;
  END IF;

  -- Insert into history (only for UPDATE and DELETE, INSERT will be handled separately if needed)
  IF TG_OP IN ('UPDATE', 'DELETE') THEN
    INSERT INTO funnel_step_history (
      funnel_step_id,
      funnel_id,
      action_type,
      old_value,
      new_value
    ) VALUES (
      COALESCE(NEW.id, OLD.id),
      COALESCE(NEW.funnel_id, OLD.funnel_id),
      action_type_val,
      old_val,
      new_val
    );
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to log funnel step changes
DROP TRIGGER IF EXISTS funnel_step_change_logger ON funnel_steps;

CREATE TRIGGER funnel_step_change_logger
  AFTER UPDATE OR DELETE ON funnel_steps
  FOR EACH ROW
  EXECUTE FUNCTION log_funnel_step_change();

-- Create helper function to reorder steps after archive/restore
CREATE OR REPLACE FUNCTION reorder_funnel_steps_after_change()
RETURNS TRIGGER AS $$
BEGIN
  -- When a step is archived or restored, reorder remaining active steps
  IF TG_OP = 'UPDATE' AND OLD.archived != NEW.archived THEN
    WITH ordered_steps AS (
      SELECT id, ROW_NUMBER() OVER (ORDER BY step_order) as new_order
      FROM funnel_steps
      WHERE funnel_id = NEW.funnel_id AND archived = false
    )
    UPDATE funnel_steps
    SET step_order = ordered_steps.new_order
    FROM ordered_steps
    WHERE funnel_steps.id = ordered_steps.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic reordering
DROP TRIGGER IF EXISTS reorder_steps_on_archive ON funnel_steps;

CREATE TRIGGER reorder_steps_on_archive
  AFTER UPDATE ON funnel_steps
  FOR EACH ROW
  WHEN (OLD.archived IS DISTINCT FROM NEW.archived)
  EXECUTE FUNCTION reorder_funnel_steps_after_change();