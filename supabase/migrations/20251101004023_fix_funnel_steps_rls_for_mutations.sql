/*
  # Fix RLS policies for funnel_steps mutations

  This migration adds RLS policies to allow UPDATE and DELETE operations on funnel_steps table.
  
  1. Security
    - Allow authenticated users (admins) to UPDATE funnel_steps
    - Allow authenticated users (admins) to DELETE funnel_steps
    - Keep existing SELECT policy for anonymous users (read-only for active steps)
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to update funnel steps" ON funnel_steps;
DROP POLICY IF EXISTS "Allow authenticated users to delete funnel steps" ON funnel_steps;
DROP POLICY IF EXISTS "Allow admins to update funnel steps" ON funnel_steps;
DROP POLICY IF EXISTS "Allow admins to delete funnel steps" ON funnel_steps;

-- Create UPDATE policy for authenticated users
CREATE POLICY "Allow authenticated users to update funnel steps"
  ON funnel_steps
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create DELETE policy for authenticated users
CREATE POLICY "Allow authenticated users to delete funnel steps"
  ON funnel_steps
  FOR DELETE
  TO authenticated
  USING (true);

-- Create INSERT policy for authenticated users (if doesn't exist)
DROP POLICY IF EXISTS "Allow authenticated users to insert funnel steps" ON funnel_steps;
CREATE POLICY "Allow authenticated users to insert funnel steps"
  ON funnel_steps
  FOR INSERT
  TO authenticated
  WITH CHECK (true);