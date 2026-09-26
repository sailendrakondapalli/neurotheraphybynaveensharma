-- Disable Row Level Security for all news tables
-- Run this in Supabase SQL Editor to allow unrestricted access

ALTER TABLE news DISABLE ROW LEVEL SECURITY;
ALTER TABLE reporters DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE videos DISABLE ROW LEVEL SECURITY;
ALTER TABLE breaking_news DISABLE ROW LEVEL SECURITY;
ALTER TABLE live_tv_config DISABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements DISABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_config DISABLE ROW LEVEL SECURITY;
ALTER TABLE news_site_settings DISABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public read access" ON news;
DROP POLICY IF EXISTS "Admin full access" ON news;
DROP POLICY IF EXISTS "Public read access" ON reporters;
DROP POLICY IF EXISTS "Admin full access" ON reporters;
DROP POLICY IF EXISTS "Public read access" ON categories;
DROP POLICY IF EXISTS "Admin full access" ON categories;

-- Success message
SELECT 'RLS disabled for all tables - Admin panel now has unrestricted access' as status;
