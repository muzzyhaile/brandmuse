import { supabase } from './src/lib/supabaseClient'

async function initializeDatabase() {
  if (!supabase) {
    console.log('Supabase client not initialized')
    return
  }

  try {
    // Create users table
    const { error: usersError } = await supabase.rpc('create_users_table')
    
    if (usersError) {
      console.log('Users table creation error (might already exist):', usersError.message)
    } else {
      console.log('Users table created successfully')
    }
    
    // Create boards table
    const { error: boardsError } = await supabase.rpc('create_boards_table')
    
    if (boardsError) {
      console.log('Boards table creation error (might already exist):', boardsError.message)
    } else {
      console.log('Boards table created successfully')
    }
    
    // Create content table
    const { error: contentError } = await supabase.rpc('create_content_table')
    
    if (contentError) {
      console.log('Content table creation error (might already exist):', contentError.message)
    } else {
      console.log('Content table created successfully')
    }
    
  } catch (err) {
    console.error('Error:', err.message)
  }
}

initializeDatabase()