'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import SidebarLogo from '@/components/ui/sidebar-logo'
import { useAuthContext } from '@/contexts/auth-context'
import SidebarBottom from '@/components/shared/sidebar-bottom'
import { adminSidebar } from '@/utils/static-data'

export function AdminSidebar({ isOpen, onClose }: any) {
  const { user, logout } = useAuthContext()
  const pathname = usePathname()
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleNavClick = (href: string) => {
    router.push(href)
    if (isMobile) onClose()
  }

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-76 bg-white border-r border-gray-200
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        `}
      >
        {/* Logo Section */}
        <SidebarLogo isMObile={isMobile} onClose={onClose} name="Beyond Tax Consultants" slogan="Admin Dashboard" />


        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1">
            {adminSidebar?.map((item: any) => {
              const isActive = pathname.startsWith(item.href)
              const Icon = item.icon

              return (
                <li key={item.name}>
                  <button
                    onClick={() => handleNavClick(item.href)}
                    className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg
              text-sm font-medium transition-all duration-200
              ${isActive
                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
            `}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span className="flex-1 text-left">{item.name}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Section */}
        <SidebarBottom user={user} handleLogout={logout} />
      </aside>
    </>
  )
}
