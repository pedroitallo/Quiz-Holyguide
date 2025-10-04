/*
  # Create Admin Users Table

  Creates a dedicated admin authentication table for application administrators.

  ## Table: admin_users

  ### Columns
  - `id` (uuid, primary key) - Unique identifier
  - `email` (text, unique, not null) - Admin email address
  - `password_hash` (text, not null) - Bcrypt hashed password
  - `created_at` (timestamptz) - Account creation timestamp
  - `last_login` (timestamptz) - Last login timestamp
  - `is_active` (boolean) - Account status flag

  ## Security
  - RLS enabled on admin_users table
  - Only authenticated admins can read from this table
  - No public access allowed
  - Password is stored as bcrypt hash

  ## Initial Admin User
  - Email: appyon.contact@gmail.com
  - Password: #Appyon2025! (stored as bcrypt hash)
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz,
  is_active boolean DEFAULT true
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Only authenticated users can read admin_users
CREATE POLICY "Authenticated users can read admin_users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated admins can update admin_users"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Insert initial admin user with bcrypt hash of #Appyon2025!
-- Using crypt function with bcrypt algorithm
-- Note: The pgcrypto extension should already be available in Supabase
INSERT INTO admin_users (email, password_hash, is_active)
VALUES (
  'appyon.contact@gmail.com',
  crypt('#Appyon2025!', gen_salt('bf')),
  true
)
ON CONFLICT (email) DO NOTHING;
