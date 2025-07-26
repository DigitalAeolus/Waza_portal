'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: React.ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [pathname])

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-ping border-t-blue-600 dark:border-t-blue-400"></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 animate-pulse">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">
      {children}
    </div>
  )
}