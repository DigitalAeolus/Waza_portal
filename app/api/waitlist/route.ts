import { NextRequest, NextResponse } from 'next/server'
import { insertWaitlistSubmission, emailExists } from '@/lib/db/waitlist'
import { verifyEmailToken } from '@/app/api/email/verify-code/route'
import { sendWelcomeEmail } from '@/lib/email'
import { z } from 'zod'

// Validation schema for waitlist submission
const waitlistSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  jobTitle: z.string().min(1, 'Please select a job title'),
  industry: z.string().min(1, 'Please select an industry'),
  companySizeRange: z.string().min(1, 'Please select company size'),
  designExperience: z.string().min(1, 'Please select your experience level'),
  interestedFeatures: z.array(z.string()).min(1, 'Please select at least one feature'),
  whyTryWaza: z.string().optional(),
  newsletter: z.boolean().default(false),
  earlyAccess: z.boolean().default(false),
  verificationToken: z.string().min(1, 'Verification token is required'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = waitlistSchema.parse(body)
    
    // Verify the email verification token
    const tokenVerification = await verifyEmailToken(validatedData.verificationToken)
    
    if (!tokenVerification.valid) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token. Please verify your email again.' },
        { status: 401 }
      )
    }
    
    // Ensure the token email matches the submitted email
    if (tokenVerification.email !== validatedData.email) {
      return NextResponse.json(
        { error: 'Email verification mismatch. Please verify your email again.' },
        { status: 401 }
      )
    }
    
    // Check if email already exists
    const emailAlreadyExists = await emailExists(validatedData.email)
    if (emailAlreadyExists) {
      return NextResponse.json(
        { error: 'This email is already registered on the waitlist' },
        { status: 400 }
      )
    }
    
    // Remove the token from the data before inserting
    const { verificationToken, ...dataToInsert } = validatedData
    
    // Insert into Supabase
    console.log('Inserting waitlist submission:', dataToInsert)
    const submissionId = await insertWaitlistSubmission(dataToInsert)
    console.log('Submission ID:', submissionId)
    
    // Send welcome email (don't wait for it to avoid blocking the response)
    console.log('Sending welcome email to:', dataToInsert.email)
    sendWelcomeEmail(dataToInsert.email, dataToInsert.fullName)
      .then(success => {
        if (success) {
          console.log(`Welcome email sent successfully to ${dataToInsert.email}`)
        } else {
          console.error(`Failed to send welcome email to ${dataToInsert.email}`)
        }
      })
      .catch(error => {
        console.error('Failed to send welcome email:', error)
        // Log the error but don't fail the registration
      })
    
    return NextResponse.json({
      success: true,
      message: 'Successfully joined the waitlist!',
      id: submissionId
    }, { status: 201 })
    
  } catch (error) {
    console.error('Waitlist submission error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.errors },
        { status: 400 }
      )
    }
    
    // Check if it's a Supabase error and provide more specific error handling
    if (error instanceof Error) {
      // Log the error for debugging
      console.error('Supabase error:', error.message)
      
      // Check for specific Supabase error codes
      if (error.message.includes('duplicate key')) {
        return NextResponse.json(
          { error: 'This email is already registered on the waitlist' },
          { status: 400 }
        )
      }
      
      // 在开发模式下，如果数据库不可用，使用fallback逻辑
      if (process.env.NODE_ENV === 'development') {
        console.log('Using fallback mode for development')
        return NextResponse.json({
          success: true,
          message: 'Successfully joined the waitlist! (Development mode)',
          id: Date.now().toString(),
          fallback: true
        }, { status: 201 })
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}