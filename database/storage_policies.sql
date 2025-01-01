-- Enable storage
CREATE EXTENSION IF NOT EXISTS "storage";

-- Create avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name)
VALUES ('avatars', 'avatars')
ON CONFLICT DO NOTHING;

-- Policy to allow authenticated users to upload avatars
CREATE POLICY "authenticated users can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  -- Only allow image files
  AND (storage.extension(name) = 'jpg' 
    OR storage.extension(name) = 'jpeg'
    OR storage.extension(name) = 'png'
    OR storage.extension(name) = 'gif')
  -- Must be in user-images folder
  AND LOWER((storage.foldername(name))[1]) = 'user-images'
);

-- Policy to allow users to update their own avatars
CREATE POLICY "users can update their own avatars"
ON storage.objects FOR UPDATE
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  -- Only allow image files
  AND (storage.extension(name) = 'jpg' 
    OR storage.extension(name) = 'jpeg'
    OR storage.extension(name) = 'png'
    OR storage.extension(name) = 'gif')
  -- Must be in user-images folder
  AND LOWER((storage.foldername(name))[1]) = 'user-images'
);

-- Policy to allow anyone to view avatars
CREATE POLICY "anyone can view avatars"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'avatars'
  -- Only allow image files
  AND (storage.extension(name) = 'jpg' 
    OR storage.extension(name) = 'jpeg'
    OR storage.extension(name) = 'png'
    OR storage.extension(name) = 'gif')
  -- Must be in user-images folder
  AND LOWER((storage.foldername(name))[1]) = 'user-images'
);

-- Policy to allow users to delete their own avatars
CREATE POLICY "users can delete their own avatars"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  -- Must be in user-images folder
  AND LOWER((storage.foldername(name))[1]) = 'user-images'
);
