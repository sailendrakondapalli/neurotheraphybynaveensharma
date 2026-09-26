-- SR TV NEWS CHANNEL Database Schema
-- Run this in Supabase SQL Editor to create all tables

-- 1. Categories table (news categories)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Reporters table
CREATE TABLE IF NOT EXISTS reporters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  photo_url TEXT,
  designation TEXT DEFAULT 'Reporter',
  bio TEXT,
  location TEXT,
  email TEXT,
  phone TEXT,
  facebook_url TEXT,
  twitter_url TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. News articles table
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  reporter_id UUID REFERENCES reporters(id) ON DELETE SET NULL,
  tags TEXT[], -- Array of tags
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  is_featured BOOLEAN DEFAULT FALSE,
  is_breaking BOOLEAN DEFAULT FALSE,
  is_trending BOOLEAN DEFAULT FALSE,
  trending_order INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 4. Breaking news ticker table
CREATE TABLE IF NOT EXISTS breaking_news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  thumbnail_url TEXT,
  video_url TEXT NOT NULL, -- YouTube URL or direct video URL
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
  views_count INTEGER DEFAULT 0,
  duration TEXT, -- e.g., "5:32"
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Live TV configuration table
CREATE TABLE IF NOT EXISTS live_tv_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT DEFAULT 'SR TV NEWS LIVE',
  stream_url TEXT, -- YouTube embed URL or stream URL
  is_live BOOLEAN DEFAULT FALSE,
  thumbnail_url TEXT,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default live TV config
INSERT INTO live_tv_config (id, title, is_live) 
VALUES ('00000000-0000-0000-0000-000000000001', 'SR TV NEWS LIVE', FALSE)
ON CONFLICT (id) DO NOTHING;

-- 7. Advertisements table
CREATE TABLE IF NOT EXISTS advertisements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT,
  position TEXT DEFAULT 'sidebar' CHECK (position IN ('sidebar', 'top', 'bottom', 'hero', 'inline')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  display_order INTEGER DEFAULT 0,
  clicks_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Homepage configuration table
CREATE TABLE IF NOT EXISTS homepage_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hero_news_id UUID REFERENCES news(id) ON DELETE SET NULL,
  hero_custom_title TEXT,
  hero_custom_subtitle TEXT,
  hero_custom_image_url TEXT,
  hero_show_live_badge BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default homepage config
INSERT INTO homepage_config (id) 
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- 9. Site settings table (for global configurations)
CREATE TABLE IF NOT EXISTS news_site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name TEXT DEFAULT 'SR TV NEWS CHANNEL',
  site_tagline TEXT DEFAULT 'Inform • Inspire • Empower',
  logo_url TEXT,
  facebook_url TEXT,
  twitter_url TEXT,
  youtube_url TEXT,
  instagram_url TEXT,
  about_us_content TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  contact_address TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default site settings
INSERT INTO news_site_settings (id) 
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category_id);
CREATE INDEX IF NOT EXISTS idx_news_reporter ON news(reporter_id);
CREATE INDEX IF NOT EXISTS idx_news_featured ON news(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_news_breaking ON news(is_breaking) WHERE is_breaking = TRUE;
CREATE INDEX IF NOT EXISTS idx_news_trending ON news(is_trending, trending_order) WHERE is_trending = TRUE;
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_breaking_news_active ON breaking_news(display_order) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_featured ON videos(is_featured) WHERE is_featured = TRUE;

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE reporters ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE breaking_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_tv_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read reporters" ON reporters FOR SELECT USING (status = 'active');
CREATE POLICY "Public read published news" ON news FOR SELECT USING (status = 'published');
CREATE POLICY "Public read active breaking news" ON breaking_news FOR SELECT USING (status = 'active');
CREATE POLICY "Public read active videos" ON videos FOR SELECT USING (status = 'active');
CREATE POLICY "Public read live tv config" ON live_tv_config FOR SELECT USING (true);
CREATE POLICY "Public read active ads" ON advertisements FOR SELECT USING (status = 'active');
CREATE POLICY "Public read homepage config" ON homepage_config FOR SELECT USING (true);
CREATE POLICY "Public read site settings" ON news_site_settings FOR SELECT USING (true);

-- Admin full access (authenticated users with admin role)
-- Note: Adjust these policies based on your admin role implementation
CREATE POLICY "Admin all categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all reporters" ON reporters FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all news" ON news FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all breaking news" ON breaking_news FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all videos" ON videos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all live tv" ON live_tv_config FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all ads" ON advertisements FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all homepage config" ON homepage_config FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all site settings" ON news_site_settings FOR ALL USING (auth.role() = 'authenticated');

-- Seed default categories
INSERT INTO categories (name, slug, description, display_order, status) VALUES
  ('Andhra Pradesh', 'andhra-pradesh', 'News from Andhra Pradesh', 1, 'active'),
  ('India', 'india', 'National news from across India', 2, 'active'),
  ('Politics', 'politics', 'Political news and analysis', 3, 'active'),
  ('Business', 'business', 'Business and economy news', 4, 'active'),
  ('Sports', 'sports', 'Sports news and updates', 5, 'active'),
  ('Entertainment', 'entertainment', 'Entertainment and cinema', 6, 'active'),
  ('Technology', 'technology', 'Technology and innovation', 7, 'active'),
  ('Lifestyle', 'lifestyle', 'Lifestyle and wellness', 8, 'active')
ON CONFLICT (slug) DO NOTHING;

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reporters_updated_at BEFORE UPDATE ON reporters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_breaking_news_updated_at BEFORE UPDATE ON breaking_news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_live_tv_config_updated_at BEFORE UPDATE ON live_tv_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_advertisements_updated_at BEFORE UPDATE ON advertisements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_homepage_config_updated_at BEFORE UPDATE ON homepage_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_site_settings_updated_at BEFORE UPDATE ON news_site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(text_input TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(regexp_replace(regexp_replace(text_input, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
END;
$$ LANGUAGE plpgsql IMMUTABLE;
