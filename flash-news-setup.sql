-- ============================================================
-- RUN THIS IN SUPABASE SQL EDITOR
-- Creates the flash_news table for popup announcements
-- ============================================================

CREATE TABLE IF NOT EXISTS flash_news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_hi TEXT,
  message TEXT,
  message_hi TEXT,
  image TEXT,
  link_url TEXT,
  link_text TEXT DEFAULT 'Learn More',
  link_text_hi TEXT DEFAULT 'अधिक जानें',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE flash_news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active flash_news"
ON flash_news FOR SELECT
USING (is_active = true);

CREATE POLICY "Open full access flash_news"
ON flash_news FOR ALL USING (true) WITH CHECK (true);
