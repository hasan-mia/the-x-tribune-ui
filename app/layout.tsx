import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ClientLayout } from './client-layout'

export const metadata: Metadata = {
  title: "The X Tribune",
  description: "Beyond Tax Consultants provides professional accounting and tax services for businesses and individuals. Explore our services, client testimonials, and more.",
  keywords: ["tax", "accounting", "consulting", "business services"],
  authors: [{ name: "Beyond Tax Consultants" }],
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.png" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/icon.png" media="(prefers-color-scheme: dark)" />
        <link rel="icon" type="image/png" href="/icon.png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body className="geist_... bg-background text-foreground" cz-shortcut-listen="true">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}