-- Run this in your Supabase SQL Editor if you want to immediately update the cover URLs
UPDATE books 
SET cover_url = '/covers/the-silent-code.jpg', updated_at = NOW() 
WHERE slug = 'the-silent-code';

UPDATE books 
SET cover_url = '/covers/i-know-you.jpg', updated_at = NOW() 
WHERE slug = 'i-know-you';

UPDATE books 
SET cover_url = '/covers/the-illusion-of-skill.jpg', updated_at = NOW() 
WHERE slug = 'the-illusion-of-skill';

