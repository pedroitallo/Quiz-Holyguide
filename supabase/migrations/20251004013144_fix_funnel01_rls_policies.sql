/*
  # Fix RLS Policies for Funnel01 Table

  ## Summary
  Corrects Row Level Security policies for the Funnel01 table to allow authenticated users (admins) 
  to perform INSERT, UPDATE, and DELETE operations for analytics dashboard functionality.

  ## Changes Made
  
  ### Policy Updates
  - Adds INSERT policy for authenticated users to allow test data creation
  - Adds UPDATE policy for authenticated users to modify existing records
  - Adds DELETE policy for authenticated users to clear analytics data
  
  ### Security Notes
  - Maintains existing policies for anonymous users (anon role)
  - Maintains existing policies for service role
  - All authenticated users (admins) can now fully manage Funnel01 records
  - This is necessary for the analytics dashboard to function properly

  ## Important
  These policies are permissive and allow authenticated users full access to all records.
  Ensure that authentication is properly configured and only trusted admins have access.
*/

-- Add INSERT policy for authenticated users
CREATE POLICY "Authenticated users can insert into Funnel01"
  ON "Funnel01"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Add UPDATE policy for authenticated users
CREATE POLICY "Authenticated users can update Funnel01"
  ON "Funnel01"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add DELETE policy for authenticated users
CREATE POLICY "Authenticated users can delete from Funnel01"
  ON "Funnel01"
  FOR DELETE
  TO authenticated
  USING (true);
