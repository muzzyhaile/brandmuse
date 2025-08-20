-- Simple Test Data Setup
-- This creates sample data for existing authenticated users

-- First, let's check what users exist
SELECT 'Current users in system:' as info;
SELECT id, email, created_at FROM auth.users ORDER BY created_at;

-- Add sample brands for any existing users (you can modify the user IDs as needed)
-- Note: Replace the user IDs below with actual user IDs from your auth.users table

-- Example: If you have users, uncomment and update these with real user IDs:

/*
-- Sample data for first user (replace USER_ID_1 with actual UUID)
INSERT INTO brands (id, owner_id, name, industry, target_audience) VALUES
('b1111111-1111-1111-1111-111111111111', 'USER_ID_1', 'TechStartup Pro', 'Technology', 
 '{"demographics": {"age_range": "25-45", "income": "high", "education": "college+"}, "interests": ["innovation", "productivity", "entrepreneurship"]}');

INSERT INTO boards (id, user_id, title, description) VALUES
('c1111111-1111-1111-1111-111111111111', 'USER_ID_1', 'Q4 Marketing Campaign', 'Planning and content for Q4 product launch');

INSERT INTO content (board_id, title, description, content_type, status) VALUES
('c1111111-1111-1111-1111-111111111111', 'Product Demo Video', 'Create engaging demo video showcasing key features', 'video', 'draft'),
('c1111111-1111-1111-1111-111111111111', 'Launch Email Campaign', 'Email sequence for product launch announcement', 'email', 'published'),
('c1111111-1111-1111-1111-111111111111', 'Social Media Teasers', 'Short form content for Instagram and TikTok', 'social', 'draft');
*/

-- Instructions:
-- 1. First, create test accounts through your app's signup process
-- 2. Check the user IDs using the query above
-- 3. Uncomment the INSERT statements and replace USER_ID_1 with the actual user ID
-- 4. Run the modified migration
