'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, ArrowLeft, User, Mail, Building, MessageSquare, CheckCircle, Shield, Clock, AlertCircle, X } from 'lucide-react'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { setWaitlistCookie } from '@/lib/cookies'

// 分步表单的schema定义
const step1Schema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

const step2Schema = z.object({
  verificationCode: z.string().min(6, 'Verification code must be 6 digits').max(6, 'Verification code must be 6 digits'),
})

const step3Schema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  jobTitle: z.string().min(1, 'Please select a job title'),
  industry: z.string().min(1, 'Please select an industry'),
  companySizeRange: z.string().min(1, 'Please select company size'),
  designExperience: z.string().min(1, 'Please select your experience level'),
  interestedFeatures: z.array(z.string()).min(1, 'Please select at least one feature'),
  whyTryWaza: z.string().optional(),
  newsletter: z.boolean().default(false),
  earlyAccess: z.boolean().default(false),
})

const completeSchema = step1Schema.merge(step2Schema).merge(step3Schema)

type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>
type Step3Data = z.infer<typeof step3Schema>
type CompleteFormData = z.infer<typeof completeSchema>

const JOB_TITLES = [
  'Hardware Engineer',
  'Electronics Engineer',
  'Electrical Engineer',
  'Design Engineer',
  'Systems Engineer',
  'Product Engineer',
  'R&D Engineer',
  'Engineering Manager',
  'Technical Lead',
  'Student',
  'Other'
]

export function MultiStepWaitlistForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [formData, setFormData] = React.useState<Partial<CompleteFormData>>({})
  const [isEmailVerified, setIsEmailVerified] = React.useState(false)
  const [isSendingCode, setIsSendingCode] = React.useState(false)
  const [isVerifyingCode, setIsVerifyingCode] = React.useState(false)
  const [codeError, setCodeError] = React.useState('')
  const [timeLeft, setTimeLeft] = React.useState(0)
  const [userEmail, setUserEmail] = React.useState('')
  const [verificationToken, setVerificationToken] = React.useState('')
  const [submitError, setSubmitError] = React.useState('')
  const [showSubmitError, setShowSubmitError] = React.useState(false)

  // 倒计时效果
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timeLeft])

  // 格式化时间显示
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // 第1步表单 - 邮箱输入
  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      email: formData.email || '',
    }
  })

  // 第2步表单 - 验证码输入
  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      verificationCode: '',
    }
  })

  // 第3步表单 - 完整信息表单
  const step3Form = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      fullName: formData.fullName || '',
      company: formData.company || '',
      jobTitle: formData.jobTitle || '',
      industry: formData.industry || '',
      companySizeRange: formData.companySizeRange || '',
      designExperience: formData.designExperience || '',
      interestedFeatures: formData.interestedFeatures || [],
      whyTryWaza: formData.whyTryWaza || '',
      newsletter: formData.newsletter ?? false,
      earlyAccess: formData.earlyAccess ?? false,
    }
  })

  const handleStep1Submit = async (data: Step1Data) => {
    setUserEmail(data.email)
    setFormData(prev => ({ ...prev, ...data }))
    
    // Send verification code
    setIsSendingCode(true)
    setCodeError('')
    
    try {
      const response = await fetch('/api/email/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      })
      
      if (response.ok) {
        const result = await response.json()
        setTimeLeft(600) // 10分钟倒计时
        setCodeError('')
        
        // 转到验证码步骤
        setIsTransitioning(true)
        setTimeout(() => {
          setCurrentStep(2)
          setIsTransitioning(false)
        }, 150)
      } else {
        const error = await response.json()
        setCodeError(error.error || 'Failed to send verification code')
      }
    } catch (error) {
      setCodeError('Network error. Please try again.')
    } finally {
      setIsSendingCode(false)
    }
  }

  const handleStep2Submit = async (data: Step2Data) => {
    setIsVerifyingCode(true)
    setCodeError('')
    
    try {
      const response = await fetch('/api/email/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail, code: data.verificationCode }),
      })
      
      if (response.ok) {
        const result = await response.json()
        setIsEmailVerified(true)
        setFormData(prev => ({ ...prev, ...data }))
        setCodeError('')
        
        // 存储验证token
        setVerificationToken(result.verificationToken)
        
        // 转到最后一步
        setIsTransitioning(true)
        setTimeout(() => {
          setCurrentStep(3)
          setIsTransitioning(false)
        }, 150)
      } else {
        const error = await response.json()
        setCodeError(error.error || 'Invalid verification code')
      }
    } catch (error) {
      setCodeError('Network error. Please try again.')
    } finally {
      setIsVerifyingCode(false)
    }
  }

  const handleStep3Submit = async (data: Step3Data) => {
    setIsSubmitting(true)
    setShowSubmitError(false)
    setSubmitError('')
    
    try {
      const completeData = { ...formData, ...data, verificationToken }
      
      // Submit to API endpoint
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completeData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Submission failed')
      }
      
      const result = await response.json()
      
      // If API failed, fallback to localStorage
      if (result.fallback) {
        const existingSubmissions = JSON.parse(localStorage.getItem('waitlistSubmissions') || '[]')
        const newSubmission = {
          id: Date.now().toString(),
          ...completeData,
          submittedAt: new Date().toISOString(),
        }
        existingSubmissions.push(newSubmission)
        localStorage.setItem('waitlistSubmissions', JSON.stringify(existingSubmissions))
      }
      
      // Store confirmation page data
      localStorage.setItem('waitlistData', JSON.stringify(completeData))
      
      // Set waitlist cookie
      setWaitlistCookie({
        fullName: completeData.fullName,
        email: completeData.email,
        joinedAt: new Date().toISOString()
      })
      
      // Redirect to confirmation page
      router.push('/waitlist/confirmation')
      
    } catch (error) {
      console.error('Form submission error:', error)
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during submission. Please try again.'
      setSubmitError(errorMessage)
      setShowSubmitError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendCode = async () => {
    if (isSendingCode) return
    
    setIsSendingCode(true)
    setCodeError('')
    
    try {
      const response = await fetch('/api/email/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      })
      
      if (response.ok) {
        const result = await response.json()
        setTimeLeft(600) // 10分钟倒计时
        setCodeError('')
      } else {
        const error = await response.json()
        setCodeError(error.error || 'Failed to send verification code')
      }
    } catch (error) {
      setCodeError('Network error. Please try again.')
    } finally {
      setIsSendingCode(false)
    }
  }

  const handleFeatureChange = (feature: string, checked: boolean, form: ReturnType<typeof useForm<Step3Data>>) => {
    const currentFeatures = form.getValues('interestedFeatures')
    if (checked) {
      form.setValue('interestedFeatures', [...currentFeatures, feature])
    } else {
      form.setValue('interestedFeatures', currentFeatures.filter((f: string) => f !== feature))
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentStep(currentStep - 1)
        setIsTransitioning(false)
      }, 150)
    }
  }

  const progress = (currentStep / 3) * 100

  return (
    <Card className="w-full max-w-2xl mx-auto card-gradient animate-scale-in">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold gradient-text">Join the Waza Waitlist</CardTitle>
        <p className="text-muted-foreground mt-2">
          Be among the first to experience the future of hardware design
        </p>
        <div className="mt-4">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2">Step {currentStep} of 3</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
          
          {/* Step 1: Email Input */}
          {currentStep === 1 && (
            <form onSubmit={step1Form.handleSubmit(handleStep1Submit)} className="space-y-6 animate-slide-in-right">
              <div className="text-center mb-6">
                <Mail className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-bounce-in" />
                <h3 className="text-lg font-semibold text-foreground">Enter Your Email</h3>
                <p className="text-muted-foreground text-sm">We'll send you a verification code</p>
              </div>
              
              <div>
                <Label htmlFor="email" className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...step1Form.register('email')}
                  placeholder="Enter your email address"
                  className="mt-1"
                  autoFocus
                />
                {step1Form.formState.errors.email && (
                  <p className="text-red-600 text-sm mt-1">{step1Form.formState.errors.email.message}</p>
                )}
                {codeError && (
                  <p className="text-red-600 text-sm mt-1">{codeError}</p>
                )}
              </div>

              <Button 
                type="submit" 
                variant="gradient" 
                size="lg" 
                className="w-full text-lg py-6 hover:scale-105 transition-transform"
                disabled={isSendingCode}
              >
                {isSendingCode ? 'Sending Code...' : 'Continue'} <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>
          )}

          {/* Step 2: Verification Code */}
          {currentStep === 2 && (
            <form onSubmit={step2Form.handleSubmit(handleStep2Submit)} className="space-y-6 animate-slide-in-right">
              <div className="text-center mb-6">
                <Shield className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-bounce-in" />
                <h3 className="text-lg font-semibold text-foreground">Verify Your Email</h3>
                <p className="text-muted-foreground text-sm">
                  We sent a 6-digit code to <span className="font-medium">{userEmail}</span>
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="text-center">
                  <Label htmlFor="verificationCode" className="text-base font-medium text-foreground mb-4 block">
                    Enter Verification Code
                  </Label>
                  
                  {/* OTP Input - Centered */}
                  <div className="flex justify-center mb-4">
                    <InputOTP 
                      maxLength={6} 
                      {...step2Form.register('verificationCode')}
                      onChange={(value) => step2Form.setValue('verificationCode', value)}
                      className="gap-2"
                    >
                      <InputOTPGroup className="gap-2">
                        <InputOTPSlot index={0} className="w-12 h-12 text-lg border-2" />
                        <InputOTPSlot index={1} className="w-12 h-12 text-lg border-2" />
                        <InputOTPSlot index={2} className="w-12 h-12 text-lg border-2" />
                        <InputOTPSlot index={3} className="w-12 h-12 text-lg border-2" />
                        <InputOTPSlot index={4} className="w-12 h-12 text-lg border-2" />
                        <InputOTPSlot index={5} className="w-12 h-12 text-lg border-2" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  {/* Timer - Centered below OTP */}
                  {timeLeft > 0 && (
                    <div className="text-muted-foreground text-sm flex items-center justify-center mb-4">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Code expires in {formatTime(timeLeft)}</span>
                    </div>
                  )}
                  
                  {/* Error Messages */}
                  {step2Form.formState.errors.verificationCode && (
                    <p className="text-red-600 text-sm mt-2">{step2Form.formState.errors.verificationCode.message}</p>
                  )}
                  
                  {codeError && (
                    <p className="text-red-600 text-sm mt-2">{codeError}</p>
                  )}

                  {/* Helper Text */}
                  <p className="text-muted-foreground text-xs mt-4">
                    Didn't receive the code? Check your spam folder or
                  </p>
                </div>

                {/* Resend Button - Styled as link */}
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link" 
                    onClick={handleResendCode}
                    disabled={timeLeft > 0 || isSendingCode}
                    className="text-sm text-blue-600 hover:text-blue-800 p-0 h-auto font-medium"
                  >
                    {isSendingCode ? 'Sending...' : timeLeft > 0 ? `resend in ${formatTime(timeLeft)}` : 'resend code'}
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={goToPreviousStep}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Back
                </Button>
                <Button 
                  type="submit" 
                  variant="gradient" 
                  className="flex-1"
                  disabled={isVerifyingCode}
                >
                  {isVerifyingCode ? 'Verifying...' : 'Verify'} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: Complete Information */}
          {currentStep === 3 && (
            <form onSubmit={step3Form.handleSubmit(handleStep3Submit)} className="space-y-6 animate-slide-in-right">
              <div className="text-center mb-6">
                <User className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-bounce-in" />
                <h3 className="text-lg font-semibold text-foreground">Complete Your Profile</h3>
                <p className="text-muted-foreground text-sm">Tell us about yourself and your work</p>
              </div>
              
              {/* Error Message */}
              {showSubmitError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-red-800">Submission Failed</h3>
                      <p className="text-sm text-red-700 mt-1">{submitError}</p>
                    </div>
                    <button
                      onClick={() => setShowSubmitError(false)}
                      className="ml-3 text-red-600 hover:text-red-800 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Personal Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName" className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    {...step3Form.register('fullName')}
                    placeholder="Enter your full name"
                    className="mt-1"
                    autoFocus
                  />
                  {step3Form.formState.errors.fullName && (
                    <p className="text-red-600 text-sm mt-1">{step3Form.formState.errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="company" className="flex items-center">
                    <Building className="w-4 h-4 mr-2" />
                    Company *
                  </Label>
                  <Input
                    id="company"
                    {...step3Form.register('company')}
                    placeholder="Enter your company name"
                    className="mt-1"
                  />
                  {step3Form.formState.errors.company && (
                    <p className="text-red-600 text-sm mt-1">{step3Form.formState.errors.company.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Select onValueChange={(value) => step3Form.setValue('jobTitle', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your job title" />
                    </SelectTrigger>
                    <SelectContent>
                      {JOB_TITLES.map((title) => (
                        <SelectItem key={title} value={title.toLowerCase().replace(/\s+/g, '-')}>
                          {title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {step3Form.formState.errors.jobTitle && (
                    <p className="text-red-600 text-sm mt-1">{step3Form.formState.errors.jobTitle.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="industry">Industry *</Label>
                  <Select onValueChange={(value) => step3Form.setValue('industry', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consumer-electronics">Consumer Electronics</SelectItem>
                      <SelectItem value="automotive">Automotive</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="aerospace">Aerospace</SelectItem>
                      <SelectItem value="medical">Medical Devices</SelectItem>
                      <SelectItem value="telecommunications">Telecommunications</SelectItem>
                      <SelectItem value="energy">Energy & Power</SelectItem>
                      <SelectItem value="defense">Defense & Military</SelectItem>
                      <SelectItem value="iot">IoT & Smart Devices</SelectItem>
                      <SelectItem value="education">Education & Research</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {step3Form.formState.errors.industry && (
                    <p className="text-red-600 text-sm mt-1">{step3Form.formState.errors.industry.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="companySizeRange">Company Size *</Label>
                  <Select onValueChange={(value) => step3Form.setValue('companySizeRange', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-1000">201-1000 employees</SelectItem>
                      <SelectItem value="1001+">1001+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                  {step3Form.formState.errors.companySizeRange && (
                    <p className="text-red-600 text-sm mt-1">{step3Form.formState.errors.companySizeRange.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="designExperience">Hardware Design Experience *</Label>
                  <Select onValueChange={(value) => step3Form.setValue('designExperience', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student/Entry Level</SelectItem>
                      <SelectItem value="1-2-years">1-2 years</SelectItem>
                      <SelectItem value="3-5-years">3-5 years</SelectItem>
                      <SelectItem value="6-10-years">6-10 years</SelectItem>
                      <SelectItem value="10+-years">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                  {step3Form.formState.errors.designExperience && (
                    <p className="text-red-600 text-sm mt-1">{step3Form.formState.errors.designExperience.message}</p>
                  )}
                </div>

                {/* Interested Features */}
                <div>
                  <Label className="text-base font-medium">Which Waza features interest you most? *</Label>
                  <div className="mt-2 space-y-3">
                    {['Obsolete Chip Detection', 'Smart Chip Recommendations', 'Intelligent Supplier Search', 'Design Optimization', 'Compliance Checking'].map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox
                          id={feature}
                          onCheckedChange={(checked) => 
                            handleFeatureChange(feature.toLowerCase().replace(/\s+/g, '-'), checked as boolean, step3Form)
                          }
                        />
                        <Label htmlFor={feature} className="text-sm font-normal">
                          {feature}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {step3Form.formState.errors.interestedFeatures && (
                    <p className="text-red-600 text-sm mt-1">{step3Form.formState.errors.interestedFeatures.message}</p>
                  )}
                </div>

                {/* Optional feedback */}
                <div>
                  <Label htmlFor="whyTryWaza" className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Why are you interested in trying Waza? (Optional)
                  </Label>
                  <Textarea
                    id="whyTryWaza"
                    {...step3Form.register('whyTryWaza')}
                    placeholder="Tell us about your design challenges or what excites you about Waza..."
                    className="mt-1 min-h-[100px]"
                  />
                </div>

                {/* Communication Preferences */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Communication Preferences</Label>
                  
                  <div className="flex items-center space-x-2">
                    <Controller
                      name="newsletter"
                      control={step3Form.control}
                      render={({ field }) => (
                        <Checkbox
                          id="newsletter"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label htmlFor="newsletter" className="text-sm font-normal">
                      Send me updates about Waza's progress and new features
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Controller
                      name="earlyAccess"
                      control={step3Form.control}
                      render={({ field }) => (
                        <Checkbox
                          id="earlyAccess"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label htmlFor="earlyAccess" className="text-sm font-normal">
                      I'm interested in early access and beta testing opportunities
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={goToPreviousStep}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Back
                </Button>
                <Button 
                  type="submit" 
                  variant="gradient" 
                  size="lg"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Join Waitlist'} <CheckCircle className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </form>
          )}
        </div>
      </CardContent>
    </Card>
  )
}