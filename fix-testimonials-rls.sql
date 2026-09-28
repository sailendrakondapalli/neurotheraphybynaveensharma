-- Fix testimonials public read policy to show approved + published
DROP POLICY IF EXISTS "Public read published testimonials" ON testimonials;

CREATE POLICY "Public read approved testimonials"
ON testimonials FOR SELECT
USING (status IN ('published', 'approved'));
