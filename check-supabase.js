import { supabase } from './src/lib/supabaseClient.ts'

async function listTables() {
  if (!supabase) {
    console.log('Supabase client not initialized')
    return
  }

  try {
    // Use a direct SQL query to list tables
    const { data, error } = await supabase.rpc('get_table_names')
    
    if (error) {
      console.error('Error fetching tables:', error)
      
      // Try alternative approach
      console.log('Trying alternative approach...')
      const { data: authData, error: authError } = await supabase.auth.getSession()
      console.log('Auth status:', authError ? 'Not authenticated' : 'Authenticated')
      
      return
    }
    
    console.log('Tables:', data)
  } catch (err) {
    console.error('Error:', err.message)
  }
}

listTables()
