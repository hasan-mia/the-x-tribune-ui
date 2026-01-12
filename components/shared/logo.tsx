"use client";
import { useGetSettings } from '@/api/settings'
import Link from 'next/link'
import Image from 'next/image'
import LogoSkelton from './skelton/logo-skelton';

export default function Logo({ color }: { color?: string }) {
    const { data, isLoading, isError } = useGetSettings("logo")

    // Check if we have a valid image URL
    const logoIcon = data?.data?.value?.icon
    const name = data?.data?.value?.name
    const hasImage = logoIcon && typeof logoIcon === 'string' && logoIcon.trim() !== ''

    // Show skeleton while loading
    if (isLoading) {
        return (
            <LogoSkelton />
        )
    }

    // Show default if error
    if (isError) {
        return (
            <Link href="/" className="flex items-center gap-3 group">
                <div className="h-14 w-20 rounded-xl bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-primary-foreground font-bold text-xl shadow-md group-hover:shadow-lg transition-shadow">
                    <span>BTC</span>
                </div>
                <div className="flex flex-col">
                    <span className={`text-xl font-bold leading-none ${color || 'text-foreground'}`}>
                        Beyond Tax Consultants
                    </span>
                </div>
            </Link>
        )
    }

    return (
        <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-12 rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl">
                {hasImage ? (
                    <Image
                        src={logoIcon}
                        alt="Logo"
                        width={10}
                        height={10}
                        className="object-cover w-full h-full rounded-lg"
                    />
                ) : (
                    <span>BTC</span>
                )}
            </div>
            <div className="flex flex-col">
                <span className={`text-xl font-bold ${color || 'text-foreground'} leading-none group-hover:text-primary transition-colors`}>
                    {name ? name : "Beyond Tax Consultants"}
                </span>
                {/* <span className="text-xs text-muted-foreground">Certified Public Accountants</span> */}
            </div>
        </Link>
    )
}