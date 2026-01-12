'use client'

import { ProtectedRoute } from '../../middleware/protectedRoute'
import PublicHeader from '@/components/public/header'
import PublicFooter from '@/components/public/footer'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
    </ProtectedRoute>
  )
}
