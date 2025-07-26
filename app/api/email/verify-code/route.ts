import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { verifyCode, storeVerificationToken, verifyToken } from '@/lib/db/verification'

// 生成验证token
async function generateVerificationToken(email: string): Promise<string> {
  const timestamp = Date.now()
  const tokenData = `${email}:${timestamp}`
  const token = crypto.createHash('sha256').update(tokenData).digest('hex')
  
  // 存储token到数据库
  await storeVerificationToken(token, email)
  
  return token
}

// 验证token
export async function verifyEmailToken(token: string): Promise<{ valid: boolean; email?: string }> {
  return await verifyToken(token)
}

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 })
    }

    // 从数据库验证验证码
    const isValid = await verifyCode(email, code)
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid or expired verification code' }, { status: 400 })
    }
    
    // 生成验证token
    const verificationToken = await generateVerificationToken(email)

    return NextResponse.json({ 
      message: 'Email verified successfully',
      verified: true,
      verificationToken: verificationToken
    })
  } catch (error) {
    console.error('Error verifying code:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}