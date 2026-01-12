"use client"

import { Zap } from "lucide-react"

interface NewsItem {
  id: number
  category: string
  title: string
}

const breakingNewsItems: NewsItem[] = [
  { id: 1, category: "জাতীয়", title: "বাংলাদেশের অর্থনীতি ঘুরে দাঁড়িয়েছে: বিশ্বব্যাংক" },
  { id: 2, category: "খেলাধুলা", title: "সাকিবের ছুটি নিয়ে দোলাচলে বিসিবি" },
  { id: 3, category: "বিনোদন", title: "হয়ে গেছে ভিকি-ক্যাটরিনা বিয়ে" },
  { id: 4, category: "বিশ্ব", title: "বাধ্যতামূলক টিকাদান: পক্ষে-বিপক্ষে তিন কারণ" },
  { id: 5, category: "প্রযুক্তি", title: "এ বছর সবচেয়ে বেশি ব্যবহৃত যে ইমোজি" },
]

export default function BreakingNews() {
  return (
    <div className="bg-card border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-stretch gap-0">
          {/* Breaking Badge */}
          <div className="breaking-caret bg-primary text-primary-foreground py-2 px-10 flex items-center gap-2 whitespace-nowrap">
            <Zap className="w-5 h-5" />
            <span className="font-bold text-sm md:text-base sm:inline">ব্রেকিং নিউজ</span>
          </div>

          {/* Scrolling Ticker */}
          <div className="flex-1 overflow-hidden">
            <div className="flex animate-scroll whitespace-nowrap">
              {breakingNewsItems.map((item) => (
                <div key={item.id} className="inline-flex items-center gap-2 px-6 py-2">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
                    {item.category}
                  </span>
                  <a href="#" className="text-foreground hover:text-primary transition">
                    {item.title}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
