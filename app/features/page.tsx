import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { 
  AlertTriangle, 
  Cpu, 
  Search, 
  ArrowRight, 
  CheckCircle, 
  Database,
  Zap,
  TrendingUp,
  Shield,
  Clock,
  DollarSign,
  Users
} from 'lucide-react'

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-secondary relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '1s'}}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-fade-in">
              Powerful AI Features for{' '}
              <span className="gradient-text">Hardware Engineers</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-slide-up">
              Discover how Waza&apos;s advanced AI capabilities can transform your hardware design process with intelligent automation and expert insights.
            </p>
            <Button asChild variant="gradient" size="lg" className="text-lg px-8 py-6 animate-bounce-in hover:scale-105 transition-transform">
              <Link href="/waitlist">
                Get Early Access <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature 1: Obsolete Chip Detection */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center mr-4">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">Obsolete Chip Detection</h2>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                Never get caught off guard by component obsolescence again. Our AI continuously monitors your designs and alerts you to potential issues before they become problems.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div className="animate-slide-in-left">
                    <h3 className="font-semibold text-foreground">Real-time Monitoring</h3>
                    <p className="text-muted-foreground">Continuous scanning of component databases for lifecycle updates</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground">Predictive Alerts</h3>
                    <p className="text-muted-foreground">Get notified up to 2 years before end-of-life announcements</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground">Risk Assessment</h3>
                    <p className="text-muted-foreground">Comprehensive scoring system to prioritize replacements</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-muted/30 rounded-2xl p-8 animate-slide-in-right">
              <img 
                src="https://placehold.co/500x300/f3f4f6/6b7280?text=Obsolete+Chip+Detection+Dashboard" 
                alt="Obsolete Chip Detection Dashboard"
                className="w-full rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2: Smart Recommendations */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-background rounded-2xl p-8 animate-slide-in-left">
                <img 
                  src="https://placehold.co/500x300/ffffff/3b82f6?text=Smart+Recommendations+Engine" 
                  alt="Smart Recommendations Engine"
                  className="w-full rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2 animate-slide-in-right">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mr-4">
                  <Cpu className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">Smart Chip Recommendations</h2>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                Our AI analyzes millions of components to suggest the perfect replacements that match your performance, cost, and compatibility requirements.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground">Performance Matching</h3>
                    <p className="text-muted-foreground">Advanced algorithms ensure electrical and thermal compatibility</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <DollarSign className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Cost Optimization</h3>
                    <p className="text-gray-600">Balance performance requirements with budget constraints</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Future-Proofing</h3>
                    <p className="text-gray-600">Recommendations consider long-term availability and roadmaps</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 3: Supplier Search */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mr-4">
                  <Search className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">Intelligent Supplier Search</h2>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                Connect with the best suppliers worldwide. Our AI analyzes pricing, availability, and reliability to help you make informed procurement decisions.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <Database className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Global Database</h3>
                    <p className="text-gray-600">Access to thousands of verified suppliers and distributors</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Real-time Inventory</h3>
                    <p className="text-gray-600">Live stock levels and delivery time estimates</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Price Intelligence</h3>
                    <p className="text-gray-600">Historical pricing data and market trend analysis</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-muted/30 rounded-2xl p-8 animate-slide-in-right">
              <img 
                src="https://placehold.co/500x300/f3f4f6/059669?text=Supplier+Search+Results" 
                alt="Supplier Search Results"
                className="w-full rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Technical Specifications
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built on cutting-edge AI technology with enterprise-grade security and reliability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover-lift card-gradient animate-scale-in">
              <CardHeader className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">AI Engine</h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Machine learning algorithms</li>
                  <li>• Natural language processing</li>
                  <li>• Predictive analytics</li>
                  <li>• Pattern recognition</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover-lift card-gradient animate-scale-in">
              <CardHeader className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Data Sources</h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 50M+ component database</li>
                  <li>• Real-time market data</li>
                  <li>• Manufacturer notifications</li>
                  <li>• Industry standards</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover-lift card-gradient animate-scale-in">
              <CardHeader className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Security</h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• End-to-end encryption</li>
                  <li>• SOC 2 Type II compliance</li>
                  <li>• GDPR compliant</li>
                  <li>• Regular security audits</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Real-World Use Cases
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how Waza helps engineers across different industries and applications.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover-lift tech-border p-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Cpu className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Consumer Electronics</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Manage component lifecycles for high-volume consumer products with tight cost constraints.
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Smartphone and tablet designs</li>
                <li>• Wearable devices</li>
                <li>• Home appliances</li>
                <li>• Gaming consoles</li>
              </ul>
            </Card>

            <Card className="hover-lift tech-border p-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Industrial Systems</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Ensure long-term availability for industrial equipment with extended lifecycles.
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Manufacturing equipment</li>
                <li>• Medical devices</li>
                <li>• Aerospace systems</li>
                <li>• Automotive electronics</li>
              </ul>
            </Card>

            <Card className="hover-lift tech-border p-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">IoT & Edge Computing</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Optimize power consumption and connectivity for IoT deployments.
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Smart city infrastructure</li>
                <li>• Connected vehicles</li>
                <li>• Industrial IoT sensors</li>
                <li>• Edge AI devices</li>
              </ul>
            </Card>

            <Card className="hover-lift tech-border p-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Startups & Prototyping</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Accelerate product development with intelligent component selection.
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Rapid prototyping</li>
                <li>• MVP development</li>
                <li>• Design validation</li>
                <li>• Cost optimization</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience the Future of Hardware Design?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of engineers who are already on the waitlist for early access to Waza&apos;s revolutionary AI capabilities.
          </p>
          <Button asChild variant="secondary" size="lg" className="text-lg px-8 py-6">
            <Link href="/waitlist">
              Join the Waitlist <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}