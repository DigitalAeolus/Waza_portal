'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function FeatureLoading() {
  return (
    <Card className="hover-lift">
      <CardContent className="p-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="space-y-2 w-full">
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6 mx-auto" />
          </div>
          <div className="w-full space-y-2 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function FeatureLoadingGrid() {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div 
          key={i} 
          className="animate-fade-in" 
          style={{animationDelay: `${i * 0.1}s`}}
        >
          <FeatureLoading />
        </div>
      ))}
    </div>
  )
}