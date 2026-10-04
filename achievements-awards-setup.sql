-- Achievements and Awards Table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_hi TEXT,
  description TEXT,
  description_hi TEXT,
  image TEXT,
  date DATE,
  category TEXT CHECK (category IN ('achievement', 'award', 'certification', 'recognition')),
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies (open access for admin panel without auth)
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Public read access for published achievements
CREATE POLICY "Public read published achievements"
  ON achievements FOR SELECT
  USING (is_published = true);

-- Full access for all operations (since admin has no auth)
CREATE POLICY "Open access for achievements"
  ON achievements FOR ALL
  USING (true)
  WITH CHECK (true);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_achievements_published ON achievements(is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_achievements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER achievements_updated_at
  BEFORE UPDATE ON achievements
  FOR EACH ROW
  EXECUTE FUNCTION update_achievements_updated_at();
