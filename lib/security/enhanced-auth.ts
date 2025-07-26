// 增强的安全认证功能

import { supabase } from '@/lib/db/connection'

// 生成安全的随机token
export function generateSecureToken(length: number = 64): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 验证token强度
export function validateTokenStrength(token: string): {
  isValid: boolean
  score: number
  issues: string[]
} {
  const issues: string[] = []
  let score = 0

  if (token.length >= 32) score += 25
  else issues.push('Token should be at least 32 characters long')

  if (/[A-Z]/.test(token)) score += 25
  else issues.push('Token should contain uppercase letters')

  if (/[a-z]/.test(token)) score += 25
  else issues.push('Token should contain lowercase letters')

  if (/[0-9\-_]/.test(token)) score += 25
  else issues.push('Token should contain numbers or special characters')

  return {
    isValid: score >= 75,
    score,
    issues
  }
}

// 哈希token用于存储
export async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(token)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// 验证token（使用哈希比较）
export async function verifyToken(token: string, hashedToken: string): Promise<boolean> {
  const tokenHash = await hashToken(token)
  return tokenHash === hashedToken
}

// 记录访问日志
export async function logAdminAccess(token: string, action: string, ip?: string) {
  try {
    await supabase
      .from('admin_access_logs')
      .insert([{
        token_used: token.substring(0, 8) + '***', // 只记录token前8位
        action,
        ip_address: ip,
        accessed_at: new Date().toISOString()
      }])
  } catch (error) {
    console.error('Failed to log admin access:', error)
  }
}

// 检查IP白名单（可选）
export function checkIPWhitelist(ip: string, whitelist: string[]): boolean {
  return whitelist.length === 0 || whitelist.includes(ip)
}

// Rate limiting检查
const accessRateLimits = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(identifier: string, maxRequests: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now()
  const limit = accessRateLimits.get(identifier)

  if (!limit || now > limit.resetTime) {
    accessRateLimits.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (limit.count >= maxRequests) {
    return false
  }

  limit.count++
  return true
}