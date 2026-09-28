-- ============================================================
-- RUN THIS IN SUPABASE SQL EDITOR
-- Creates the neurotherapy-media storage bucket
-- with open policies (since admin has no auth requirement)
-- ============================================================

-- Step 1: Create the public bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'neurotherapy-media',
  'neurotherapy-media',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880;

-- Step 2: Drop any old conflicting policies
DROP POLICY IF EXISTS "Public read neurotherapy-media" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload neurotherapy-media" ON storage.objects;
DROP POLICY IF EXISTS "Admin update neurotherapy-media" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete neurotherapy-media" ON storage.objects;

-- Step 3: Allow ANYONE to read public files
CREATE POLICY "Public read neurotherapy-media"
ON storage.objects FOR SELECT
USING (bucket_id = 'neurotherapy-media');

-- Step 4: Allow ANYONE to upload (open admin, no auth)
CREATE POLICY "Open upload neurotherapy-media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'neurotherapy-media');

-- Step 5: Allow ANYONE to update
CREATE POLICY "Open update neurotherapy-media"
ON storage.objects FOR UPDATE
USING (bucket_id = 'neurotherapy-media');

-- Step 6: Allow ANYONE to delete
CREATE POLICY "Open delete neurotherapy-media"
ON storage.objects FOR DELETE
USING (bucket_id = 'neurotherapy-media');
