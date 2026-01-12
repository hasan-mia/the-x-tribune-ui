"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useGet } from "@/api/api"

interface DashboardStats {
    totalRevenue: string
    revenueChange: string
    activeUsers: number
    usersChange: string
    reportsGenerated: number
    avgRevenuePerUser: string
}

interface RevenueExpenseData {
    month: string
    revenue: number
    expenses: number
}

interface UserDistribution {
    name: string
    value: number
    color: string
}

interface User {
    id: string
    name: string
    email: string
    type: 'individual' | 'business'
    status: 'active' | 'pending' | 'inactive'
    lastActivity: string
}

interface Booking {
    id: string
    userName: string
    type: string
    date: string
    time: string
    status: 'upcoming' | 'completed' | 'cancelled'
}

interface DashboardData {
    stats: DashboardStats
    charts: {
        revenueVsExpenses: RevenueExpenseData[]
        userDistribution: UserDistribution[]
    }
    recentUsers: {
        users: User[]
        pagination: {
            total: number
            page: number
            limit: number
            totalPages: number
        }
    }
    upcomingBookings: {
        bookings: Booking[]
        pagination: {
            total: number
            page: number
            limit: number
            totalPages: number
        }
    }
}

export default function useDashboard(pageName?: string) {
    const queryClient = useQueryClient()

    // Date range filters
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [period, setPeriod] = useState("month")

    // Users pagination
    const [usersPage, setUsersPage] = useState(1)
    const [usersLimit, setUsersLimit] = useState(5)

    // Bookings pagination
    const [bookingsPage, setBookingsPage] = useState(1)
    const [bookingsLimit, setBookingsLimit] = useState(4)

    // Build query params
    const queryParams = new URLSearchParams()
    if (startDate) queryParams.append('startDate', startDate)
    if (endDate) queryParams.append('endDate', endDate)
    queryParams.append('usersPage', usersPage.toString())
    queryParams.append('usersLimit', usersLimit.toString())
    queryParams.append('bookingsPage', bookingsPage.toString())
    queryParams.append('bookingsLimit', bookingsLimit.toString())

    // --- GET ALL DASHBOARD DATA ---
    const {
        data: dashboardData,
        isPending: dashboardLoading,
        refetch: refetchDashboard,
        isError: dashboardError
    } = useGet(
        `/dashboard/all?${queryParams.toString()}`,
        "dashboard_data",
        pageName === "dashboard",
    )

    // --- GET DASHBOARD STATS ONLY ---
    const {
        data: statsData,
        isPending: statsLoading,
        refetch: refetchStats,
    } = useGet(
        `/dashboard/stats?${startDate ? `startDate=${startDate}&` : ''}${endDate ? `endDate=${endDate}` : ''}`,
        "dashboard_stats",
        false, // Only fetch when explicitly called
    )

    // --- GET REVENUE EXPENSES DATA ---
    const {
        data: revenueData,
        isPending: revenueLoading,
        refetch: refetchRevenue,
    } = useGet(
        `/dashboard/revenue-expenses?${startDate ? `startDate=${startDate}&` : ''}${endDate ? `endDate=${endDate}&` : ''}period=${period}`,
        "dashboard_revenue",
        false, // Only fetch when explicitly called
    )

    // --- GET USER DISTRIBUTION ---
    const {
        data: userDistributionData,
        isPending: userDistributionLoading,
        refetch: refetchUserDistribution,
    } = useGet(
        `/dashboard/user-distribution`,
        "dashboard_user_distribution",
        false, // Only fetch when explicitly called
    )

    // --- GET RECENT USERS ---
    const {
        data: recentUsersData,
        isPending: usersLoading,
        refetch: refetchUsers,
        isError: usersError
    } = useGet(
        `/dashboard/recent-users?page=${usersPage}&limit=${usersLimit}`,
        "dashboard_recent_users",
        false, // Only fetch when explicitly called
    )

    // --- GET UPCOMING BOOKINGS ---
    const {
        data: upcomingBookingsData,
        isPending: bookingsLoading,
        refetch: refetchBookings,
        isError: bookingsError
    } = useGet(
        `/dashboard/upcoming-bookings?page=${bookingsPage}&limit=${bookingsLimit}`,
        "dashboard_upcoming_bookings",
        false, // Only fetch when explicitly called
    )

    // Handle Users Pagination
    const handleUsersPageChange = (page: number) => {
        setUsersPage(page)
    }

    const handleUsersLimitChange = (limit: number) => {
        setUsersLimit(limit)
        setUsersPage(1) // Reset to first page when limit changes
    }

    // Handle Bookings Pagination
    const handleBookingsPageChange = (page: number) => {
        setBookingsPage(page)
    }

    const handleBookingsLimitChange = (limit: number) => {
        setBookingsLimit(limit)
        setBookingsPage(1) // Reset to first page when limit changes
    }

    // Handle Date Range Change
    const handleDateRangeChange = (start: string, end: string) => {
        setStartDate(start)
        setEndDate(end)
    }

    // Fetch data callback
    const fetchData = useCallback(async () => {
        await refetchDashboard()
    }, [refetchDashboard])

    const memoizedFetchData = useMemo(() => fetchData, [fetchData])

    // Auto-refetch when dependencies change
    useEffect(() => {
        if (pageName === "dashboard") {
            memoizedFetchData()
            const timeout = setTimeout(() => {
                memoizedFetchData()
            }, 500)
            return () => clearTimeout(timeout)
        }
    }, [memoizedFetchData, usersPage, usersLimit, bookingsPage, bookingsLimit, startDate, endDate, pageName])

    return {
        // Date filters
        startDate,
        endDate,
        period,
        setStartDate,
        setEndDate,
        setPeriod,
        handleDateRangeChange,

        // Users pagination
        usersPage,
        usersLimit,
        setUsersPage,
        setUsersLimit,
        handleUsersPageChange,
        handleUsersLimitChange,

        // Bookings pagination
        bookingsPage,
        bookingsLimit,
        setBookingsPage,
        setBookingsLimit,
        handleBookingsPageChange,
        handleBookingsLimitChange,

        // All dashboard data
        dashboardData: dashboardData?.data,
        dashboardLoading,
        dashboardError,
        refetchDashboard,

        // Individual data sections
        statsData: statsData?.data,
        statsLoading,
        refetchStats,

        revenueData: revenueData?.data,
        revenueLoading,
        refetchRevenue,

        userDistributionData: userDistributionData?.data,
        userDistributionLoading,
        refetchUserDistribution,

        recentUsersData: recentUsersData?.data,
        usersLoading,
        usersError,
        refetchUsers,

        upcomingBookingsData: upcomingBookingsData?.data,
        bookingsLoading,
        bookingsError,
        refetchBookings,
    }
}