"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/contexts/auth-context"

// Loading Spinner Component
function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    )
}

// Protected Route Wrapper - Any authenticated user
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading, mounted, user } = useAuthContext()
    const router = useRouter()

    useEffect(() => {
        if (!loading && mounted && !isAuthenticated && !user) {
            router.push("/client/login")
        }
    }, [isAuthenticated, loading, mounted, user, router])

    if (loading || !mounted || !user) {
        return <LoadingSpinner />
    }

    if (!isAuthenticated) {
        return null
    }

    return <>{children}</>
}

// Admin Route - Requires score >= 10
export function AdminRoute({ children }: { children: React.ReactNode }) {
    const { user, isAdmin, loading, mounted, roleScore } = useAuthContext()
    const router = useRouter()

    useEffect(() => {
        if (!loading && mounted) {
            if (!user) {
                // Not logged in - redirect to client login
                router.push("/client/login")
            } else if (!isAdmin || roleScore < 10) {
                // Logged in but not admin - redirect to unauthorized or home
                router.push("/")
            }
        }
    }, [user, isAdmin, roleScore, loading, mounted, router])

    if (loading || !mounted) {
        return <LoadingSpinner />
    }

    if (!user || !isAdmin) {
        return null
    }

    return <>{children}</>
}

// Super Admin Route - Requires score >= 999
export function SuperAdminRoute({ children }: { children: React.ReactNode }) {
    const { user, isSuperAdmin, loading, mounted, roleScore } = useAuthContext()
    const router = useRouter()

    useEffect(() => {
        if (!loading && mounted) {
            if (!user) {
                router.push("/client/login")
            } else if (!isSuperAdmin || roleScore < 999) {
                router.push("/")
            }
        }
    }, [user, isSuperAdmin, roleScore, loading, mounted, router])

    if (loading || !mounted) {
        return <LoadingSpinner />
    }

    if (!user || !isSuperAdmin) {
        return null
    }

    return <>{children}</>
}

// Role-based Route - Custom score requirement
export function RoleBasedRoute({
    children,
    requiredScore
}: {
    children: React.ReactNode
    requiredScore: number
}) {
    const { user, hasPermission, loading, mounted } = useAuthContext()
    const router = useRouter()

    useEffect(() => {
        if (!loading && mounted) {
            if (!user) {
                router.push("/client/login")
            } else if (!hasPermission(requiredScore)) {
                router.push("/")
            }
        }
    }, [user, hasPermission, requiredScore, loading, mounted, router])

    if (loading || !mounted) {
        return <LoadingSpinner />
    }

    if (!user || !hasPermission(requiredScore)) {
        return null
    }

    return <>{children}</>
}