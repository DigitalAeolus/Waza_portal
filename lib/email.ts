import nodemailer from 'nodemailer'

const EMAIL_CONFIG = {
  host: '***',
  port: 465,
  secure: true, // SSL
  auth: {
    user: '***',
    pass: '***'
  },
  tls: {
    rejectUnauthorized: false
  },
  timeout: 30000
}

const transporter = nodemailer.createTransport(EMAIL_CONFIG)

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  try {
    const mailOptions = {
      from: '"Waza Team" <waza_bot@GND.VIN>',
      to: email,
      subject: 'Waza Waitlist - Email Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3b82f6; margin: 0; font-size: 28px;">Waza</h1>
            <p style="color: #6b7280; margin: 10px 0 0 0;">AI Design Partner for Hardware Engineers</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <h2 style="color: white; margin: 0 0 15px 0; font-size: 24px;">Email Verification</h2>
            <p style="color: #e5e7eb; margin: 0 0 20px 0; font-size: 16px;">
              Please use the verification code below to complete your waitlist registration:
            </p>
            <div style="background: white; color: #1f2937; font-size: 32px; font-weight: bold; padding: 20px; border-radius: 8px; margin: 20px 0; letter-spacing: 8px;">
              ${code}
            </div>
            <p style="color: #d1d5db; margin: 0; font-size: 14px;">
              This code will expire in 10 minutes.
            </p>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">What's Next?</h3>
            <ul style="color: #6b7280; margin: 0; padding-left: 20px; line-height: 1.6;">
              <li>Enter this verification code on the waitlist page</li>
              <li>Complete your registration to join our exclusive waitlist</li>
              <li>Get early access to Waza when we launch in Q2 2026</li>
              <li>Receive development updates and feature previews</li>
            </ul>
          </div>
          
          <div style="text-align: center; padding: 20px 0; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">
              If you didn't request this verification code, please ignore this email.
            </p>
            <p style="color: #9ca3af; margin: 10px 0 0 0; font-size: 12px;">
              © 2025 Waza. All rights reserved.
            </p>
          </div>
        </div>
      `
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Verification email sent:', info.messageId)
    return true
  } catch (error) {
    console.error('Error sending verification email:', error)
    return false
  }
}

export async function sendWelcomeEmail(email: string, fullName: string): Promise<boolean> {
  try {
    const mailOptions = {
      from: '"Waza Team" <waza_bot@GND.VIN>',
      to: email,
      subject: 'Welcome to the Waza Waitlist! 🚀',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3b82f6; margin: 0; font-size: 28px;">Waza</h1>
            <p style="color: #6b7280; margin: 10px 0 0 0;">AI Design Partner for Hardware Engineers</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <h2 style="color: white; margin: 0 0 15px 0; font-size: 24px;">Welcome to the Waitlist!</h2>
            <p style="color: #d1fae5; margin: 0; font-size: 16px;">
              Hi ${fullName}, thank you for joining our exclusive waitlist. You're now part of the hardware engineering revolution!
            </p>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">What happens next?</h3>
            <ul style="color: #6b7280; margin: 0; padding-left: 20px; line-height: 1.6;">
              <li><strong>Regular Updates:</strong> We'll keep you informed about our progress with development updates and feature previews</li>
              <li><strong>Early Access:</strong> You'll be among the first to get access to Waza when we launch in Q2 2026</li>
              <li><strong>Beta Testing:</strong> Get exclusive opportunities to test new features before general availability</li>
              <li><strong>Community:</strong> Connect with fellow hardware engineers in our private community</li>
            </ul>
          </div>
          
          <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">Waza's Core Features</h3>
            <div style="display: grid; gap: 15px;">
              <div style="display: flex; align-items: flex-start; gap: 10px;">
                <div style="color: #ef4444; font-size: 18px;">⚠️</div>
                <div>
                  <strong style="color: #374151;">Obsolete Chip Detection</strong>
                  <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">Never get caught off guard by component obsolescence again</p>
                </div>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 10px;">
                <div style="color: #3b82f6; font-size: 18px;">🤖</div>
                <div>
                  <strong style="color: #374151;">Smart Chip Recommendations</strong>
                  <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">AI-powered suggestions for optimal component replacements</p>
                </div>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 10px;">
                <div style="color: #10b981; font-size: 18px;">🔍</div>
                <div>
                  <strong style="color: #374151;">Intelligent Supplier Search</strong>
                  <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">Find the best suppliers with real-time pricing and availability</p>
                </div>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px 0; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 16px;">
              Questions? Reply to this email or contact us anytime.
            </p>
            <p style="color: #9ca3af; margin: 0; font-size: 12px;">
              © 2025 Waza. All rights reserved.
            </p>
          </div>
        </div>
      `
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Welcome email sent:', info.messageId)
    return true
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return false
  }
}