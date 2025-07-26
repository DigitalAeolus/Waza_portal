import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test connection function
export async function testConnection() {
  try {
    const { data, error } = await supabase.from('waitlist_submissions').select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('Supabase connection test failed:', error)
      return false
    }
    
    console.log('Supabase connection successful')
    return true
  } catch (error) {
    console.error('Supabase connection failed:', error)
    return false
  }
}

// Initialize database tables (this will be handled by Supabase dashboard)
export async function initializeTables() {
  // Note: Tables should be created via Supabase dashboard or SQL editor
  // This function is kept for compatibility but doesn't do anything
  console.log('Tables should be created via Supabase dashboard')
  return true
}