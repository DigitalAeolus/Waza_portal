import { NextRequest, NextResponse } from 'next/server'
import { sendVerificationEmail, generateVerificationCode } from '@/lib/email'
import { storeVerificationCode, isEmailInCooldown } from '@/lib/db/verification'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // 检查是否在冷却时间内（防止频繁发送）
    const inCooldown = await isEmailInCooldown(email)
    if (inCooldown) {
      return NextResponse.json({ 
        error: 'Please wait before requesting another verification code' 
      }, { status: 429 })
    }

    // 生成验证码
    const code = generateVerificationCode()
    const expiry = Date.now() + 10 * 60 * 1000 // 10分钟后过期
    
    // 在开发模式下打印验证码
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] Verification code for ${email}: ${code}`)
    }

    // 存储验证码到数据库
    const stored = await storeVerificationCode(email, code)
    if (!stored) {
      return NextResponse.json({ error: 'Failed to store verification code' }, { status: 500 })
    }

    // 发送邮件
    const emailSent = await sendVerificationEmail(email, code)

    if (!emailSent) {
      return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Verification code sent successfully',
      expiry: expiry
    })
  } catch (error) {
    console.error('Error sending verification code:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// 注意：数据库会自动处理过期记录的清理