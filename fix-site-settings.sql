-- ============================================================
-- RUN THIS IN SUPABASE SQL EDITOR
-- Fixes corrupted site settings from PowerShell encoding issue
-- ============================================================

UPDATE website_settings SET
  site_name = 'Neurotherapist Naveen Sharma',
  phone = '+91 88711 93506',
  whatsapp = '+91 88711 93506',
  email = 'info@doctorsir.in',
  appointment_hours = 'Mon-Sat: 9:00 AM - 7:00 PM',
  service_area = 'Home Visit – Bhopal',
  seo_title = 'Home Visit Neurotherapy Service in Bhopal | Neurotherapist Naveen Sharma',
  seo_description = 'Home Visit Neurotherapy Service in Bhopal by Neurotherapist Naveen Sharma. Appointment-based supportive care for pain relief, mobility and overall wellness.',
  footer_text = 'Home Visit Neurotherapy Service in Bhopal by Neurotherapist Naveen Sharma'
WHERE true;

-- Also fix homepage settings defaults
UPDATE homepage_settings SET
  hero_heading = 'Neurotherapy for Better Movement and Healthier Living',
  hero_subheading = 'Gentle, non-invasive and supportive care to help you manage pain, improve mobility and enhance overall wellness.',
  hero_badge = 'NATURAL • SAFE • SUPPORTIVE CARE',
  about_heading = 'About Neurotherapy',
  about_description = 'Neurotherapy is a natural and holistic approach that focuses on supporting the body''s natural functions, improving mobility and enhancing overall well-being. Our care is personalized, gentle and appointment-based with home visits for your convenience.'
WHERE true;

-- Fix contact settings
UPDATE contact_settings SET
  phone = '+91 88711 93506',
  whatsapp = '+91 88711 93506',
  email = 'info@doctorsir.in',
  appointment_hours = 'Monday to Saturday: 9:00 AM – 7:00 PM',
  response_time = 'We typically respond within 2-4 hours',
  service_area = 'Home visits available in Bhopal and surrounding areas',
  note = 'This is a HOME VISIT ONLY service. We do not have a public clinic address.'
WHERE true;
