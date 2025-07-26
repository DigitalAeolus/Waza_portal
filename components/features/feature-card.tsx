import React from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  features: string[]
  className?: string
}

export function FeatureCard({ icon: Icon, title, description, features, className }: FeatureCardProps) {
  return (
    <Card className={`hover-lift card-gradient h-full animate-scale-in ${className}`}>
      <CardHeader className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        <p className="text-muted-foreground mt-2">{description}</p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}