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
import { ArrowRight, User, Mail, Building, MapPin, MessageSquare } from 'lucide-react'

const waitlistSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  jobTitle: z.string().min(2, 'Job title must be at least 2 characters'),
  industry: z.string().min(1, 'Please select an industry'),
  companySizeRange: z.string().min(1, 'Please select company size'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  primaryChallenge: z.string().min(10, 'Please describe your primary challenge (at least 10 characters)'),
  interestedFeatures: z.array(z.string()).min(1, 'Please select at least one feature'),
  designExperience: z.string().min(1, 'Please select your experience level'),
  newsletter: z.boolean().default(false),
  earlyAccess: z.boolean().default(false),
})

type WaitlistFormData = z.infer<typeof waitlistSchema>

export function WaitlistForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  
  const form = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      fullName: '',
      email: '',
      company: '',
      jobTitle: '',
      industry: '',
      companySizeRange: '',
      location: '',
      primaryChallenge: '',
      interestedFeatures: [],
      designExperience: '',
      newsletter: false,
      earlyAccess: false,
    }
  })

  const onSubmit = async (data: WaitlistFormData) => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Store form data in localStorage for the confirmation page
      localStorage.setItem('waitlistData', JSON.stringify(data))
      
      // Redirect to confirmation page
      router.push('/waitlist/confirmation')
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFeatureChange = (feature: string, checked: boolean) => {
    const currentFeatures = form.getValues('interestedFeatures')
    if (checked) {
      form.setValue('interestedFeatures', [...currentFeatures, feature])
    } else {
      form.setValue('interestedFeatures', currentFeatures.filter(f => f !== feature))
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto tech-border">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold gradient-text">Join the Waza Waitlist</CardTitle>
        <p className="text-gray-600 mt-2">
          Be among the first to experience the future of hardware design with AI-powered assistance.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName" className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                Full Name *
              </Label>
              <Input
                id="fullName"
                {...form.register('fullName')}
                placeholder="Enter your full name"
                className="mt-1"
              />
              {form.formState.errors.fullName && (
                <p className="text-red-600 text-sm mt-1">{form.formState.errors.fullName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                {...form.register('email')}
                placeholder="Enter your email"
                className="mt-1"
              />
              {form.formState.errors.email && (
                <p className="text-red-600 text-sm mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Professional Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company" className="flex items-center">
                <Building className="w-4 h-4 mr-2" />
                Company *
              </Label>
              <Input
                id="company"
                {...form.register('company')}
                placeholder="Enter your company name"
                className="mt-1"
              />
              {form.formState.errors.company && (
                <p className="text-red-600 text-sm mt-1">{form.formState.errors.company.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="jobTitle">Job Title *</Label>
              <Input
                id="jobTitle"
                {...form.register('jobTitle')}
                placeholder="e.g., Hardware Engineer"
                className="mt-1"
              />
              {form.formState.errors.jobTitle && (
                <p className="text-red-600 text-sm mt-1">{form.formState.errors.jobTitle.message}</p>
              )}
            </div>
          </div>

          {/* Industry and Company Size */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="industry">Industry *</Label>
              <Select onValueChange={(value) => form.setValue('industry', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select industry" />
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
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.industry && (
                <p className="text-red-600 text-sm mt-1">{form.formState.errors.industry.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="companySizeRange">Company Size *</Label>
              <Select onValueChange={(value) => form.setValue('companySizeRange', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="201-1000">201-1000 employees</SelectItem>
                  <SelectItem value="1000+">1000+ employees</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.companySizeRange && (
                <p className="text-red-600 text-sm mt-1">{form.formState.errors.companySizeRange.message}</p>
              )}
            </div>
          </div>

          {/* Location and Experience */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location" className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Location *
              </Label>
              <Input
                id="location"
                {...form.register('location')}
                placeholder="e.g., San Francisco, CA, USA"
                className="mt-1"
              />
              {form.formState.errors.location && (
                <p className="text-red-600 text-sm mt-1">{form.formState.errors.location.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="designExperience">Design Experience *</Label>
              <Select onValueChange={(value) => form.setValue('designExperience', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-2">0-2 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="6-10">6-10 years</SelectItem>
                  <SelectItem value="11-15">11-15 years</SelectItem>
                  <SelectItem value="15+">15+ years</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.designExperience && (
                <p className="text-red-600 text-sm mt-1">{form.formState.errors.designExperience.message}</p>
              )}
            </div>
          </div>

          {/* Primary Challenge */}
          <div>
            <Label htmlFor="primaryChallenge" className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Primary Challenge *
            </Label>
            <Textarea
              id="primaryChallenge"
              {...form.register('primaryChallenge')}
              placeholder="What's your biggest challenge with hardware design and component selection?"
              className="mt-1 min-h-[100px]"
            />
            {form.formState.errors.primaryChallenge && (
              <p className="text-red-600 text-sm mt-1">{form.formState.errors.primaryChallenge.message}</p>
            )}
          </div>

          {/* Interested Features */}
          <div>
            <Label className="text-base font-medium">Most Interested Features *</Label>
            <div className="mt-2 space-y-2">
              {[
                'Obsolete chip detection',
                'Smart chip recommendations',
                'Supplier search and comparison',
                'Real-time inventory tracking',
                'Cost optimization',
                'Compliance checking'
              ].map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    onCheckedChange={(checked) => handleFeatureChange(feature, checked as boolean)}
                  />
                  <Label htmlFor={feature} className="text-sm font-normal">
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
            {form.formState.errors.interestedFeatures && (
              <p className="text-red-600 text-sm mt-1">{form.formState.errors.interestedFeatures.message}</p>
            )}
          </div>

          {/* Preferences */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Controller
                name="newsletter"
                control={form.control}
                render={({ field }) => (
                  <Checkbox
                    id="newsletter"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="newsletter" className="text-sm">
                Subscribe to our newsletter for updates and hardware engineering insights
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Controller
                name="earlyAccess"
                control={form.control}
                render={({ field }) => (
                  <Checkbox
                    id="earlyAccess"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="earlyAccess" className="text-sm">
                I&apos;m interested in early access and beta testing opportunities
              </Label>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            variant="gradient" 
            size="lg" 
            className="w-full text-lg py-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Joining Waitlist...' : 'Join Waitlist'}
            {!isSubmitting && <ArrowRight className="ml-2 w-5 h-5" />}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}