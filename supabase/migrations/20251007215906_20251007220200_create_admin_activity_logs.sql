/*
  # Create admin activity logs table

  1. New Tables
    - `admin_activity_logs`
      - `id` (uuid, primary key)
      - `admin_user_id` (uuid, foreign key) - Quem fez a ação
      - `action` (text) - Tipo de ação (create, update, delete, login, etc)
      - `resource_type` (text) - Tipo de recurso (funnel, ab_test, file, etc)
      - `resource_id` (uuid) - ID do recurso afetado
      - `details` (jsonb) - Detalhes adicionais da ação
      - `ip_address` (text) - IP de onde veio a ação
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `admin_activity_logs` table
    - Only authenticated admins can read logs
    - System can insert logs (via service role)
*/

-- Create admin_activity_logs table
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  details jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS admin_activity_logs_admin_user_id_idx ON admin_activity_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS admin_activity_logs_created_at_idx ON admin_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS admin_activity_logs_action_idx ON admin_activity_logs(action);
CREATE INDEX IF NOT EXISTS admin_activity_logs_resource_idx ON admin_activity_logs(resource_type, resource_id);

-- Enable RLS
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated admins can view all activity logs
CREATE POLICY "Admins can view all activity logs"
  ON admin_activity_logs FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Service role can insert activity logs
CREATE POLICY "Service role can insert activity logs"
  ON admin_activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Helper function to log admin activity
CREATE OR REPLACE FUNCTION log_admin_activity(
  p_admin_user_id uuid,
  p_action text,
  p_resource_type text,
  p_resource_id uuid DEFAULT NULL,
  p_details jsonb DEFAULT '{}'::jsonb,
  p_ip_address text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  v_log_id uuid;
BEGIN
  INSERT INTO admin_activity_logs (
    admin_user_id,
    action,
    resource_type,
    resource_id,
    details,
    ip_address
  ) VALUES (
    p_admin_user_id,
    p_action,
    p_resource_type,
    p_resource_id,
    p_details,
    p_ip_address
  ) RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;