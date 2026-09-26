-- Disable RLS on storage.objects table to allow unrestricted uploads
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Drop any existing restrictive policies
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Access" ON storage.objects;

-- Create permissive policies for the product-images bucket
CREATE POLICY "Allow public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Allow public insert access" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow public update access" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images');

CREATE POLICY "Allow public delete access" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images');

-- Also disable RLS on storage.buckets
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;

-- Success message
SELECT 'Storage RLS disabled - uploads should now work' as status;
