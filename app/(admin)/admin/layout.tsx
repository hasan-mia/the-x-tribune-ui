'use client'

import { AdminSidebar } from '@/components/admin/navigation/admin-sidebar'
import { useState } from 'react'
import { AdminRoute } from '@/middleware/protectedRoute'
import { DashboardHeader } from '@/components/shared/dashboard-header'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AdminRoute>
      <div className="flex h-screen bg-background">
        <AdminSidebar isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto bg-muted/30 p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminRoute>
  )
}
