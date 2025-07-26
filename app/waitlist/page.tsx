import React from 'react'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { MultiStepWaitlistForm } from '@/components/waitlist/multi-step-form'
import { CheckCircle, Users, Clock, Zap } from 'lucide-react'

export default function WaitlistPage() {
  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '1s'}}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center tech-glow animate-bounce-in">
                <Zap className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-fade-in">
              Join the{' '}
              <span className="gradient-text">Waza</span>
              {' '}Waitlist
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up">
              Be among the first to experience revolutionary AI-powered hardware design assistance. 
              Get early access and help shape the future of chip selection and component optimization.
            </p>

            {/* Stats */}
            <div className="flex justify-center items-center space-x-8 mb-12 animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-2xl font-bold text-blue-600">
                  <Users className="w-6 h-6" />
                  <span>1,200+</span>
                </div>
                <p className="text-sm text-muted-foreground">Engineers joined</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-2xl font-bold text-purple-600">
                  <Clock className="w-6 h-6" />
                  <span>Q2 2026</span>
                </div>
                <p className="text-sm text-muted-foreground">Expected launch</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <MultiStepWaitlistForm />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Join the Waitlist?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get exclusive benefits and be part of the hardware design revolution.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 animate-slide-in-left hover-lift">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Early Access</h3>
              <p className="text-muted-foreground">
                Be the first to use Waza&apos;s AI-powered features before general availability.
              </p>
            </div>

            <div className="text-center p-6 animate-slide-up hover-lift" style={{animationDelay: '0.1s'}}>
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Exclusive Community</h3>
              <p className="text-muted-foreground">
                Connect with fellow hardware engineers and share insights in our private community.
              </p>
            </div>

            <div className="text-center p-6 animate-slide-in-right hover-lift" style={{animationDelay: '0.2s'}}>
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Special Pricing</h3>
              <p className="text-muted-foreground">
                Get exclusive discounts and special pricing when Waza officially launches.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}