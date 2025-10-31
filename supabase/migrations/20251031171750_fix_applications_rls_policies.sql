/*
  # Fix RLS policies for applications table

  1. Changes
    - Drop existing restrictive policies
    - Add permissive policies for authenticated users (admins)
    - Allow anon users to read active applications

  2. Security
    - Authenticated users (logged in admins) can perform all operations
    - Anonymous users can only read active applications
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can read all applications" ON applications;
DROP POLICY IF EXISTS "Admins can insert applications" ON applications;
DROP POLICY IF EXISTS "Admins can update applications" ON applications;
DROP POLICY IF EXISTS "Admins can delete applications" ON applications;

-- Create new permissive policies for authenticated users
CREATE POLICY "Authenticated users can read all applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert applications"
  ON applications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update applications"
  ON applications
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete applications"
  ON applications
  FOR DELETE
  TO authenticated
  USING (true);

-- Allow anonymous users to read only active applications
CREATE POLICY "Anonymous users can read active applications"
  ON applications
  FOR SELECT
  TO anon
  USING (status = 'active');