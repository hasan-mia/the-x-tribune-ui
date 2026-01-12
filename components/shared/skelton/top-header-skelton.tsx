import React from 'react'

export default function TopHeaderSkelton() {
    return (
        <div className="bg-gradient-to-r from-primary via-primary to-blue-700 text-primary-foreground py-2.5 px-4 hidden lg:block">
            <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
                <div className="flex items-center gap-6">
                    {/* Phone Skeleton */}
                    <div className="flex items-center gap-2 animate-pulse">
                        <div className="h-4 w-4 bg-white/20 rounded"></div>
                        <div className="h-4 w-32 bg-white/20 rounded"></div>
                    </div>
                    {/* Email Skeleton */}
                    <div className="flex items-center gap-2 animate-pulse">
                        <div className="h-4 w-4 bg-white/20 rounded"></div>
                        <div className="h-4 w-40 bg-white/20 rounded"></div>
                    </div>
                </div>
                {/* Hours Skeleton */}
                <div className="animate-pulse">
                    <div className="h-4 w-48 bg-white/20 rounded"></div>
                </div>
            </div>
        </div>
    )
}
