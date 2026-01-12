'use client'

import { useAuthStore } from '@/store/useAuthStore'
import { Bell, Menu } from 'lucide-react'

export function DashboardHeader({ onMenuClick }: any) {
    const { user } = useAuthStore()
    return (
        <header className="h-16 bg-white border-b border-gray-200 px-4 lg:px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Menu className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Welcome back, {user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : 'Valued User'}
                    </h2>
                    <p className="text-xs text-gray-500 hidden sm:block">
                        Here’s a summary of your account activity and updates for today.
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell className="h-5 w-5 text--600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
            </div>
        </header>
    )
}
