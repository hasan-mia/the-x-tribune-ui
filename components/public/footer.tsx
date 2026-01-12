"use client";

import Link from 'next/link'
import { Mail, Phone, MapPin, ArrowRight, Facebook, Twitter, Linkedin, Instagram, Clock } from 'lucide-react'
import Logo from '../shared/logo'
import { useAllSettings } from '@/api/settings';
import { useGeAllService } from '@/api/service';
import FooterSkeleton from '../shared/skelton/footer-skeleton';

export default function PublicFooter() {
  const { data: servicesData, isLoading: servicesLoading } = useGeAllService()
  const { data: settingsData, isLoading: settingsLoading } = useAllSettings()

  // Show skeleton while loading
  if (servicesLoading || settingsLoading) {
    return <FooterSkeleton />;
  }

  // Extract settings
  const settings = settingsData?.data || [];
  const services = servicesData?.data?.slice(0, 4) || [];

  // Get contact info
  const contactInfo = settings.find((setting: any) => setting.key === 'contact_info')?.value || [];

  // Get logo info
  const logoInfo = settings.find((setting: any) => setting.key === 'logo')?.value || {};
  const companyName = logoInfo.name || 'Beyond Tax Consultants';

  // Get about info
  const aboutInfo = settings.find((setting: any) => setting.key === 'about_us')?.value || {};

  console.log(aboutInfo)

  // Find specific contact items
  const addressInfo = contactInfo.find((item: any) => item.icon === 'MapPin');
  const phoneInfo = contactInfo.find((item: any) => item.icon === 'Phone');
  const emailInfo = contactInfo.find((item: any) => item.icon === 'Mail');
  const hoursInfo = contactInfo.find((item: any) => item.icon === 'Clock');

  // Get featured services (limit to 6)
  const featuredServices = services.filter((service: any) => service.is_active).slice(0, 6);

  return (
    <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-slate-200 mt-20">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Logo color="text-white" />
            <p className="text-sm text-slate-400 mb-6 leading-relaxed mt-4 line-clamp-6">
              {aboutInfo?.description || 'We are committed to providing top-notch accounting and consulting services to help your business thrive in today\'s competitive market.'}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-slate-300" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-slate-800 hover:bg-sky-500 flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 text-slate-300" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-slate-800 hover:bg-blue-700 flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-slate-300" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-slate-800 hover:bg-pink-600 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-slate-300" />
              </a>
            </div>
          </div>

          {/* Services - Dynamic */}
          <div>
            <h4 className="font-bold text-white text-lg mb-6">Our Services</h4>
            <ul className="space-y-3">
              {featuredServices.length > 0 ? (
                featuredServices.map((service: any) => (
                  <li key={service.id}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-sm text-slate-400 hover:text-blue-400 transition-colors flex items-center group"
                    >
                      <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                      <span className="group-hover:translate-x-1 transition-transform">{service.title}</span>
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link href="/services/tax-planning" className="text-sm text-slate-400 hover:text-blue-400 transition-colors flex items-center group">
                      <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                      <span className="group-hover:translate-x-1 transition-transform">Tax Planning & Preparation</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/bookkeeping" className="text-sm text-slate-400 hover:text-blue-400 transition-colors flex items-center group">
                      <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                      <span className="group-hover:translate-x-1 transition-transform">Bookkeeping & Accounting</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/audit" className="text-sm text-slate-400 hover:text-blue-400 transition-colors flex items-center group">
                      <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                      <span className="group-hover:translate-x-1 transition-transform">Audit & Assurance</span>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/blog" className="text-sm text-slate-400 hover:text-blue-400 transition-colors flex items-center group">
                  <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                  <span className="group-hover:translate-x-1 transition-transform">Blog & Resources</span>
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-slate-400 hover:text-blue-400 transition-colors flex items-center group">
                  <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                  <span className="group-hover:translate-x-1 transition-transform">FAQ</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-slate-400 hover:text-blue-400 transition-colors flex items-center group">
                  <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                  <span className="group-hover:translate-x-1 transition-transform">About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-slate-400 hover:text-blue-400 transition-colors flex items-center group">
                  <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                  <span className="group-hover:translate-x-1 transition-transform">Contact Us</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info - Dynamic */}
          <div>
            <h4 className="font-bold text-white text-lg mb-6">Get In Touch</h4>
            <ul className="space-y-4">
              {/* Address */}
              {addressInfo && addressInfo.details && (
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-400 mt-0.5 shrink-0" />
                  <div className="text-sm text-slate-400">
                    {addressInfo.details.map((line: string, index: number) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </li>
              )}

              {/* Phone */}
              {phoneInfo && phoneInfo.details && (
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-blue-400 mt-0.5 shrink-0" />
                  <div className="text-sm text-slate-400">
                    {phoneInfo.details.map((phone: string, index: number) => (
                      <a
                        key={index}
                        href={index === 0 ? phoneInfo.link : undefined}
                        className="block hover:text-blue-400 transition-colors"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </li>
              )}

              {/* Email */}
              {emailInfo && emailInfo.details && (
                <li className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-400 mt-0.5 shrink-0" />
                  <div className="text-sm text-slate-400">
                    {emailInfo.details.map((email: string, index: number) => (
                      <a
                        key={index}
                        href={`mailto:${email}`}
                        className="block hover:text-blue-400 transition-colors"
                      >
                        {email}
                      </a>
                    ))}
                  </div>
                </li>
              )}
            </ul>

            {/* Business Hours */}
            {hoursInfo && hoursInfo.details && (
              <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <p className="text-xs text-slate-400 font-medium">{hoursInfo.title}</p>
                </div>
                {hoursInfo.details.map((hours: string, index: number) => (
                  <p key={index} className="text-sm text-slate-300">{hours}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400 text-center md:text-left">
              &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy-policy" className="text-slate-400 hover:text-blue-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-slate-400 hover:text-blue-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/sitemap.xml" target='_blank' className="text-slate-400 hover:text-blue-400 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}