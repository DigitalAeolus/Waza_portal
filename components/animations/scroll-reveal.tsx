'use client'

import { useEffect, useRef, useState } from 'react'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
  threshold?: number
}

export function ScrollReveal({ 
  children, 
  className = '', 
  delay = 0, 
  direction = 'up',
  threshold = 0.1
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay, threshold])

  const getAnimationClass = () => {
    const baseClass = 'transition-all duration-700 ease-out'
    
    if (!isVisible) {
      switch (direction) {
        case 'up':
          return `${baseClass} opacity-0 translate-y-8`
        case 'down':
          return `${baseClass} opacity-0 -translate-y-8`
        case 'left':
          return `${baseClass} opacity-0 translate-x-8`
        case 'right':
          return `${baseClass} opacity-0 -translate-x-8`
        case 'fade':
          return `${baseClass} opacity-0`
        default:
          return `${baseClass} opacity-0 translate-y-8`
      }
    }
    
    return `${baseClass} opacity-100 translate-y-0 translate-x-0`
  }

  return (
    <div ref={ref} className={`${getAnimationClass()} ${className}`}>
      {children}
    </div>
  )
}