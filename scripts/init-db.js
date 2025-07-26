const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const createTables = async () => {
  console.log('Creating email verification tables...')
  
  try {
    // Test if we can create a simple table first
    console.log('Testing database access...')
    const { error: testError } = await supabase
      .from('waitlist_submissions')
      .select('count', { count: 'exact', head: true })
    
    if (testError) {
      console.error('Database connection test failed:', testError)
      return
    }
    
    console.log('✓ Database connection successful')
    console.log('')
    console.log('Note: Tables need to be created manually in Supabase SQL Editor')
    console.log('Please follow these steps:')
    console.log('1. Go to https://app.supabase.com/')
    console.log('2. Select your project')
    console.log('3. Go to SQL Editor')
    console.log('4. Run the SQL from db/supabase-verification-tables.sql')
    console.log('')
    console.log('SQL Script location: db/supabase-verification-tables.sql')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

createTables()
  .catch(console.error)
  .finally(() => process.exit(0))