/**
 * Test Account Setup Script
 *
 * Creates real test accounts using Supabase Auth (admin API) and seeds sample data.
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment variables.
 *
 * Run: npm run setup:test
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('[setup-test-accounts] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function createOrFindUser(email, password, userMetadata) {
  console.log(`Creating test account for ${email}...`)
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: userMetadata,
  })

  if (error) {
    // If user already exists, fetch it
    const alreadyExists = (error.message || '').toLowerCase().includes('already registered')
    if (!alreadyExists) {
      console.warn(`Could not create ${email}: ${error.message}. Attempting to find existing user...`)
    } else {
      console.log(`${email} already exists, fetching...`)
    }

    const { data: list, error: listErr } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 })
    if (listErr) {
      console.error('Failed to list users:', listErr.message)
      return null
    }
    const existing = list.users.find(u => u.email?.toLowerCase() === email.toLowerCase())
    if (!existing) {
      console.error(`User ${email} not found after create attempt.`)
      return null
    }
    return existing
  }

  console.log(`✅ Successfully created account for ${email}`)
  return data.user
}

async function ensureBoard(userId, title, description) {
  const { data: existing, error: findErr } = await supabase
    .from('boards')
    .select('id')
    .eq('user_id', userId)
    .eq('title', title)
    .limit(1)
    .maybeSingle()

  if (findErr) {
    console.error('Error checking for existing board:', findErr.message)
  }

  if (existing?.id) return existing

  const { data, error } = await supabase
    .from('boards')
    .insert({ user_id: userId, title, description })
    .select('id')
    .single()

  if (error) {
    console.error('Error creating board:', error.message)
    return null
  }
  return data
}

async function ensureContent(boardId, items) {
  for (const item of items) {
    const { data: existing, error: findErr } = await supabase
      .from('content')
      .select('id')
      .eq('board_id', boardId)
      .eq('title', item.title)
      .limit(1)
      .maybeSingle()

    if (findErr) {
      console.error('Error checking content:', findErr.message)
      continue
    }
    if (existing?.id) continue

    const { error } = await supabase.from('content').insert({
      board_id: boardId,
      title: item.title,
      description: item.description,
      content_type: item.type,
      status: item.status,
    })
    if (error) console.error('Error inserting content:', error.message)
  }
}

async function tryInsertBrand(userId, name, industry, target_audience) {
  // Optional: only if brands table exists – if it fails, just skip
  const { error } = await supabase.from('brands').insert({ owner_id: userId, name, industry, target_audience })
  if (error) {
    if ((error.message || '').toLowerCase().includes('relation') && (error.message || '').toLowerCase().includes('does not exist')) {
      console.log('Skipping brands seed (table not found).')
      return
    }
    console.warn('Brand insert error:', error.message)
  }
}

async function addSampleData(userId, userData) {
  console.log(`Seeding sample data for user ${userId}...`)

  await tryInsertBrand(userId, userData.brandName, userData.industry, userData.targetAudience)

  const board = await ensureBoard(userId, userData.boardTitle, userData.boardDescription)
  if (!board) return
  await ensureContent(board.id, userData.sampleContent)

  console.log(`✅ Sample data ensured for user ${userId}`)
}

async function setupTestAccounts() {
  console.log('🚀 Setting up test accounts...')

  const johnMeta = {
    full_name: 'John Doe',
    avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
  }
  const johnData = {
    brandName: 'TechStartup Pro',
    industry: 'Technology',
    targetAudience: {
      demographics: { age_range: '25-45', income: 'high', education: 'college+' },
      interests: ['innovation', 'productivity', 'entrepreneurship'],
    },
    boardTitle: 'Q4 Marketing Campaign',
    boardDescription: 'Planning and content for Q4 product launch',
    sampleContent: [
      { title: 'Product Demo Video', description: 'Create engaging demo video showcasing key features', type: 'video', status: 'draft' },
      { title: 'Launch Email Campaign', description: 'Email sequence for product launch announcement', type: 'email', status: 'published' },
      { title: 'Social Media Teasers', description: 'Short form content for Instagram and TikTok', type: 'social', status: 'draft' },
    ],
  }

  const janeMeta = {
    full_name: 'Jane Smith',
    avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4',
  }
  const janeData = {
    brandName: 'EcoFriendly Goods',
    industry: 'Sustainability',
    targetAudience: {
      demographics: { age_range: '30-55', income: 'medium-high', education: 'college+' },
      interests: ['environment', 'sustainability', 'healthy living'],
    },
    boardTitle: 'Sustainability Campaign',
    boardDescription: 'Environmental awareness content series',
    sampleContent: [
      { title: 'Earth Day Campaign', description: 'Comprehensive environmental awareness campaign', type: 'campaign', status: 'draft' },
      { title: 'Eco Tips Blog Series', description: 'Weekly blog posts about sustainable living', type: 'blog', status: 'published' },
      { title: 'Recycling Infographic', description: 'Visual guide to proper recycling practices', type: 'infographic', status: 'draft' },
    ],
  }

  const john = await createOrFindUser('john.doe@test.com', 'password123', johnMeta)
  if (john?.id) await addSampleData(john.id, johnData)

  const jane = await createOrFindUser('jane.smith@test.com', 'password123', janeMeta)
  if (jane?.id) await addSampleData(jane.id, janeData)

  console.log('\n🎉 Test account setup complete!')
  console.log('Sign in using:')
  console.log('• john.doe@test.com / password123')
  console.log('• jane.smith@test.com / password123')
}

setupTestAccounts().catch(err => {
  console.error('Unexpected error:', err)
  process.exitCode = 1
})
