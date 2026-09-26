-- Add image_url column to categories table
ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update existing categories with placeholder text (admins can upload images later)
UPDATE categories SET image_url = NULL WHERE image_url IS NULL;

-- Success message
SELECT 'Category image_url column added successfully' as status;
