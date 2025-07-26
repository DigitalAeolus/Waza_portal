'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { 
  CheckCircle, 
  Mail, 
  Calendar, 
  Users, 
  ArrowRight, 
  Twitter,
  Linkedin,

} from 'lucide-react'

export default function ConfirmationPage() {
  const [userEmail, setUserEmail] = React.useState('')
  const [userName, setUserName] = React.useState('')

  React.useEffect(() => {
    // Get user data from localStorage
    const waitlistData = localStorage.getItem('waitlistData')
    if (waitlistData) {
      const data = JSON.parse(waitlistData)
      setUserEmail(data.email)
      setUserName(data.fullName)
    }
  }, [])

  const handleShare = (platform: 'twitter' | 'linkedin') => {
    const text = "I just joined the Waza waitlist! 🚀 Revolutionary AI-powered design partner for hardware engineers. Join me: "
    const url = window.location.origin + "/waitlist"
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navigation />
      
      {/* Success Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center animate-bounce-in">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-fade-in">
              Welcome to the{' '}
              <span className="gradient-text">Waza</span>
              {' '}Waitlist!
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 animate-slide-up">
              {userName && `Thank you, ${userName}! `}
              You&apos;ve successfully joined our exclusive waitlist. 
              We&apos;re excited to have you on board for the future of hardware design.
            </p>
          </div>

          {/* Confirmation Card */}
          <Card className="max-w-2xl mx-auto mb-12 card-gradient animate-scale-in">
            <CardHeader className="text-center">
              <h2 className="text-2xl font-bold text-foreground">What happens next?</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Confirmation Email</h3>
                  <p className="text-muted-foreground text-sm">
                    We&apos;ve sent a confirmation email to {userEmail || 'your email address'}. 
                    Please check your inbox and mark it as not spam.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Regular Updates</h3>
                  <p className="text-muted-foreground text-sm">
                    We&apos;ll keep you informed about our progress with development updates, 
                    feature previews, and launch announcements.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Early Access</h3>
                  <p className="text-muted-foreground text-sm">
                    You&apos;ll be among the first to get access to Waza when we launch in Q2 2026, 
                    with exclusive beta testing opportunities.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Share Section */}
          <Card className="max-w-2xl mx-auto mb-12 card-gradient">
            <CardHeader className="text-center">
              <h2 className="text-2xl font-bold text-foreground">Help us spread the word!</h2>
              <p className="text-muted-foreground">
                Share Waza with your fellow hardware engineers and help build our community.
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={() => handleShare('twitter')}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Twitter className="w-4 h-4" />
                  <span>Share on Twitter</span>
                </Button>
                <Button 
                  onClick={() => handleShare('linkedin')}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>Share on LinkedIn</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Explore More
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="gradient" size="lg">
                <Link href="/features">
                  Learn About Features <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/">
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Join a Growing Community
            </h2>
            <p className="text-lg text-muted-foreground">
              You&apos;re now part of a growing community of forward-thinking hardware engineers.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">1,200+</div>
              <p className="text-muted-foreground">Engineers on waitlist</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">50+</div>
              <p className="text-muted-foreground">Companies represented</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">15</div>
              <p className="text-muted-foreground">Industries covered</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">25</div>
              <p className="text-muted-foreground">Countries worldwide</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}