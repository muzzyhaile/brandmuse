/**
 * Minimal: create two Supabase Auth users (no data seeding).
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env
 * Run: npm run users:create
 */
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('[create-test-users] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function createOrFind(email, password, user_metadata = {}) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata,
  })
  if (!error) return data.user

  const already = (error.message || '').toLowerCase().includes('already')
  if (!already) throw error

  // Fetch existing
  const { data: list, error: listErr } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 })
  if (listErr) throw listErr
  const user = list.users.find(u => u.email?.toLowerCase() === email.toLowerCase())
  if (!user) throw new Error(`User ${email} not found after create attempt`)
  return user
}

async function main() {
  console.log('Creating test users...')
  const john = await createOrFind('john.doe@test.com', 'password123', { full_name: 'John Doe' })
  const jane = await createOrFind('jane.smith@test.com', 'password123', { full_name: 'Jane Smith' })

  console.log('Users ready:')
  console.log('- john.doe@test.com / password123 (id:', john.id + ')')
  console.log('- jane.smith@test.com / password123 (id:', jane.id + ')')
}

main().catch(err => {
  console.error(err)
  process.exitCode = 1
})
