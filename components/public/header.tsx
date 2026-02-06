/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X, Phone, Mail } from 'lucide-react'
import HopHeader from './top-header'
import Logo from '../shared/logo'
import { useAllSettings } from '@/api/settings'

export default function PublicHeader() {
  const { data, isLoading, isError } = useAllSettings()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Extract contact info from settings
  const contactInfo = data?.data?.find((setting: any) => setting.key === 'contact_info')?.value || [];

  // Find specific contact items
  const phoneInfo = contactInfo.find((item: any) => item.icon === 'Phone');
  const emailInfo = contactInfo.find((item: any) => item.icon === 'Mail');

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  return (
    <>
      {/* Top Bar */}
      <HopHeader data={data} isLoading={isLoading} isError={isError} />

      {/* Main Header */}
      <header className="container border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto py-3 px-4 lg:px-0">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href="/"
                className={`relative px-4 py-2 text-sm font-medium transition-all rounded-lg group ${isActive('/')
                  ? 'text-primary bg-primary/10'
                  : 'text-foreground hover:text-primary hover:bg-accent'
                  }`}
              >
                Home
                {isActive('/') && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                )}
              </Link>

              <Link
                href="/services"
                className={`relative px-4 py-2 text-sm font-medium transition-all rounded-lg group ${isActive('/services')
                  ? 'text-primary bg-primary/10'
                  : 'text-foreground hover:text-primary hover:bg-accent'
                  }`}
              >
                Services
                {isActive('/services') && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                )}
              </Link>

              {/* <Link
                href="/pricing"
                className={`relative px-4 py-2 text-sm font-medium transition-all rounded-lg ${isActive('/pricing')
                  ? 'text-primary bg-primary/10'
                  : 'text-foreground hover:text-primary hover:bg-accent'
                  }`}
              >
                Pricing
                {isActive('/pricing') && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                )}
              </Link> */}

              <Link
                href="/blog"
                className={`relative px-4 py-2 text-sm font-medium transition-all rounded-lg ${isActive('/blog')
                  ? 'text-primary bg-primary/10'
                  : 'text-foreground hover:text-primary hover:bg-accent'
                  }`}
              >
                Blog
                {isActive('/blog') && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
              <Link
                href="/about"
                className={`relative px-4 py-2 text-sm font-medium transition-all rounded-lg ${isActive('/about')
                  ? 'text-primary bg-primary/10'
                  : 'text-foreground hover:text-primary hover:bg-accent'
                  }`}
              >
                About
                {isActive('/about') && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
              <Link
                href="/contact"
                className={`relative px-4 py-2 text-sm font-medium transition-all rounded-lg ${isActive('/contact')
                  ? 'text-primary bg-primary/10'
                  : 'text-foreground hover:text-primary hover:bg-accent'
                  }`}
              >
                Contact
                {isActive('/contact') && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/client/login">
                <Button
                  size="default"
                  className="bg-gradient-to-r from-primary to-blue-700 shadow-md hover:shadow-lg transition-all hover:scale-105"
                >
                  Client Portal
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-foreground hover:bg-accent rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div >

        {/* Mobile Menu */}
        {
          mobileMenuOpen && (
            <div className="lg:hidden border-t bg-card animate-in slide-in-from-top duration-200">
              <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
                <Link
                  href="/"
                  className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all ${isActive('/')
                    ? 'text-primary bg-primary/10 border-l-2 border-primary'
                    : 'text-foreground hover:bg-accent hover:text-primary'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>

                <Link
                  href="/services"
                  className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all ${isActive('/services')
                    ? 'text-primary bg-primary/10 border-l-2 border-primary'
                    : 'text-foreground hover:bg-accent hover:text-primary'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Services
                </Link>
                {/* 
                <Link
                  href="/pricing"
                  className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all ${isActive('/pricing')
                    ? 'text-primary bg-primary/10 border-l-2 border-primary'
                    : 'text-foreground hover:bg-accent hover:text-primary'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </Link> */}

                <Link
                  href="/blog"
                  className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all ${isActive('/blog')
                    ? 'text-primary bg-primary/10 border-l-2 border-primary'
                    : 'text-foreground hover:bg-accent hover:text-primary'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link
                  href="/about"
                  className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all ${isActive('/about')
                    ? 'text-primary bg-primary/10 border-l-2 border-primary'
                    : 'text-foreground hover:bg-accent hover:text-primary'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all ${isActive('/contact')
                    ? 'text-primary bg-primary/10 border-l-2 border-primary'
                    : 'text-foreground hover:bg-accent hover:text-primary'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>

                {/* Mobile Actions */}
                <div className="pt-4 space-y-2 border-t">
                  <Link href="/client/login" className="block">
                    <Button
                      variant="outline"
                      size="default"
                      className="w-full hover:bg-accent hover:text-primary hover:border-primary transition-all"
                    >
                      Client Portal
                    </Button>
                  </Link>
                  {/* <Link href="/admin/login" className="block">
                    <Button
                      size="default"
                      className="w-full bg-gradient-to-r from-primary to-blue-700 hover:shadow-lg transition-all"
                    >
                      Admin Login
                    </Button>
                  </Link> */}
                </div>

                {/* Mobile Contact Info */}
                <div className="pt-4 space-y-2 border-t">
                  {phoneInfo && phoneInfo.details?.[0] && (
                    <a
                      href={phoneInfo.link || `tel:${phoneInfo.details[0].replace(/\D/g, '')}`}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-accent rounded-lg transition-all"
                    >
                      <Phone className="h-4 w-4" />
                      <span className="font-medium">{phoneInfo.details[0]}</span>
                    </a>
                  )}
                  {emailInfo && emailInfo.details?.[0] && (
                    <a
                      href={emailInfo.link || `mailto:${emailInfo.details[0]}`}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-accent rounded-lg transition-all"
                    >
                      <Mail className="h-4 w-4" />
                      <span className="font-medium">{emailInfo.details[0]}</span>
                    </a>
                  )}

                </div>
              </nav>
            </div>
          )
        }
      </header >
    </>
  )
}