import { supabase } from './connection'
import { supabaseAdmin } from './admin-connection'

export interface AdminToken {
  id: string
  token: string
  description?: string
  isActive: boolean
  createdAt: string
  lastUsedAt?: string
  expiresAt?: string
}

// Verify admin token
export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin
      .from('admin_tokens')
      .select('id, token, is_active, expires_at')
      .eq('token', token)
      .eq('is_active', true)
      .single()
    
    if (error || !data) {
      console.error('Token verification failed:', error)
      return false
    }
    
    // Check if token has expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return false
    }
    
    // Update last used timestamp
    await updateTokenLastUsed(token)
    
    return true
  } catch (error) {
    console.error('Token verification failed:', error)
    return false
  }
}

// Update token last used timestamp
export async function updateTokenLastUsed(token: string): Promise<void> {
  try {
    const { error } = await supabaseAdmin
      .from('admin_tokens')
      .update({ last_used_at: new Date().toISOString() })
      .eq('token', token)
    
    if (error) {
      console.error('Error updating token last used:', error)
    }
  } catch (error) {
    console.error('Error updating token last used:', error)
  }
}

// Get all admin tokens (for management)
export async function getAdminTokens(): Promise<AdminToken[]> {
  const { data, error } = await supabase
    .from('admin_tokens')
    .select(`
      id,
      token,
      description,
      is_active,
      created_at,
      last_used_at,
      expires_at
    `)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching admin tokens:', error)
    return []
  }
  
  return data?.map((row: any) => ({
    id: row.id,
    token: row.token,
    description: row.description,
    isActive: row.is_active,
    createdAt: row.created_at,
    lastUsedAt: row.last_used_at,
    expiresAt: row.expires_at
  })) || []
}

// Create new admin token
export async function createAdminToken(token: string, description?: string, expiresAt?: Date): Promise<string> {
  const { data, error } = await supabase
    .from('admin_tokens')
    .insert([
      {
        token,
        description,
        expires_at: expiresAt?.toISOString()
      }
    ])
    .select('id')
    .single()
  
  if (error) {
    console.error('Error creating admin token:', error)
    throw error
  }
  
  return data.id
}

// Deactivate admin token
export async function deactivateAdminToken(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('admin_tokens')
    .update({ is_active: false })
    .eq('id', id)
  
  if (error) {
    console.error('Error deactivating admin token:', error)
    return false
  }
  
  return true
}

// Generate secure random token
export function generateSecureToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}