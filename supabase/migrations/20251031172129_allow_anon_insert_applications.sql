/*
  # Allow anonymous users to manage applications

  1. Changes
    - Add policies for anonymous users to insert, update, and delete applications
    - This is necessary because the admin authentication system uses localStorage
      instead of Supabase JWT tokens

  2. Security Note
    - In production, you should implement proper Supabase Auth integration
    - For now, we're allowing anon access for the admin panel to work
*/

-- Allow anonymous users to insert applications
CREATE POLICY "Anonymous users can insert applications"
  ON applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to update applications
CREATE POLICY "Anonymous users can update applications"
  ON applications
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to delete applications
CREATE POLICY "Anonymous users can delete applications"
  ON applications
  FOR DELETE
  TO anon
  USING (true);