import { NextRequest, NextResponse } from 'next/server'
import { getWaitlistSubmissions, getAdminStats, getUniqueIndustries, getUniqueExperiences, deleteSubmission } from '@/lib/db/waitlist'
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
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const industry = searchParams.get('industry') || undefined
    const experience = searchParams.get('experience') || undefined
    const search = searchParams.get('search') || undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit
    
    // Get submissions with filters
    const submissions = await getWaitlistSubmissions({
      industry,
      experience,
      search,
      limit,
      offset
    })
    
    // Get statistics
    const stats = await getAdminStats()
    
    // Get filter options
    const industries = await getUniqueIndustries()
    const experiences = await getUniqueExperiences()
    
    return NextResponse.json({
      submissions,
      stats,
      filters: {
        industries,
        experiences
      },
      pagination: {
        page,
        limit,
        total: stats.totalSubmissions
      }
    })
    
  } catch (error) {
    console.error('Admin submissions API error:', error)
    
    // Fallback to localStorage for development
    if (error instanceof Error) {
      console.log('Supabase error - falling back to localStorage:', error.message)
      
      return NextResponse.json({
        submissions: [],
        stats: {
          totalSubmissions: 0,
          uniqueIndustries: 0,
          uniqueCompanies: 0,
          recentSubmissions: 0,
          newsletterSubscribers: 0,
          earlyAccessInterested: 0
        },
        filters: {
          industries: [],
          experiences: []
        },
        pagination: {
          page: 1,
          limit: 50,
          total: 0
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

export async function DELETE(request: NextRequest) {
  try {
    // Check admin access
    const { authorized, error } = await checkAdminAccess(request)
    if (!authorized) {
      return NextResponse.json({ error }, { status: 401 })
    }
    
    const body = await request.json()
    const { id } = body
    
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Valid submission ID required' },
        { status: 400 }
      )
    }
    
    const deleted = await deleteSubmission(id)
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Submission deleted successfully'
    })
    
  } catch (error) {
    console.error('Admin delete API error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}