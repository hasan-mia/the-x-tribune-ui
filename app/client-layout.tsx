"use client"

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { useState } from 'react'
import { AuthProvider } from '@/contexts/auth-context'

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 60 * 1000, // 1 minute
                        refetchOnWindowFocus: false,
                        retry: 1,
                    },
                },
            })
    )

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                {children}
            </AuthProvider>
            <Toaster />
        </QueryClientProvider>
    )
}