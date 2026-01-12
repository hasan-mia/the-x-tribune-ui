"use client";

import { useGetSettings } from '@/api/settings'
import { X } from 'lucide-react'
import LogoSkelton from '../shared/skelton/logo-skelton';
import Image from 'next/image';

export default function SidebarLogo({ isMobile, onClose, name = "Beyond Tax Consultants", slogan = "Client Dashboard" }: any) {
    const { data, isLoading, isError } = useGetSettings("logo")
    if (isLoading) {
        return (
            <LogoSkelton />
        )
    }

    if (isError) {
        return (
            <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">BTC</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">{name}</h1>
                        <p className="text-xs text-gray-500">{slogan}</p>
                    </div>
                </div>
                {isMobile && (
                    <button onClick={onClose} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
                        <X className="h-5 w-5 text-gray-600" />
                    </button>
                )}
            </div>
        )
    }

    // Check if we have a valid image URL
    const logoIcon = data?.data?.value?.icon
    const siteName = data?.data?.value?.name
    const hasImage = logoIcon && typeof logoIcon === 'string' && logoIcon.trim() !== ''
    return (
        <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-3">
                <div className="w-12 h-10  flex items-center justify-center text-primary-foreground font-bold text-xl">
                    {hasImage ? (
                        <Image
                            src={logoIcon}
                            alt="Logo"
                            width={10}
                            height={10}
                            className="object-cover w-full h-full rounded"
                        />
                    ) : (
                        <div className="w-12 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">BTC</span>
                        </div>
                    )}
                </div>
                <div>
                    <h1 className="text-lg font-bold text-gray-900">{siteName || name}</h1>
                    <p className="text-xs text-gray-500">{slogan}</p>
                </div>
            </div>
            {isMobile && (
                <button onClick={onClose} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
                    <X className="h-5 w-5 text-gray-600" />
                </button>
            )}
        </div>

    )
}
