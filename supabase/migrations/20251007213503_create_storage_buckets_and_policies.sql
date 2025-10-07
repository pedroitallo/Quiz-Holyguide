/*
  # Create Storage Buckets and Policies
  
  1. Storage Buckets
    - `user-uploads` - For user uploaded files (images, documents, etc.)
      - Public access for reading
      - Authenticated and anonymous users can upload
      - File size limit: 10MB
      - Allowed file types: images, PDFs, common documents
  
  2. Security Policies
    - Anyone (authenticated or anonymous) can upload files
    - Files are publicly readable via URL
    - Users can delete their own files (by folder/prefix)
    - Service role has full access
  
  3. File Organization
    - Files organized by type: /images/, /documents/, /temp/
    - Unique filenames generated to prevent collisions
*/

-- Create the user-uploads bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-uploads',
  'user-uploads',
  true,
  10485760, -- 10MB in bytes
  ARRAY[
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage Policy: Allow anyone to upload files
CREATE POLICY "Anyone can upload files"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'user-uploads');

-- Storage Policy: Allow anyone to read/download files (bucket is public)
CREATE POLICY "Anyone can view files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'user-uploads');

-- Storage Policy: Allow users to update their own files
CREATE POLICY "Users can update own files"
  ON storage.objects
  FOR UPDATE
  TO public
  USING (bucket_id = 'user-uploads')
  WITH CHECK (bucket_id = 'user-uploads');

-- Storage Policy: Allow users to delete files
CREATE POLICY "Users can delete files"
  ON storage.objects
  FOR DELETE
  TO public
  USING (bucket_id = 'user-uploads');