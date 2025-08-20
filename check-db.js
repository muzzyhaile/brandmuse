import { supabase } from './src/lib/supabaseClient.ts'

async function checkDatabase() {
  if (!supabase) {
    console.log('Supabase client not initialized')
    return
  }

  try {
    // Check if we can get the current user
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.log('Session error:', sessionError.message)
    } else {
      console.log('Current user:', session?.user?.email || 'Not authenticated')
    }
    
    // Try to list tables from information_schema
    const { data, error } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
    
    if (error) {
      console.log('Error fetching tables:', error.message)
    } else {
      console.log('Existing tables:')
      data.forEach(table => console.log('- ' + table.tablename))
    }
    
  } catch (err) {
    console.error('Error:', err.message)
  }
}

checkDatabase()