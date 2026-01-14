import type { Metadata } from 'next'
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
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="XTribune" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="geist_... bg-background text-foreground" cz-shortcut-listen="true">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}