import { createClient } from '@supabase/supabase-js'

// 管理员专用的Supabase客户端（使用service_role key）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase service role configuration')
}

// 创建管理员专用客户端（绕过RLS）
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// 管理员操作函数
export async function adminGetSubmissions(filters?: any) {
  const { data, error } = await supabaseAdmin
    .from('waitlist_submissions')
    .select('*')
    .order('submitted_at', { ascending: false })
  
  if (error) {
    console.error('Admin get submissions error:', error)
    throw error
  }
  
  return data
}

export async function adminDeleteSubmission(id: string) {
  const { error } = await supabaseAdmin
    .from('waitlist_submissions')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Admin delete submission error:', error)
    throw error
  }
  
  return true
}

export async function adminVerifyToken(token: string) {
  const { data, error } = await supabaseAdmin
    .from('admin_tokens')
    .select('*')
    .eq('token', token)
    .eq('is_active', true)
    .single()
  
  if (error) {
    console.error('Admin token verification error:', error)
    return false
  }
  
  // 更新最后使用时间
  await supabaseAdmin
    .from('admin_tokens')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', data.id)
  
  return true
}