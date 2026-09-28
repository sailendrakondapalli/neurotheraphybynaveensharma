-- ============================================================
-- NEUROTHERAPY WEBSITE DATABASE SETUP
-- Run this in Supabase SQL Editor
-- ============================================================

-- WEBSITE SETTINGS
CREATE TABLE IF NOT EXISTS website_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT DEFAULT 'Dr. Sir Neurotherapy',
  logo_url TEXT,
  favicon_url TEXT,
  phone TEXT DEFAULT '+91 XXXXX XXXXX',
  whatsapp TEXT DEFAULT '+91 XXXXX XXXXX',
  email TEXT DEFAULT 'info@doctorsir.in',
  appointment_hours TEXT DEFAULT 'Mon-Sat: 9:00 AM - 7:00 PM',
  service_area TEXT DEFAULT 'Home Visit Available',
  facebook_url TEXT,
  instagram_url TEXT,
  youtube_url TEXT,
  footer_text TEXT DEFAULT '© 2025 Dr. Sir Neurotherapy. All rights reserved.',
  seo_title TEXT DEFAULT 'Dr. Sir Neurotherapy – Home Visit Wellness',
  seo_description TEXT DEFAULT 'Professional neurotherapy home visit wellness service.',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- HOMEPAGE SETTINGS
CREATE TABLE IF NOT EXISTS homepage_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hero_badge TEXT DEFAULT 'NATURAL • SAFE • SUPPORTIVE CARE',
  hero_heading TEXT DEFAULT 'Neurotherapy for Better Movement and Healthier Living',
  hero_subheading TEXT DEFAULT 'Gentle, supportive care designed to support mobility, comfort and overall wellness.',
  hero_image TEXT,
  hero_btn1_text TEXT DEFAULT 'Book Appointment',
  hero_btn1_url TEXT DEFAULT '/appointment',
  hero_btn2_text TEXT DEFAULT 'Send Enquiry',
  hero_btn2_url TEXT DEFAULT '/contact',
  about_heading TEXT DEFAULT 'What is Neurotherapy?',
  about_description TEXT DEFAULT 'Neurotherapy is a supportive wellness approach focused on helping individuals maintain comfort, mobility and overall well-being through gentle, personalized home-based care.',
  about_image TEXT,
  about_btn_text TEXT DEFAULT 'Learn More',
  about_btn_url TEXT DEFAULT '/about',
  cta_heading TEXT DEFAULT 'Ready to Start Your Wellness Journey?',
  cta_description TEXT DEFAULT 'Book your home visit appointment today. We come to you.',
  cta_btn_text TEXT DEFAULT 'Book Appointment',
  cta_btn_url TEXT DEFAULT '/appointment',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ABOUT SETTINGS
CREATE TABLE IF NOT EXISTS about_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  heading TEXT DEFAULT 'About Our Neurotherapy Approach',
  description TEXT DEFAULT 'We provide professional neurotherapy wellness support through home visits. Our approach focuses on supporting mobility, comfort and overall well-being in the familiar and comfortable environment of your own home.',
  mission TEXT DEFAULT 'Our mission is to bring professional wellness support directly to your home, making quality neurotherapy care accessible and convenient.',
  vision TEXT DEFAULT 'We envision a future where quality wellness care is accessible to everyone in the comfort of their own home.',
  image TEXT,
  founded_year TEXT DEFAULT '2020',
  experience_text TEXT DEFAULT 'Years of Experience',
  patients_text TEXT DEFAULT 'Patients Supported',
  services_text TEXT DEFAULT 'Services Available',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- NEUROTHERAPY PAGE SETTINGS
CREATE TABLE IF NOT EXISTS neurotherapy_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  intro_heading TEXT DEFAULT 'Understanding Neurotherapy',
  intro_text TEXT DEFAULT 'Neurotherapy is a supportive wellness approach that works with the nervous system to support overall comfort and mobility.',
  what_heading TEXT DEFAULT 'What is Neurotherapy?',
  what_text TEXT DEFAULT 'Neurotherapy focuses on supporting the nervous system through gentle, non-invasive techniques. It is designed to complement your overall wellness journey.',
  approach_heading TEXT DEFAULT 'Our Approach',
  approach_text TEXT DEFAULT 'Our approach is individualized, gentle and focused on your comfort. Each session is tailored to your specific wellness needs.',
  home_visit_heading TEXT DEFAULT 'Home Visit Model',
  home_visit_text TEXT DEFAULT 'We believe in bringing care to you. All our neurotherapy sessions are conducted in the comfort of your own home, saving you travel time and effort.',
  process_heading TEXT DEFAULT 'Appointment Process',
  process_steps JSONB DEFAULT '[{"step": "Contact Us", "desc": "Call or WhatsApp to inquire"}, {"step": "Consultation", "desc": "Brief phone consultation"}, {"step": "Home Visit", "desc": "We come to your home"}, {"step": "Follow-Up", "desc": "Ongoing support as needed"}]',
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONTACT SETTINGS
CREATE TABLE IF NOT EXISTS contact_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT DEFAULT '+91 XXXXX XXXXX',
  whatsapp TEXT DEFAULT '+91 XXXXX XXXXX',
  email TEXT DEFAULT 'info@doctorsir.in',
  appointment_hours TEXT DEFAULT 'Monday to Saturday: 9:00 AM – 7:00 PM',
  response_time TEXT DEFAULT 'We typically respond within 2-4 hours',
  service_area TEXT DEFAULT 'Home visits available in your area',
  note TEXT DEFAULT 'This is a HOME VISIT ONLY service. We do not have a public clinic address.',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SERVICE CATEGORIES
CREATE TABLE IF NOT EXISTS service_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SERVICES
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_hi TEXT,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  short_description_hi TEXT,
  description TEXT,
  description_hi TEXT,
  image TEXT,
  category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 999,
  benefits JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BENEFITS
CREATE TABLE IF NOT EXISTS benefits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_hi TEXT,
  description TEXT,
  description_hi TEXT,
  icon TEXT,
  image TEXT,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  display_order INTEGER DEFAULT 999,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  testimonial TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  image TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'published')),
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 999,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- GALLERY
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  description TEXT,
  image TEXT NOT NULL,
  category TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  display_order INTEGER DEFAULT 999,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- VIDEOS
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  video_url TEXT NOT NULL,
  category TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  display_order INTEGER DEFAULT 999,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQS
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  question_hi TEXT,
  answer TEXT NOT NULL,
  answer_hi TEXT,
  category TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  display_order INTEGER DEFAULT 999,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- APPOINTMENTS
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  service_name TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'scheduled', 'completed', 'cancelled')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ROW LEVEL SECURITY ────────────────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE neurotherapy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ policies (published content only)
CREATE POLICY "Public read website_settings" ON website_settings FOR SELECT USING (true);
CREATE POLICY "Public read homepage_settings" ON homepage_settings FOR SELECT USING (true);
CREATE POLICY "Public read about_settings" ON about_settings FOR SELECT USING (true);
CREATE POLICY "Public read neurotherapy_settings" ON neurotherapy_settings FOR SELECT USING (true);
CREATE POLICY "Public read contact_settings" ON contact_settings FOR SELECT USING (true);
CREATE POLICY "Public read service_categories" ON service_categories FOR SELECT USING (true);
CREATE POLICY "Public read published services" ON services FOR SELECT USING (status = 'published');
CREATE POLICY "Public read published benefits" ON benefits FOR SELECT USING (status = 'published');
CREATE POLICY "Public read published testimonials" ON testimonials FOR SELECT USING (status = 'published');
CREATE POLICY "Public read published gallery" ON gallery FOR SELECT USING (status = 'published');
CREATE POLICY "Public read published videos" ON videos FOR SELECT USING (status = 'published');
CREATE POLICY "Public read published faqs" ON faqs FOR SELECT USING (status = 'published');

-- PUBLIC INSERT (submissions only)
CREATE POLICY "Public submit appointments" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public submit testimonials" ON testimonials FOR INSERT WITH CHECK (status = 'pending');

-- ADMIN FULL ACCESS (authenticated users)
CREATE POLICY "Admin full access website_settings" ON website_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access homepage_settings" ON homepage_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access about_settings" ON about_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access neurotherapy_settings" ON neurotherapy_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access contact_settings" ON contact_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access service_categories" ON service_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access services" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access benefits" ON benefits FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access gallery" ON gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access videos" ON videos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access faqs" ON faqs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access appointments" ON appointments FOR ALL USING (auth.role() = 'authenticated');

-- ─── SEED DEFAULT DATA ─────────────────────────────────────────────────────────

INSERT INTO website_settings (site_name, phone, whatsapp, email) VALUES
('Neurotherapist Naveen Sharma', '+91 88711 93506', '+91 88711 93506', 'info@doctorsir.in')
ON CONFLICT DO NOTHING;

INSERT INTO homepage_settings DEFAULT VALUES ON CONFLICT DO NOTHING;
INSERT INTO about_settings DEFAULT VALUES ON CONFLICT DO NOTHING;
INSERT INTO contact_settings DEFAULT VALUES ON CONFLICT DO NOTHING;
INSERT INTO neurotherapy_settings DEFAULT VALUES ON CONFLICT DO NOTHING;

-- Seed service categories
INSERT INTO service_categories (name, slug) VALUES
('Pain & Nerve Care', 'pain-nerve-care'),
('Musculoskeletal', 'musculoskeletal'),
('Neurological', 'neurological'),
('Digestive Wellness', 'digestive-wellness'),
('Women Wellness', 'women-wellness'),
('Senior Care', 'senior-care'),
('Recovery & Rehab', 'recovery-rehab')
ON CONFLICT (slug) DO NOTHING;

-- Seed services
INSERT INTO services (title, slug, short_description, description, status, is_featured, display_order) VALUES
('Pain Relief & Nerve Care', 'pain-relief-nerve-care', 'Supportive care focused on comfort and nerve wellness.', 'Our pain relief and nerve care service provides gentle, individualized support designed to help maintain comfort and daily mobility. Our approach is focused on your overall wellness.', 'published', true, 1),
('Cervical / Neck Pain', 'cervical-neck-pain', 'Gentle support for cervical discomfort and neck wellness.', 'Supportive wellness care for individuals experiencing cervical discomfort. Our gentle home-based approach is designed to support comfort and mobility in the neck and shoulder area.', 'published', true, 2),
('Back Pain / Sciatica', 'back-pain-sciatica', 'Home-based wellness support for back and sciatic discomfort.', 'Individualized home-based wellness support for those experiencing back discomfort. Our supportive care approach focuses on comfort, mobility and overall well-being.', 'published', true, 3),
('Knee & Joint Pain', 'knee-joint-pain', 'Supportive care for knee and joint comfort.', 'Gentle wellness support designed to help maintain comfort and mobility in the knees and joints. Our home visit approach brings care directly to you.', 'published', true, 4),
('Frozen Shoulder', 'frozen-shoulder', 'Gentle support for shoulder mobility and comfort.', 'Our supportive wellness approach for frozen shoulder focuses on gentle care designed to support shoulder comfort and mobility over time.', 'published', true, 5),
('Migraine / Headache', 'migraine-headache', 'Supportive wellness care for migraine and headache comfort.', 'Gentle, individualized wellness support for those experiencing migraines and headaches. Our approach focuses on comfort and overall well-being.', 'published', false, 6),
('Numbness / Nerve Weakness', 'numbness-nerve-weakness', 'Supportive care for nerve comfort and sensation wellness.', 'Individualized wellness support for those experiencing numbness or nerve-related discomfort. Our gentle approach is designed to support nerve health and overall comfort.', 'published', false, 7),
('IBS / Digestion Support', 'ibs-digestion-support', 'Gentle wellness support for digestive comfort.', 'Supportive wellness care focused on digestive comfort and well-being. Our individualized home-based approach is designed to support overall digestive wellness.', 'published', false, 8),
('Women Wellness', 'women-wellness', 'Specialized home-based wellness support for women.', 'Individualized wellness support designed for women, focusing on comfort, mobility and overall well-being in the familiar environment of your own home.', 'published', false, 9),
('Senior Citizen Home Care', 'senior-citizen-home-care', 'Personalized home visit wellness for senior citizens.', 'Compassionate, individualized wellness support designed specifically for senior citizens. Our home visit approach ensures quality care in the comfort of your own home.', 'published', true, 10),
('Post-Recovery Wellness', 'post-recovery-wellness', 'Supportive wellness care during recovery periods.', 'Gentle, supportive wellness care designed to support overall well-being during recovery periods. Our individualized home-based approach focuses on comfort and gradual wellness support.', 'published', false, 11)
ON CONFLICT (slug) DO NOTHING;

-- Seed benefits
INSERT INTO benefits (title, description, icon, status, display_order) VALUES
('Home Visit Convenience', 'We come to your home, eliminating the need to travel. Receive professional wellness support in the comfort of your own environment.', '🏠', 'published', 1),
('Appointment-Based Care', 'All sessions are by prior appointment, ensuring you receive dedicated, focused attention at a time that works for you.', '📅', 'published', 2),
('Personalized Attention', 'Every session is individualized to your specific wellness needs, ensuring a tailored approach to your comfort and well-being.', '🤝', 'published', 3),
('Comfortable Home Environment', 'Receiving care in your own home reduces stress and allows for a more relaxed, effective wellness experience.', '💚', 'published', 4),
('Supportive Wellness Care', 'Our gentle, supportive approach is designed to complement your overall wellness journey without disruption to your daily routine.', '✨', 'published', 5),
('Follow-Up Support', 'We provide ongoing follow-up support to ensure continuity of care and to address any wellness concerns as they arise.', '📞', 'published', 6)
ON CONFLICT DO NOTHING;

-- Seed FAQs
INSERT INTO faqs (question, answer, category, status, display_order) VALUES
('What is Neurotherapy?', 'Neurotherapy is a supportive wellness approach that works with the nervous system to support overall comfort, mobility and well-being. It uses gentle, non-invasive techniques designed to complement your wellness journey.', 'General', 'published', 1),
('How does the appointment process work?', 'Simply contact us by phone or WhatsApp to enquire. We will arrange a brief consultation call, and then schedule a convenient home visit appointment at a time that works for you.', 'Appointments', 'published', 2),
('Do you provide home visits?', 'Yes. This is a HOME VISIT ONLY service. We do not have a public clinic or walk-in center. All sessions are conducted in the comfort of your own home by prior appointment.', 'Services', 'published', 3),
('How can I book an appointment?', 'You can book by calling us, sending a WhatsApp message, or filling out our online appointment enquiry form. We will contact you to confirm the details.', 'Appointments', 'published', 4),
('What areas do you cover?', 'Please contact us to enquire about availability in your specific area. We serve home visit clients across our service region.', 'Services', 'published', 5),
('How do I contact you?', 'You can reach us by phone, WhatsApp, or email. All contact details are available on our Contact page. We typically respond within 2-4 hours during business hours.', 'Contact', 'published', 6),
('Is prior booking required?', 'Yes. All sessions are APPOINTMENT BASED and require prior booking. We do not accept walk-in clients as all care is provided through scheduled home visits.', 'Appointments', 'published', 7),
('What should I expect during a session?', 'During a home visit session, our practitioner will arrive at your scheduled appointment time and provide individualized wellness support in a gentle, professional manner. Sessions are tailored to your specific needs.', 'Services', 'published', 8)
ON CONFLICT DO NOTHING;
