import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Rss } from "lucide-react"

const footerLinks = [
  "প্রচ্ছদ",
  "জাতীয়",
  "রাজনীতি",
  "বিনোদন",
  "অর্থনীতি",
  "বিশ্ব",
  "খেলাধুলা",
  "বিজ্ঞান ও প্রযুক্তি",
  "ধর্ম ও জীবন",
  "লাইফস্টাইল",
  "ইতিহাস ও সংস্কৃতি",
  "স্বাস্থ্য",
]

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      {/* Navigation Links */}
      <div className="bg-gray-800 py-6 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {footerLinks.map((link) => (
              <Link key={link} href="#" className="hover:text-primary transition">
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo and Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">World Tribune</h3>
            <div className="flex gap-3">
              <Facebook className="w-5 h-5 hover:text-primary cursor-pointer transition" />
              <Twitter className="w-5 h-5 hover:text-primary cursor-pointer transition" />
              <Instagram className="w-5 h-5 hover:text-primary cursor-pointer transition" />
              <Youtube className="w-5 h-5 hover:text-primary cursor-pointer transition" />
              <Linkedin className="w-5 h-5 hover:text-primary cursor-pointer transition" />
              <Rss className="w-5 h-5 hover:text-primary cursor-pointer transition" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">দ্রুত লিঙ্ক</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-primary transition">
                  হোম
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition">
                  আমাদের সম্পর্কে
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition">
                  গোপনীয়তা নীতি
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition">
                  DMCA
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-4">যোগাযোগ</h4>
            <address className="text-sm not-italic space-y-2">
              <p>সম্পাদক : মাহবুবা ইসলাম</p>
              <p>ঠিকানা : বাড়ি নং- ৯৯ (ফ্লাট এ/১)</p>
              <p>গুলশান, ঢাকা</p>
            </address>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-black text-center py-4 text-sm">
        <p>সর্বস্বত্ব স্বত্বাধিকার সংরক্ষিত © ২০১৪-২০২৪ World Tribune</p>
      </div>
    </footer>
  )
}
