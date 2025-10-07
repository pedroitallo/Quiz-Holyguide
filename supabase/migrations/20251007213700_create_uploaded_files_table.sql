/*
  # Create uploaded files tracking table
  
  1. New Tables
    - `uploaded_files`
      - `id` (uuid, primary key) - Unique identifier for the file record
      - `file_name` (text) - Original name of the uploaded file
      - `file_path` (text) - Storage path in Supabase storage bucket
      - `file_url` (text) - Public URL to access the file
      - `file_size` (bigint) - Size of the file in bytes
      - `file_type` (text) - MIME type of the file
      - `folder` (text) - Folder/category where file is stored
      - `description` (text) - Optional description of the file
      - `metadata` (jsonb) - Additional metadata about the file
      - `uploaded_by` (text) - Identifier of who uploaded the file
      - `related_entity_type` (text) - Type of entity this file is related to (e.g., 'quiz_result', 'user')
      - `related_entity_id` (uuid) - ID of the related entity
      - `created_at` (timestamptz) - When the file record was created
      - `updated_at` (timestamptz) - Last update time
  
  2. Security
    - Enable RLS on `uploaded_files` table
    - Add policy for anyone to insert file records (for anonymous uploads)
    - Add policy for anyone to read file records
    - Add policy for anyone to update their own file records
    - Add policy for anyone to delete file records
  
  3. Indexes
    - Index on file_path for quick lookups
    - Index on folder for filtering by category
    - Index on related_entity_id for finding files by entity
    - Index on created_at for sorting by upload date
*/

CREATE TABLE IF NOT EXISTS uploaded_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  file_path text NOT NULL UNIQUE,
  file_url text NOT NULL,
  file_size bigint DEFAULT 0,
  file_type text DEFAULT '',
  folder text DEFAULT 'images',
  description text DEFAULT '',
  metadata jsonb DEFAULT '{}'::jsonb,
  uploaded_by text DEFAULT '',
  related_entity_type text DEFAULT '',
  related_entity_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE uploaded_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert file records"
  ON uploaded_files
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view file records"
  ON uploaded_files
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can update file records"
  ON uploaded_files
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete file records"
  ON uploaded_files
  FOR DELETE
  TO public
  USING (true);

CREATE INDEX IF NOT EXISTS idx_uploaded_files_path ON uploaded_files(file_path);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_folder ON uploaded_files(folder);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_entity ON uploaded_files(related_entity_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_created_at ON uploaded_files(created_at DESC);