"use client"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export default function Header() {
  const currentDate = new Date().toLocaleDateString("bn-BD", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        {/* Date Row */}
        <div className="py-3 border-b border-border text-sm text-muted-foreground">
          <p>{currentDate}</p>
        </div>

        {/* Logo and Social Row */}
        <div className="flex items-center justify-between py-4 gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-primary">World Tribune</h1>
          </div>
          <div className="flex gap-4">
            <Facebook className="w-6 h-6 text-muted-foreground hover:text-primary cursor-pointer transition" />
            <Twitter className="w-6 h-6 text-muted-foreground hover:text-primary cursor-pointer transition" />
            <Instagram className="w-6 h-6 text-muted-foreground hover:text-primary cursor-pointer transition" />
            <Youtube className="w-6 h-6 text-muted-foreground hover:text-primary cursor-pointer transition" />
          </div>
        </div>
      </div>
    </header>
  )
}
