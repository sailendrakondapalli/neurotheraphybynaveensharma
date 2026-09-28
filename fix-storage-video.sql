-- ============================================================
-- RUN THIS IN SUPABASE SQL EDITOR
-- Updates the neurotherapy-media bucket to allow video files
-- ============================================================

UPDATE storage.buckets
SET
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/gif',
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/webm',
    'video/x-msvideo',
    'video/x-matroska',
    'video/3gpp'
  ],
  file_size_limit = 209715200  -- 200MB
WHERE id = 'neurotherapy-media';
