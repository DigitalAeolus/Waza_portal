import { NextRequest, NextResponse } from 'next/server'
import { getAdminStats } from '@/lib/db/waitlist'
import { verifyAdminToken } from '@/lib/db/admin'

// Helper function to verify admin access
async function checkAdminAccess(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  
  if (!token) {
    return { authorized: false, error: 'Admin token required' }
  }
  
  try {
    const isValid = await verifyAdminToken(token)
    return { authorized: isValid, error: isValid ? null : 'Invalid admin token' }
  } catch (error) {
    console.error('Admin token verification error:', error)
    
    // Fallback to environment token for development
    const envToken = process.env.ADMIN_TOKEN
    if (envToken && token === envToken) {
      return { authorized: true, error: null }
    }
    
    return { authorized: false, error: 'Token verification failed' }
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check admin access
    const { authorized, error } = await checkAdminAccess(request)
    if (!authorized) {
      return NextResponse.json({ error }, { status: 401 })
    }
    
    // Get statistics
    const stats = await getAdminStats()
    
    return NextResponse.json({
      success: true,
      stats
    })
    
  } catch (error) {
    console.error('Admin stats API error:', error)
    
    // Fallback for development
    if (error instanceof Error) {
      console.log('Supabase error - returning empty stats:', error.message)
      
      return NextResponse.json({
        success: true,
        stats: {
          totalSubmissions: 0,
          uniqueIndustries: 0,
          uniqueCompanies: 0,
          recentSubmissions: 0,
          newsletterSubscribers: 0,
          earlyAccessInterested: 0
        },
        fallback: true
      })
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}