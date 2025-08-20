/**
 * Database Setup and Validation Script
 * Run this to add missing columns and test database connectivity
 */
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('[db-setup] Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addMissingColumns() {
  console.log('Adding missing strategy columns to users table...')
  
  try {
    // Add strategy_completed column
    const { error: strategyCompletedError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE users ADD COLUMN IF NOT EXISTS strategy_completed BOOLEAN DEFAULT false'
    })
    
    if (strategyCompletedError && !strategyCompletedError.message.includes('already exists')) {
      console.error('Error adding strategy_completed column:', strategyCompletedError)
    } else {
      console.log('✅ strategy_completed column added/verified')
    }
    
    // Add strategy_data column
    const { error: strategyDataError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE users ADD COLUMN IF NOT EXISTS strategy_data JSONB DEFAULT null'
    })
    
    if (strategyDataError && !strategyDataError.message.includes('already exists')) {
      console.error('Error adding strategy_data column:', strategyDataError)
    } else {
      console.log('✅ strategy_data column added/verified')
    }
    
    // Update existing users
    const { error: updateError } = await supabase.rpc('exec_sql', {
      sql: 'UPDATE users SET strategy_completed = false WHERE strategy_completed IS NULL'
    })
    
    if (updateError) {
      console.error('Error updating existing users:', updateError)
    } else {
      console.log('✅ Existing users updated')
    }
    
  } catch (error) {
    console.error('Error executing SQL:', error)
  }
}

async function testConnection() {
  console.log('Testing database connection...')
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count(*)')
      .limit(1)
    
    if (error) {
      console.error('❌ Database connection test failed:', error.message)
    } else {
      console.log('✅ Database connection successful')
    }
  } catch (error) {
    console.error('❌ Connection error:', error)
  }
}

async function main() {
  console.log('🚀 Database setup and validation starting...\n')
  
  await testConnection()
  await addMissingColumns()
  
  console.log('\n🎉 Database setup complete!')
  console.log('\nNext steps:')
  console.log('1. Restart your development server (npm run dev)')
  console.log('2. Try accessing the onboarding page again')
}

main().catch(err => {
  console.error('Setup failed:', err)
  process.exit(1)
})
