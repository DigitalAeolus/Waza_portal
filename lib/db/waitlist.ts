import { supabase } from './connection'
import { supabaseAdmin } from './admin-connection'

export interface WaitlistSubmission {
  id?: string
  fullName: string
  email: string
  company: string
  jobTitle: string
  industry: string
  companySizeRange: string
  designExperience: string
  interestedFeatures: string[]
  whyTryWaza?: string
  newsletter: boolean
  earlyAccess: boolean
  submittedAt?: string
  createdAt?: string
  updatedAt?: string
}

export interface AdminStats {
  totalSubmissions: number
  uniqueIndustries: number
  uniqueCompanies: number
  recentSubmissions: number
  newsletterSubscribers: number
  earlyAccessInterested: number
}

// Insert a new waitlist submission
export async function insertWaitlistSubmission(submission: WaitlistSubmission): Promise<string> {
  const { data, error } = await supabase
    .from('waitlist_submissions')
    .insert([
      {
        full_name: submission.fullName,
        email: submission.email,
        company: submission.company,
        job_title: submission.jobTitle,
        industry: submission.industry,
        company_size_range: submission.companySizeRange,
        design_experience: submission.designExperience,
        interested_features: submission.interestedFeatures,
        why_try_waza: submission.whyTryWaza || null,
        newsletter: submission.newsletter,
        early_access: submission.earlyAccess,
        submitted_at: new Date().toISOString()
      }
    ])
    .select('id')
    .single()
  
  if (error) {
    console.error('Error inserting waitlist submission:', error)
    throw error
  }
  
  return data.id
}

// Get all waitlist submissions with optional filtering
export async function getWaitlistSubmissions(filters?: {
  industry?: string
  experience?: string
  search?: string
  limit?: number
  offset?: number
}): Promise<WaitlistSubmission[]> {
  let query = supabaseAdmin
    .from('waitlist_submissions')
    .select(`
      id,
      full_name,
      email,
      company,
      job_title,
      industry,
      company_size_range,
      design_experience,
      interested_features,
      why_try_waza,
      newsletter,
      early_access,
      submitted_at,
      created_at,
      updated_at
    `)
    .order('submitted_at', { ascending: false })
  
  // Apply filters
  if (filters?.industry && filters.industry !== 'all') {
    query = query.eq('industry', filters.industry)
  }
  
  if (filters?.experience && filters.experience !== 'all') {
    query = query.eq('design_experience', filters.experience)
  }
  
  if (filters?.search) {
    query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company.ilike.%${filters.search}%`)
  }
  
  // Apply pagination
  if (filters?.limit) {
    query = query.limit(filters.limit)
    
    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + filters.limit - 1)
    }
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching waitlist submissions:', error)
    throw error
  }
  
  return data?.map((row: any) => ({
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    company: row.company,
    jobTitle: row.job_title,
    industry: row.industry,
    companySizeRange: row.company_size_range,
    designExperience: row.design_experience,
    interestedFeatures: row.interested_features,
    whyTryWaza: row.why_try_waza,
    newsletter: row.newsletter,
    earlyAccess: row.early_access,
    submittedAt: row.submitted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  })) || []
}

// Get submission by ID
export async function getSubmissionById(id: string): Promise<WaitlistSubmission | null> {
  const { data, error } = await supabase
    .from('waitlist_submissions')
    .select(`
      id,
      full_name,
      email,
      company,
      job_title,
      industry,
      company_size_range,
      design_experience,
      interested_features,
      why_try_waza,
      newsletter,
      early_access,
      submitted_at,
      created_at,
      updated_at
    `)
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching submission by ID:', error)
    return null
  }
  
  if (!data) return null
  
  return {
    id: data.id,
    fullName: data.full_name,
    email: data.email,
    company: data.company,
    jobTitle: data.job_title,
    industry: data.industry,
    companySizeRange: data.company_size_range,
    designExperience: data.design_experience,
    interestedFeatures: data.interested_features,
    whyTryWaza: data.why_try_waza,
    newsletter: data.newsletter,
    earlyAccess: data.early_access,
    submittedAt: data.submitted_at,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  }
}

// Check if email already exists
export async function emailExists(email: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('waitlist_submissions')
    .select('id')
    .eq('email', email)
    .single()
  
  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error checking email existence:', error)
    return false
  }
  
  return !!data
}

// Delete submission by ID
export async function deleteSubmission(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('waitlist_submissions')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting submission:', error)
    return false
  }
  
  return true
}

// Get admin dashboard statistics
export async function getAdminStats(): Promise<AdminStats> {
  try {
    // Get total submissions
    const { count: totalSubmissions } = await supabaseAdmin
      .from('waitlist_submissions')
      .select('*', { count: 'exact', head: true })
    
    // Get unique industries
    const { data: industries } = await supabaseAdmin
      .from('waitlist_submissions')
      .select('industry')
      .not('industry', 'is', null)
    
    // Get unique companies
    const { data: companies } = await supabaseAdmin
      .from('waitlist_submissions')
      .select('company')
      .not('company', 'is', null)
    
    // Get recent submissions (last 7 days)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    const { count: recentSubmissions } = await supabaseAdmin
      .from('waitlist_submissions')
      .select('*', { count: 'exact', head: true })
      .gte('submitted_at', weekAgo.toISOString())
    
    // Get newsletter subscribers
    const { count: newsletterSubscribers } = await supabaseAdmin
      .from('waitlist_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('newsletter', true)
    
    // Get early access interested
    const { count: earlyAccessInterested } = await supabaseAdmin
      .from('waitlist_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('early_access', true)
    
    return {
      totalSubmissions: totalSubmissions || 0,
      uniqueIndustries: new Set(industries?.map(i => i.industry)).size || 0,
      uniqueCompanies: new Set(companies?.map(c => c.company)).size || 0,
      recentSubmissions: recentSubmissions || 0,
      newsletterSubscribers: newsletterSubscribers || 0,
      earlyAccessInterested: earlyAccessInterested || 0
    }
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return {
      totalSubmissions: 0,
      uniqueIndustries: 0,
      uniqueCompanies: 0,
      recentSubmissions: 0,
      newsletterSubscribers: 0,
      earlyAccessInterested: 0
    }
  }
}

// Get unique industries for filtering
export async function getUniqueIndustries(): Promise<string[]> {
  const { data, error } = await supabaseAdmin
    .from('waitlist_submissions')
    .select('industry')
    .not('industry', 'is', null)
  
  if (error) {
    console.error('Error fetching unique industries:', error)
    return []
  }
  
  const uniqueIndustries = [...new Set(data?.map(item => item.industry))].sort()
  return uniqueIndustries
}

// Get unique experience levels for filtering
export async function getUniqueExperiences(): Promise<string[]> {
  const { data, error } = await supabaseAdmin
    .from('waitlist_submissions')
    .select('design_experience')
    .not('design_experience', 'is', null)
  
  if (error) {
    console.error('Error fetching unique experiences:', error)
    return []
  }
  
  const uniqueExperiences = [...new Set(data?.map(item => item.design_experience))].sort()
  return uniqueExperiences
}