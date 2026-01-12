"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Search } from "lucide-react"

const categories = [
  { name: "প্রচ্ছদ", href: "#" },
  { name: "জাতীয়", href: "#" },
  { name: "অর্থনীতি", href: "#" },
  { name: "রাজনীতি", href: "#" },
  { name: "বিশ্ব", href: "#" },
  { name: "খেলাধুলা", href: "#" },
  { name: "বিনোদন", href: "#" },
  { name: "বিজ্ঞান ও প্রযুক্তি", href: "#" },
  { name: "লাইফস্টাইল", href: "#" },
  { name: "মতামত", href: "#" },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-card border border-border shadow-md sticky top-10 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 flex-1">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="text-sm font-semibold text-foreground hover:text-primary transition"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Search */}
          <div className="ml-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="খুজুন..."
                className="px-4 py-2 rounded-full border border-border bg-secondary focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-2 border-t border-border pt-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="px-4 py-2 text-foreground hover:bg-secondary rounded transition"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
