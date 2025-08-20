-- Add missing strategy columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS strategy_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS strategy_data JSONB DEFAULT null;

-- Update existing users to have strategy_completed = false if null
UPDATE users 
SET strategy_completed = false 
WHERE strategy_completed IS NULL;
