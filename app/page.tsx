'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { FeatureCard } from '@/components/features/feature-card'
import { getWaitlistCookie, type WaitlistUser } from '@/lib/cookies'
import { 
  Search, 
  AlertTriangle, 
  Cpu, 
  ArrowRight, 
  Zap, 
  CheckCircle,
  Users,
  Clock,
  UserCheck
} from 'lucide-react'

export default function HomePage() {
  const [waitlistUser, setWaitlistUser] = React.useState<WaitlistUser | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    // Check if user is in waitlist
    const user = getWaitlistCookie()
    setWaitlistUser(user)
    setIsLoading(false)
  }, [])
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-secondary relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '1s'}}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center tech-glow animate-bounce-in animate-float">
                <Zap className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
              Meet{' '}
              <span className="gradient-text">Waza</span>
              <br />
              Your AI Design Partner
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-slide-up">
              Revolutionary AI-powered assistant for hardware engineers. 
              Detect obsolete chips, get smart recommendations, and find the best suppliers – all in one intelligent platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
              {!isLoading && (
                waitlistUser ? (
                  // User is already on waitlist
                  <div className="flex flex-col items-center space-y-4">
                    <div className="flex items-center space-x-3 px-6 py-3 bg-green-50 border border-green-200 rounded-full">
                      <UserCheck className="w-5 h-5 text-green-600" />
                      <span className="text-green-800 font-medium">
                        Welcome back, {waitlistUser.fullName}! You're on the waitlist.
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      We'll notify you at {waitlistUser.email} when Waza is ready.
                    </p>
                  </div>
                ) : (
                  // User not on waitlist
                  <>
                    <Button asChild variant="gradient" size="lg" className="text-lg px-8 py-6">
                      <Link href="/waitlist">
                        Join Waitlist <ArrowRight className="ml-2 w-5 h-5" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                      <Link href="/features">
                        Learn More
                      </Link>
                    </Button>
                  </>
                )
              )}
            </div>
            
            <div className="mt-12 flex justify-center items-center space-x-6 text-sm text-muted-foreground animate-fade-in">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                <span>1,000+ Engineers interested</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-16 bg-background relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5 bg-grid-pattern"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Three Core AI Capabilities
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Waza combines advanced AI with deep hardware knowledge to solve your most pressing design challenges.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="animate-slide-in-left" style={{animationDelay: '0.1s'}}>
              <FeatureCard
                icon={AlertTriangle}
                title="Obsolete Chip Detection"
                description="Automatically identify outdated and end-of-life components in your designs"
                features={[
                  "Real-time database scanning",
                  "End-of-life notifications",
                  "Risk assessment scoring",
                  "Compliance checking"
                ]}
              />
            </div>
            
            <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
              <FeatureCard
                icon={Cpu}
                title="Smart Chip Recommendations"
                description="Get AI-powered suggestions for optimal component replacements"
                features={[
                  "Performance matching",
                  "Cost optimization",
                  "Compatibility analysis",
                  "Future-proofing insights"
                ]}
              />
            </div>
            
            <div className="animate-slide-in-right" style={{animationDelay: '0.3s'}}>
              <FeatureCard
                icon={Search}
                title="Intelligent Supplier Search"
                description="Find the best suppliers with real-time pricing and availability"
                features={[
                  "Multi-supplier comparison",
                  "Live inventory tracking",
                  "Price optimization",
                  "Delivery time analysis"
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/30 relative">
        {/* Background accent */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-gradient-to-br from-green-400 to-blue-400 rounded-full blur-2xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Why Hardware Engineers Choose Waza
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center animate-slide-in-left hover-lift">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Reduce Design Risk</h3>
              <p className="text-muted-foreground">Avoid costly redesigns with proactive obsolescence detection</p>
            </div>
            
            <div className="text-center animate-slide-in-left hover-lift" style={{animationDelay: '0.1s'}}>
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Save Time</h3>
              <p className="text-muted-foreground">Automated research and recommendations speed up your workflow</p>
            </div>
            
            <div className="text-center animate-slide-in-right hover-lift" style={{animationDelay: '0.2s'}}>
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Cpu className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Optimize Performance</h3>
              <p className="text-muted-foreground">AI-driven component matching for better design outcomes</p>
            </div>
            
            <div className="text-center animate-slide-in-right hover-lift" style={{animationDelay: '0.3s'}}>
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Expert Insights</h3>
              <p className="text-muted-foreground">Access to comprehensive hardware knowledge and trends</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 animate-slide-up">
            Ready to Transform Your Design Process?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.2s'}}>
            Join thousands of hardware engineers who are already signed up for early access to Waza.
          </p>
          <div className="animate-bounce-in" style={{animationDelay: '0.4s'}}>
            <Button asChild variant="secondary" size="lg" className="text-lg px-8 py-6">
              <Link href="/waitlist">
                Join the Waitlist <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}