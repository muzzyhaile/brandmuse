-- Test Data Setup Script for Contentmix Database
-- This script creates test users and sample data for development and testing

-- Step 1: Create test users in auth.users (this simulates user signup)
-- Note: In production, users are created through Supabase Auth, but for testing we can insert directly

-- Test User 1: John Doe
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  last_sign_in_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'john.doe@test.com',
  '$2a$10$rZ3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z', -- password: 'password123'
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  '',
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "John Doe", "avatar_url": "https://avatars.githubusercontent.com/u/1?v=4"}',
  false,
  NOW(),
  null,
  null,
  '',
  '',
  '',
  0,
  null,
  '',
  null
);

-- Test User 2: Jane Smith
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  last_sign_in_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'jane.smith@test.com',
  '$2a$10$rZ3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z', -- password: 'password123'
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  '',
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Jane Smith", "avatar_url": "https://avatars.githubusercontent.com/u/2?v=4"}',
  false,
  NOW(),
  null,
  null,
  '',
  '',
  '',
  0,
  null,
  '',
  null
);

-- Step 2: The trigger will automatically create user profiles in public.users table

-- Step 3: Create sample brands for each user
INSERT INTO brands (id, owner_id, name, industry, target_audience) VALUES
('b1111111-1111-1111-1111-111111111111', '550e8400-e29b-41d4-a716-446655440000', 'TechStartup Pro', 'Technology', '{"demographics": {"age_range": "25-45", "income": "high", "education": "college+"}, "interests": ["innovation", "productivity", "entrepreneurship"]}'),
('b2222222-2222-2222-2222-222222222222', '550e8400-e29b-41d4-a716-446655440001', 'EcoFriendly Goods', 'Sustainability', '{"demographics": {"age_range": "30-55", "income": "medium-high", "education": "college+"}, "interests": ["environment", "sustainability", "healthy living"]}');

-- Step 4: Create sample boards for each user
INSERT INTO boards (id, user_id, title, description) VALUES
('c1111111-1111-1111-1111-111111111111', '550e8400-e29b-41d4-a716-446655440000', 'Q4 Marketing Campaign', 'Planning and content for Q4 product launch'),
('c2222222-2222-2222-2222-222222222222', '550e8400-e29b-41d4-a716-446655440000', 'Social Media Strategy', 'Daily social media content planning'),
('c3333333-3333-3333-3333-333333333333', '550e8400-e29b-41d4-a716-446655440001', 'Sustainability Campaign', 'Environmental awareness content series'),
('c4444444-4444-4444-4444-444444444444', '550e8400-e29b-41d4-a716-446655440001', 'Product Launch 2025', 'New eco-friendly product line launch');

-- Step 5: Create sample content for each board
INSERT INTO content (board_id, title, description, content_type, status) VALUES
-- John's content
('c1111111-1111-1111-1111-111111111111', 'Product Demo Video', 'Create engaging demo video showcasing key features', 'video', 'draft'),
('c1111111-1111-1111-1111-111111111111', 'Launch Email Campaign', 'Email sequence for product launch announcement', 'email', 'published'),
('c1111111-1111-1111-1111-111111111111', 'Social Media Teasers', 'Short form content for Instagram and TikTok', 'social', 'draft'),
('c2222222-2222-2222-2222-222222222222', 'Monday Motivation Post', 'Inspirational content for Monday audience engagement', 'social', 'published'),
('c2222222-2222-2222-2222-222222222222', 'Tech Tips Tuesday', 'Weekly productivity tips for entrepreneurs', 'blog', 'draft'),

-- Jane's content
('c3333333-3333-3333-3333-333333333333', 'Earth Day Campaign', 'Comprehensive environmental awareness campaign', 'campaign', 'draft'),
('c3333333-3333-3333-3333-333333333333', 'Eco Tips Blog Series', 'Weekly blog posts about sustainable living', 'blog', 'published'),
('c3333333-3333-3333-3333-333333333333', 'Recycling Infographic', 'Visual guide to proper recycling practices', 'infographic', 'draft'),
('c4444444-4444-4444-4444-444444444444', 'New Product Announcement', 'Press release for eco-friendly product line', 'press', 'draft'),
('c4444444-4444-4444-4444-444444444444', 'Influencer Collaboration', 'Partnership content with eco-influencers', 'collaboration', 'published');

-- Step 6: Create sample marketing strategies
INSERT INTO strategies (id, owner_id, brand_id, brand_voice, content_pillars, platform_strategy) VALUES
('s1111111-1111-1111-1111-111111111111', '550e8400-e29b-41d4-a716-446655440000', 'b1111111-1111-1111-1111-111111111111', 
 '{"tone": "professional", "personality": "innovative", "values": ["innovation", "reliability", "growth"]}',
 '{"pillars": ["Product Education", "Industry Insights", "Customer Success", "Innovation"]}',
 '{"linkedin": {"frequency": "daily", "content_types": ["articles", "posts"]}, "twitter": {"frequency": "3x daily", "content_types": ["threads", "quick tips"]}}'),

('s2222222-2222-2222-2222-222222222222', '550e8400-e29b-41d4-a716-446655440001', 'b2222222-2222-2222-2222-222222222222',
 '{"tone": "friendly", "personality": "caring", "values": ["sustainability", "authenticity", "community"]}',
 '{"pillars": ["Environmental Education", "Product Benefits", "Community Stories", "Sustainable Tips"]}',
 '{"instagram": {"frequency": "daily", "content_types": ["posts", "stories", "reels"]}, "facebook": {"frequency": "4x weekly", "content_types": ["posts", "events"]}}');

-- Step 7: Create sample calendar events
INSERT INTO calendar_events (owner_id, brand_id, strategy_id, date, platform, content_pillar, content_type, title, status) VALUES
-- John's events
('550e8400-e29b-41d4-a716-446655440000', 'b1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 
 '2025-08-21', 'LinkedIn', 'Product Education', 'Article', 'How Our API Solves Common Integration Challenges', 'planned'),
('550e8400-e29b-41d4-a716-446655440000', 'b1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111',
 '2025-08-22', 'Twitter', 'Industry Insights', 'Thread', '10 Tech Trends Every Startup Should Watch', 'planned'),
('550e8400-e29b-41d4-a716-446655440000', 'b1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111',
 '2025-08-23', 'LinkedIn', 'Customer Success', 'Post', 'Customer Spotlight: How TechCorp Increased Efficiency by 40%', 'draft'),

-- Jane's events
('550e8400-e29b-41d4-a716-446655440001', 'b2222222-2222-2222-2222-222222222222', 's2222222-2222-2222-2222-222222222222',
 '2025-08-21', 'Instagram', 'Environmental Education', 'Reel', 'Quick Tip: Reduce Plastic Waste in Your Kitchen', 'planned'),
('550e8400-e29b-41d4-a716-446655440001', 'b2222222-2222-2222-2222-222222222222', 's2222222-2222-2222-2222-222222222222',
 '2025-08-22', 'Facebook', 'Community Stories', 'Post', 'Meet Sarah: A Zero-Waste Champion in Our Community', 'planned'),
('550e8400-e29b-41d4-a716-446655440001', 'b2222222-2222-2222-2222-222222222222', 's2222222-2222-2222-2222-222222222222',
 '2025-08-23', 'Instagram', 'Product Benefits', 'Story', 'Behind the Scenes: How We Make Our Eco Packaging', 'draft');

-- Step 8: Add some KPIs
INSERT INTO kpis (owner_id, brand_id, strategy_id, name, target_value, unit, timeframe) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'b1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'LinkedIn Followers', 5000, 'followers', 'Q4 2025'),
('550e8400-e29b-41d4-a716-446655440000', 'b1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'Monthly Website Traffic', 25000, 'visits', 'monthly'),
('550e8400-e29b-41d4-a716-446655440001', 'b2222222-2222-2222-2222-222222222222', 's2222222-2222-2222-2222-222222222222', 'Instagram Engagement Rate', 4.5, 'percentage', 'monthly'),
('550e8400-e29b-41d4-a716-446655440001', 'b2222222-2222-2222-2222-222222222222', 's2222222-2222-2222-2222-222222222222', 'Email Subscribers', 10000, 'subscribers', 'Q4 2025');

-- Verification Queries
-- Run these to check if data was created successfully:

-- Check users
SELECT 'Users Created:' as info, count(*) as count FROM users;
SELECT id, full_name, email, onboarded FROM users;

-- Check brands
SELECT 'Brands Created:' as info, count(*) as count FROM brands;
SELECT name, industry, owner_id FROM brands;

-- Check boards
SELECT 'Boards Created:' as info, count(*) as count FROM boards;
SELECT title, description, user_id FROM boards;

-- Check content
SELECT 'Content Items Created:' as info, count(*) as count FROM content;
SELECT title, content_type, status, board_id FROM content;

-- Check strategies
SELECT 'Strategies Created:' as info, count(*) as count FROM strategies;
SELECT brand_id, status, version FROM strategies;

-- Check calendar events
SELECT 'Calendar Events Created:' as info, count(*) as count FROM calendar_events;
SELECT date, platform, title, status FROM calendar_events ORDER BY date;

-- Check KPIs
SELECT 'KPIs Created:' as info, count(*) as count FROM kpis;
SELECT name, target_value, unit, timeframe FROM kpis;

-- Test login credentials:
-- Email: john.doe@test.com, Password: password123
-- Email: jane.smith@test.com, Password: password123
