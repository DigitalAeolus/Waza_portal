'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

import { Menu, X, Zap } from 'lucide-react'

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-md border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Waza</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-foreground/80 hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/features" className="text-foreground/80 hover:text-primary transition-colors">
              Features
            </Link>
            <Button asChild className="tech-glow">
              <Link href="/waitlist">Join Waitlist</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleMenu}
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t border-border">
              <Link
                href="/"
                className="block px-3 py-2 text-foreground/80 hover:text-primary transition-colors"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link
                href="/features"
                className="block px-3 py-2 text-foreground/80 hover:text-primary transition-colors"
                onClick={toggleMenu}
              >
                Features
              </Link>
              <Link
                href="/waitlist"
                className="block px-3 py-2 text-foreground/80 hover:text-primary transition-colors"
                onClick={toggleMenu}
              >
                Waitlist
              </Link>
              <div className="px-3 py-2">
                <Button asChild className="w-full tech-glow">
                  <Link href="/waitlist">Join Waitlist</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}