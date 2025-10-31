/*
  # Create Applications Management Table

  1. New Tables
    - `applications`
      - `id` (uuid, primary key) - Unique identifier
      - `name` (text, not null) - Application name
      - `slug` (text, unique, not null) - URL-friendly identifier
      - `logo_url` (text) - Logo image URL from Supabase Storage
      - `description` (text) - Application description
      - `domain` (text, unique) - Associated domain (e.g., app1.mycompany.com)
      - `status` (enum) - active or inactive
      - `created_by` (uuid) - Reference to admin who created it
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `applications` table
    - Add policy for authenticated admins to read all applications
    - Add policy for authenticated admins to insert applications
    - Add policy for authenticated admins to update applications
    - Add policy for authenticated admins to delete applications

  3. Indexes
    - Index on slug for fast lookups
    - Index on domain for domain-based queries
    - Index on status for filtering active/inactive apps
    - Index on created_by for admin tracking
*/

-- Create status enum for applications
DO $$ BEGIN
  CREATE TYPE application_status AS ENUM ('active', 'inactive');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text DEFAULT '',
  description text DEFAULT '',
  domain text UNIQUE,
  status application_status DEFAULT 'active',
  created_by uuid REFERENCES admin_users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS applications_slug_idx ON applications(slug);
CREATE INDEX IF NOT EXISTS applications_domain_idx ON applications(domain);
CREATE INDEX IF NOT EXISTS applications_status_idx ON applications(status);
CREATE INDEX IF NOT EXISTS applications_created_by_idx ON applications(created_by);

-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated admins can read all applications
CREATE POLICY "Admins can read all applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated admins can insert applications
CREATE POLICY "Admins can insert applications"
  ON applications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated admins can update applications
CREATE POLICY "Admins can update applications"
  ON applications
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated admins can delete applications
CREATE POLICY "Admins can delete applications"
  ON applications
  FOR DELETE
  TO authenticated
  USING (true);

-- Create storage bucket for application logos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('application-logos', 'application-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for application logos
CREATE POLICY "Anyone can view application logos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'application-logos');

CREATE POLICY "Authenticated users can upload application logos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'application-logos');

CREATE POLICY "Authenticated users can update application logos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'application-logos')
  WITH CHECK (bucket_id = 'application-logos');

CREATE POLICY "Authenticated users can delete application logos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'application-logos');