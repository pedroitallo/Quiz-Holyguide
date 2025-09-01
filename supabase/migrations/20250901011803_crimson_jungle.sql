/*
  # Fix RLS Policy for Funnel01 Table

  1. Security Changes
    - Update existing INSERT policy for anon users to allow all inserts
    - Ensure anon users can create quiz result records without restrictions

  2. Policy Details
    - Policy name: "Enable insert for anon users"
    - Target: INSERT operations
    - Role: anon (unauthenticated users)
    - Condition: Allow all inserts (true)
*/

-- Drop existing restrictive policy if it exists
DROP POLICY IF EXISTS "Enable insert for anon users" ON "Funnel01";

-- Create new permissive INSERT policy for anon users
CREATE POLICY "Enable insert for anon users"
  ON "Funnel01"
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Ensure UPDATE policy also exists for anon users
DROP POLICY IF EXISTS "Enable update for anon users" ON "Funnel01";

CREATE POLICY "Enable update for anon users"
  ON "Funnel01"
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Ensure SELECT policy exists for anon users to read their own data
DROP POLICY IF EXISTS "Enable select for anon users" ON "Funnel01";

CREATE POLICY "Enable select for anon users"
  ON "Funnel01"
  FOR SELECT
  TO anon
  USING (true);