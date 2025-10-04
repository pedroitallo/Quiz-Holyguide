/*
  # Admin and Analytics Tables

  ## Overview
  Creates tables for admin authentication and analytics event tracking to support 
  the analytics dashboard with step-by-step conversion metrics.

  ## New Tables
  
  ### `admins`
  - `id` (uuid, primary key) - Unique admin identifier
  - `email` (text, unique) - Admin email for login
  - `password_hash` (text) - Hashed password
  - `name` (text) - Admin name
  - `created_at` (timestamptz) - Account creation timestamp
  - `last_login` (timestamptz) - Last login timestamp
  
  ### `analytics_events`
  - `id` (uuid, primary key) - Unique event identifier
  - `user_id` (text) - Anonymous user identifier (from cookies/localStorage)
  - `funnel_type` (text) - Funnel identifier (funnel-1, funnel-tt, funnel-vsl, etc)
  - `step_name` (text) - Step/page name
  - `event_type` (text) - Event type (view, conversion, etc)
  - `created_at` (timestamptz) - Event timestamp
  - `metadata` (jsonb) - Additional event data
  
  ## Security
  - Enable RLS on both tables
  - Admins table: Only authenticated admins can read their own data
  - Analytics events: Only authenticated admins can read all events
  - Public insert policy for analytics events (for tracking)

  ## Indexes
  - Index on analytics_events for efficient querying by funnel and date
*/

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Create analytics_events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  funnel_type text NOT NULL,
  step_name text NOT NULL,
  event_type text DEFAULT 'view',
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Admins policies
CREATE POLICY "Admins can read own data"
  ON admins
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can update own data"
  ON admins
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Analytics events policies
CREATE POLICY "Anyone can insert analytics events"
  ON analytics_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can read all events"
  ON analytics_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_funnel_date 
  ON analytics_events(funnel_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_user_step 
  ON analytics_events(user_id, step_name, created_at DESC);

-- Insert a default admin (password: admin123 - should be changed in production)
-- Password hash for 'admin123' using bcrypt
INSERT INTO admins (email, password_hash, name)
VALUES (
  'admin@example.com',
  '$2a$10$rGHvFHzYgHXfmE3.yYVxzOKhHKpECJqLqp6LJyJKqyXYPZVHXJWLO',
  'Admin User'
)
ON CONFLICT (email) DO NOTHING;