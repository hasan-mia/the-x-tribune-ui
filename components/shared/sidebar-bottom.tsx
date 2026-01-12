import { ArrowLeft, ChevronDown, LogOut } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

export default function SidebarBottom({ user, handleLogout }: any) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <div className="p-4 border-t border-gray-200">
            {/* User Profile Section */}
            <div className="relative">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt={`${user.first_name} ${user.last_name}`}
                            className="h-9 w-9 rounded-full object-cover ring-2 ring-gray-100"
                        />
                    ) : (
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center ring-2 ring-blue-100">
                            <span className="text-white font-semibold text-sm">{user.initials}</span>
                        </div>
                    )}
                    <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {user.first_name} {user.last_name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">Back to Home</span>
                        </Link>

                        <div className="h-px bg-gray-200 my-1" />

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="font-medium">Log out</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}