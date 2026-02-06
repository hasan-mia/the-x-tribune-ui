"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Menu, X, Search, Home, ChevronDown } from "lucide-react"

const categories = [
  {
    name: "জাতীয়",
    href: "#",
    subcategories: [
      { name: "রাজনীতি", href: "#" },
      { name: "অপরাধ", href: "#" },
      { name: "আইন-আদালত", href: "#" },
      { name: "শিক্ষা", href: "#" },
      { name: "পরিবেশ", href: "#" },
    ]
  },
  {
    name: "অর্থনীতি",
    href: "#",
    subcategories: [
      { name: "ব্যবসা-বাণিজ্য", href: "#" },
      { name: "শেয়ারবাজার", href: "#" },
      { name: "ব্যাংক", href: "#" },
      { name: "কৃষি", href: "#" },
      { name: "রপ্তানি", href: "#" },
    ]
  },
  {
    name: "রাজনীতি",
    href: "#",
    subcategories: [
      { name: "জাতীয় রাজনীতি", href: "#" },
      { name: "আঞ্চলিক", href: "#" },
      { name: "নির্বাচন", href: "#" },
      { name: "বিবৃতি", href: "#" },
      { name: "মতামত", href: "#" },
    ]
  },
  {
    name: "বিশ্ব",
    href: "#",
    subcategories: [
      { name: "এশিয়া", href: "#" },
      { name: "আমেরিকা", href: "#" },
      { name: "ইউরোপ", href: "#" },
      { name: "মধ্যপ্রাচ্য", href: "#" },
      { name: "আফ্রিকা", href: "#" },
    ]
  },
  {
    name: "খেলাধুলা",
    href: "#",
    subcategories: [
      { name: "ক্রিকেট", href: "#" },
      { name: "ফুটবল", href: "#" },
      { name: "টেনিস", href: "#" },
      { name: "অলিম্পিক", href: "#" },
      { name: "অন্যান্য", href: "#" },
    ]
  },
  {
    name: "বিনোদন",
    href: "#",
    subcategories: [
      { name: "সিনেমা", href: "#" },
      { name: "গান", href: "#" },
      { name: "নাটক", href: "#" },
      { name: "টিভি", href: "#" },
      { name: "সেলিব্রিটি", href: "#" },
    ]
  },
  {
    name: "বিজ্ঞান ও প্রযুক্তি",
    href: "#",
    subcategories: [
      { name: "প্রযুক্তি", href: "#" },
      { name: "বিজ্ঞান", href: "#" },
      { name: "মহাকাশ", href: "#" },
      { name: "স্বাস্থ্য", href: "#" },
      { name: "গ্যাজেট", href: "#" },
    ]
  },
  {
    name: "লাইফস্টাইল",
    href: "#",
    subcategories: [
      { name: "ফ্যাশন", href: "#" },
      { name: "খাদ্য", href: "#" },
      { name: "ভ্রমণ", href: "#" },
      { name: "স্বাস্থ্য", href: "#" },
      { name: "পরিবার", href: "#" },
    ]
  },
  {
    name: "বিশেষ সংবাদ",
    href: "#",
    subcategories: [
      { name: "প্রতিবেদন", href: "#" },
      { name: "সাক্ষাৎকার", href: "#" },
      { name: "বিশ্লেষণ", href: "#" },
      { name: "অনুসন্ধান", href: "#" },
      { name: "ফিচার", href: "#" },
    ]
  },
  {
    name: "মতামত",
    href: "#",
    subcategories: [
      { name: "সম্পাদকীয়", href: "#" },
      { name: "কলাম", href: "#" },
      { name: "চিঠিপত্র", href: "#" },
      { name: "বিশেষ লেখা", href: "#" },
      { name: "পাঠক মত", href: "#" },
    ]
  },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [mobileActiveMenu, setMobileActiveMenu] = useState<string | null>(null)

  return (
    <nav className="container mx-auto bg-card border-b border-border shadow-md sticky top-10 z-50 px-4">
      <div className="flex items-center justify-between py-3">
        {/* Home Icon */}
        <Link href="/" className="text-red-600 hover:text-red-700 transition">
          <Home className="w-6 h-6" />
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden ml-4 text-gray-700"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1 flex-1 ml-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="relative group"
              onMouseEnter={() => setActiveMenu(cat.name)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <Link
                href={cat.href}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition whitespace-nowrap"
              >
                {cat.name}
                <ChevronDown className="w-3 h-3" />
              </Link>

              {/* Mega Menu Dropdown */}
              {activeMenu === cat.name && (
                <div className="absolute top-full left-0 w-48 bg-white shadow-lg border border-gray-200 rounded-md py-2 mt-1">
                  {cat.subcategories.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="ml-auto">
          <button className="text-gray-700 hover:text-red-600 transition">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden pb-4 border-t border-gray-200 pt-4 max-h-96 overflow-y-auto">
          {categories.map((cat) => (
            <div key={cat.name} className="mb-2">
              <button
                onClick={() => setMobileActiveMenu(mobileActiveMenu === cat.name ? null : cat.name)}
                className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
              >
                <span className="font-medium">{cat.name}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${mobileActiveMenu === cat.name ? "rotate-180" : ""
                    }`}
                />
              </button>

              {mobileActiveMenu === cat.name && (
                <div className="ml-4 mt-1 space-y-1">
                  {cat.subcategories.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-red-600 rounded transition"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  )
}