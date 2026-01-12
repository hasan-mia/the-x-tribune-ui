import React from 'react'

export default function LoadingSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-slate-600 font-medium">Loading...</p>
            </div>
        </div>
    )
}
