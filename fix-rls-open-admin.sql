-- ============================================================
-- RUN THIS IN SUPABASE SQL EDITOR
-- Opens all table RLS policies for unauthenticated admin access
-- (since admin panel has no login requirement)
-- ============================================================

-- ── SERVICE CATEGORIES ────────────────────────────────────────
DROP POLICY IF EXISTS "Admin full access service_categories" ON service_categories;
CREATE POLICY "Open full access service_categories"
ON service_categories FOR ALL USING (true) WITH CHECK (true);

-- ── SERVICES ──────────────────────────────────────────────────
DROP POLICY IF EXISTS "Admin full access services" ON services;
CREATE POLICY "Open full access services"
ON services FOR ALL USING (true) WITH CHECK (true);

-- ── BENEFITS ──────────────────────────────────────────────────
DROP POLICY IF EXISTS "Admin full access benefits" ON benefits;
CREATE POLICY "Open full access benefits"
ON benefits FOR ALL USING (true) WITH CHECK (true);

-- ── TESTIMONIALS ──────────────────────────────────────────────
DROP POLICY IF EXISTS "Admin full access testimonials" ON testimonials;
CREATE POLICY "Open full access testimonials"
ON testimonials FOR ALL USING (true) WITH CHECK (true);

-- ── GALLERY ───────────────────────────────────────────────────
DROP POLICY IF EXISTS "Admin full access gallery" ON gallery;
CREATE POLICY "Open full access gallery"
ON gallery FOR ALL USING (true) WITH CHECK (true);

-- ── VIDEOS ────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Admin full access videos" ON videos;
CREATE POLICY "Open full access videos"
ON videos FOR ALL USING (true) WITH CHECK (true);

-- ── FAQS ──────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Admin full access faqs" ON faqs;
CREATE POLICY "Open full access faqs"
ON faqs FOR ALL USING (true) WITH CHECK (true);

-- ── APPOINTMENTS ──────────────────────────────────────────────
DROP POLICY IF EXISTS "Admin full access appointments" ON appointments;
CREATE POLICY "Open full access appointments"
ON appointments FOR ALL USING (true) WITH CHECK (true);

-- ── WEBSITE SETTINGS ──────────────────────────────────────────
DROP POLICY IF EXISTS "Admin full access website_settings" ON website_settings;
CREATE POLICY "Open full access website_settings"
ON website_settings FOR ALL USING (true) WITH CHECK (true);

-- ── HOMEPAGE SETTINGS ─────────────────────────────────────────
DROP POLICY IF EXISTS "Admin full access homepage_settings" ON homepage_settings;
CREATE POLICY "Open full access homepage_settings"
ON homepage_settings FOR ALL USING (true) WITH CHECK (true);

-- ── ABOUT SETTINGS ────────────────────────────────────────────
DROP POLICY IF EXISTS "Admin full access about_settings" ON about_settings;
CREATE POLICY "Open full access about_settings"
ON about_settings FOR ALL USING (true) WITH CHECK (true);

-- ── NEUROTHERAPY SETTINGS ─────────────────────────────────────
DROP POLICY IF EXISTS "Admin full access neurotherapy_settings" ON neurotherapy_settings;
CREATE POLICY "Open full access neurotherapy_settings"
ON neurotherapy_settings FOR ALL USING (true) WITH CHECK (true);

-- ── CONTACT SETTINGS ──────────────────────────────────────────
DROP POLICY IF EXISTS "Admin full access contact_settings" ON contact_settings;
CREATE POLICY "Open full access contact_settings"
ON contact_settings FOR ALL USING (true) WITH CHECK (true);
