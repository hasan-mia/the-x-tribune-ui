'use client'
import React from 'react'
import { ProtectedRoute } from '../../middleware/protectedRoute'
import PublicHeader from '@/components/public/header'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <PublicHeader />
      <main>{children}</main>
    </ProtectedRoute>
  )
}
