import { supabase } from '@/lib/db/connection'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test if tables actually exist by trying to select from them
    const { data, error } = await supabase
      .from('waitlist_submissions')
      .select('id')
      .limit(1)
    
    if (error) {
      console.log('Connection test error:', error.code, error.message)
      return NextResponse.json({
        success: false,
        connected: true, // Connection works, but tables don't exist
        tablesExist: false,
        error: error.message,
        code: error.code,
        nextStep: 'Create tables using the SQL schema in db/supabase-schema.sql',
        instructions: [
          '1. Go to your Supabase dashboard: https://jfkxdkflvxcoxtgkpcat.supabase.co',
          '2. Navigate to SQL Editor',
          '3. Copy and paste the SQL schema from db/supabase-schema.sql',
          '4. Run the SQL to create tables and policies',
          '5. Test the connection again'
        ]
      })
    }
    
    return NextResponse.json({
      success: true,
      connected: true,
      tablesExist: true,
      message: 'Supabase connection and tables are working correctly'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      connected: false,
      error: 'Failed to connect to Supabase',
      details: error
    })
  }
}