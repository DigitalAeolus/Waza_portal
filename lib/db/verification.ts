import { supabase } from './connection'

// 内存存储作为回退（仅用于开发环境）
const memoryStorage = {
  codes: new Map<string, { code: string; expiry: number }>(),
  tokens: new Map<string, { email: string; expiry: number }>()
}

// 检查是否处于开发模式
const isDevelopment = process.env.NODE_ENV === 'development'

// 邮件验证码接口
export interface EmailVerificationCode {
  id: number
  email: string
  code: string
  created_at: Date
  expires_at: Date
}

// 邮件验证令牌接口
export interface EmailVerificationToken {
  id: number
  token: string
  email: string
  created_at: Date
  expires_at: Date
}

// 存储验证码到数据库
export async function storeVerificationCode(email: string, code: string): Promise<boolean> {
  try {
    // 尝试使用数据库存储
    const { error } = await supabase
      .from('email_verification_codes')
      .delete()
      .eq('email', email)
    
    if (error && error.code === '42P01' && isDevelopment) {
      // 表不存在且处于开发环境，使用内存存储
      console.warn('Using memory storage for verification codes (development only)')
      const expiry = Date.now() + 10 * 60 * 1000
      memoryStorage.codes.set(email, { code, expiry })
      return true
    } else if (error) {
      console.error('Error deleting old verification code:', error)
      return false
    }
    
    // 插入新的验证码（10分钟过期）
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()
    
    const { error: insertError } = await supabase
      .from('email_verification_codes')
      .insert([{ email, code, expires_at: expiresAt }])
    
    if (insertError) {
      console.error('Error storing verification code:', insertError)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error storing verification code:', error)
    return false
  }
}

// 从数据库获取验证码
export async function getVerificationCode(email: string): Promise<EmailVerificationCode | null> {
  try {
    const { data, error } = await supabase
      .from('email_verification_codes')
      .select('*')
      .eq('email', email)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (error && error.code === '42P01' && isDevelopment) {
      // 表不存在且处于开发环境，使用内存存储
      const stored = memoryStorage.codes.get(email)
      if (stored && Date.now() < stored.expiry) {
        return {
          id: 1,
          email,
          code: stored.code,
          created_at: new Date(),
          expires_at: new Date(stored.expiry)
        }
      }
      return null
    } else if (error || !data) {
      return null
    }
    
    return data as EmailVerificationCode
  } catch (error) {
    console.error('Error getting verification code:', error)
    return null
  }
}

// 验证验证码
export async function verifyCode(email: string, code: string): Promise<boolean> {
  try {
    const storedCode = await getVerificationCode(email)
    
    if (!storedCode) {
      return false
    }
    
    // 验证码匹配则删除该记录
    if (storedCode.code === code) {
      // 尝试从数据库删除
      const { error } = await supabase
        .from('email_verification_codes')
        .delete()
        .eq('email', email)
        
      if (error && error.code === '42P01' && isDevelopment) {
        // 表不存在且处于开发环境，从内存删除
        memoryStorage.codes.delete(email)
      }
      
      return true
    }
    
    return false
  } catch (error) {
    console.error('Error verifying code:', error)
    return false
  }
}

// 存储验证令牌
export async function storeVerificationToken(token: string, email: string): Promise<boolean> {
  try {
    // 尝试删除旧令牌
    const { error } = await supabase
      .from('email_verification_tokens')
      .delete()
      .eq('email', email)
    
    if (error && error.code === '42P01' && isDevelopment) {
      // 表不存在且处于开发环境，使用内存存储
      console.warn('Using memory storage for verification tokens (development only)')
      const expiry = Date.now() + 30 * 60 * 1000
      memoryStorage.tokens.set(token, { email, expiry })
      return true
    } else if (error) {
      console.error('Error deleting old verification token:', error)
      return false
    }
    
    // 插入新令牌（30分钟过期）
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString()
    
    const { error: insertError } = await supabase
      .from('email_verification_tokens')
      .insert([{ token, email, expires_at: expiresAt }])
    
    if (insertError) {
      console.error('Error storing verification token:', insertError)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error storing verification token:', error)
    return false
  }
}

// 验证令牌
export async function verifyToken(token: string): Promise<{ valid: boolean; email?: string }> {
  try {
    const { data, error } = await supabase
      .from('email_verification_tokens')
      .select('*')
      .eq('token', token)
      .gt('expires_at', new Date().toISOString())
      .single()
    
    if (error && error.code === '42P01' && isDevelopment) {
      // 表不存在且处于开发环境，使用内存存储
      const stored = memoryStorage.tokens.get(token)
      if (stored && Date.now() < stored.expiry) {
        return { valid: true, email: stored.email }
      }
      return { valid: false }
    } else if (error || !data) {
      return { valid: false }
    }
    
    const tokenData = data as EmailVerificationToken
    return { valid: true, email: tokenData.email }
  } catch (error) {
    console.error('Error verifying token:', error)
    return { valid: false }
  }
}

// 检查邮箱是否在冷却期内（防止频繁发送）
export async function isEmailInCooldown(email: string): Promise<boolean> {
  try {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString()
    
    const { data, error } = await supabase
      .from('email_verification_codes')
      .select('created_at')
      .eq('email', email)
      .gt('created_at', oneMinuteAgo)
      .order('created_at', { ascending: false })
      .limit(1)
    
    if (error && error.code === '42P01' && isDevelopment) {
      // 表不存在且处于开发环境，检查内存存储
      const stored = memoryStorage.codes.get(email)
      if (stored && Date.now() - (stored.expiry - 10 * 60 * 1000) < 60 * 1000) {
        return true
      }
      return false
    } else if (error) {
      console.error('Error checking email cooldown:', error)
      return false
    }
    
    return data && data.length > 0
  } catch (error) {
    console.error('Error checking email cooldown:', error)
    return false
  }
}

// 清理过期记录
export async function cleanupExpiredVerifications(): Promise<void> {
  try {
    const now = new Date().toISOString()
    
    await supabase
      .from('email_verification_codes')
      .delete()
      .lt('expires_at', now)
      
    await supabase
      .from('email_verification_tokens')
      .delete()
      .lt('expires_at', now)
  } catch (error) {
    console.error('Error cleaning up expired verifications:', error)
  }
}