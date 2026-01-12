import React from 'react'

export default function LogoSkelton() {
    return (
        <div className="flex items-center gap-3">
            <div className="h-14 w-20 rounded-xl bg-muted animate-pulse" />
            <div className="flex flex-col gap-2">
                <div className="h-5 w-48 bg-muted animate-pulse rounded" />
            </div>
        </div>
    )
}
