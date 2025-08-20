-- Add strategy completion tracking to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS strategy_completed BOOLEAN DEFAULT false;

-- Add strategy_data field to store the completed strategy
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS strategy_data JSONB;