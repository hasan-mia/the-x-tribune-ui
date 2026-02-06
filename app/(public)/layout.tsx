import React from "react"
import BreakingNews from "@/components/breaking-news/breaking-news"
import Footer from "@/components/footer/footer"
import Header from "@/components/header/header"
import Navigation from "@/components/navigation/navigation"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto">
      <BreakingNews />
      <Header />
      <Navigation />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
