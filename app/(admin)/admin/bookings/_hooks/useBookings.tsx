"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import {
    createJsonMutationConfig,
    type MutationParameters,
    updateJsonMutationConfig,
    useGet,
} from "@/api/api"
import { AxiosError } from "axios"
import useCustomToast from "@/hooks/use-custom-toast"

// Types
export type BookingStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled" | "refunded"
export type PaymentStatus = "pending" | "paid" | "refunded" | "succeeded" | "processing"
export type BookingType = "service" | "video" | "phone" | "in-person"

interface Service {
    id: string
    title: string
    slug: string
    icon: string
    short_description: string
    description: string
    service_type: string
    price: string
    currency: string
    [key: string]: any
}

interface User {
    id: string
    email: string
    first_name: string
    last_name: string
}

export interface Booking {
    id: string
    booking_number: string
    service_id: string
    user_id: string | null
    customer_name: string
    customer_email: string
    customer_phone: string
    customer_company: string | null
    booking_type: BookingType
    description: string | null
    scheduled_date: string | null
    scheduled_time: string | null
    duration: number | null
    timezone: string
    google_meet_link: string | null
    google_event_id: string | null
    is_paid_service: boolean
    amount: string
    tax_amount: string
    discount_amount: string
    total_amount: string
    currency: string
    stripe_payment_intent_id: string | null
    stripe_checkout_session_id: string | null
    paid_at: string | null
    subscription_id: string | null
    status: BookingStatus
    payment_status: PaymentStatus
    guest_email: string | null
    referral_source: string | null
    confirmation_code: string
    notes: string | null
    metadata: any
    created_at: string
    updated_at: string
    service: Service | null
    user: User | null
    payment: any | null
}

export interface BookingsStats {
    total_bookings: number
    pending_bookings: number
    confirmed_bookings: number
    completed_bookings: number
    today_bookings: number
    upcoming_bookings: number
    paid_bookings: number
    total_revenue: number
}

interface Pagination {
    total: number
    page: number
    limit: number
    pages: number
}

type ViewType = "all" | "upcoming" | "past"

export default function useBookings(pageName?: string) {
    const toast = useCustomToast()
    const queryClient = useQueryClient()
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all")
    const [selectedView, setSelectedView] = useState<ViewType>("all")

    // Build query params with proper filtering logic
    const queryParams = useMemo(() => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        })

        if (search) params.append("search", search)

        // Handle view-based filtering
        if (selectedView === "upcoming") {
            const today = new Date().toISOString().split('T')[0]
            params.append("date_from", today)
            // Apply status filter if user selected one
            if (statusFilter !== "all") {
                params.append("status", statusFilter)
            }
        } else if (selectedView === "past") {
            const today = new Date().toISOString().split('T')[0]
            params.append("date_to", today)
            // Apply status filter if user selected one
            if (statusFilter !== "all") {
                params.append("status", statusFilter)
            }
        } else {
            // For "all" view, apply status filter if not "all"
            if (statusFilter !== "all") {
                params.append("status", statusFilter)
            }
        }

        // Payment status filter
        if (paymentStatusFilter && paymentStatusFilter !== "all") {
            params.append("payment_status", paymentStatusFilter)
        }

        return params.toString()
    }, [page, limit, search, statusFilter, paymentStatusFilter, selectedView])

    // Fetch bookings
    const {
        data: bookingsData,
        isPending: bookingsLoading,
        refetch: refetchBookings,
        isError: bookingsError
    } = useGet(
        `/bookings/admin/all?${queryParams}`,
        "bookings_list",
        pageName === "bookings",
    )

    // Fetch booking stats
    const {
        data: statsData,
        isPending: statsLoading,
        refetch: refetchStats,
    } = useGet(
        `/bookings/admin/stats`,
        "bookings_stats",
        pageName === "bookings",
    )

    // Update mutations
    const createInvoiceMutation = useMutation<any, Error, MutationParameters>(
        createJsonMutationConfig(queryClient, "bookings_list"),
    )

    // Update mutations
    const updateStatusMutation = useMutation<any, Error, MutationParameters>(
        updateJsonMutationConfig(queryClient, "bookings_list"),
    )

    const updatePaymentMutation = useMutation<any, Error, MutationParameters>(
        updateJsonMutationConfig(queryClient, "bookings_list"),
    )

    // Update booking status
    const handleStatusChange = async (
        bookingId: string,
        status: BookingStatus
    ) => {
        try {
            const response = await updateStatusMutation.mutateAsync({
                url: `/bookings/${bookingId}/status`,
                data: { status },
            })

            if (response) {
                toast.success("Booking status updated successfully")
                await Promise.all([
                    queryClient.invalidateQueries({ queryKey: ["bookings_list"] }),
                    queryClient.invalidateQueries({ queryKey: ["bookings_stats"] })
                ])
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error?.response?.data?.message || "Failed to update booking status")
            } else {
                console.error("An error occurred:", error)
                toast.error("Failed to update booking status")
            }
        }
    }

    // Update payment status
    const handlePaymentStatusUpdate = async (bookingId: string, paymentData: any) => {
        try {
            const response = await updatePaymentMutation.mutateAsync({
                url: `/bookings/${bookingId}/payment-status`,
                data: paymentData,
            })

            if (response) {
                toast.success("Payment status updated successfully")
                await Promise.all([
                    queryClient.invalidateQueries({ queryKey: ["bookings_list"] }),
                    queryClient.invalidateQueries({ queryKey: ["bookings_stats"] })
                ])
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error?.response?.data?.message || "Failed to update payment status")
            } else {
                console.error("An error occurred:", error)
                toast.error("Failed to update payment status")
            }
        }
    }

    // create invoice
    const handleInvoiceCreate = async (
        id: string,
        data: any
    ) => {
        try {
            const response = await createInvoiceMutation.mutateAsync({
                url: `/invoices/${id}`,
                data,
            })

            if (response) {
                toast.success("Invoice created successfully")
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to update invoice")
        }
    }


    const fetchData = useCallback(async () => {
        await Promise.all([refetchBookings(), refetchStats()])
    }, [refetchBookings, refetchStats])

    const memoizedFetchData = useMemo(() => fetchData, [fetchData])

    useEffect(() => {
        if (pageName === "bookings") {
            memoizedFetchData()
        }
    }, [memoizedFetchData, page, limit, search, statusFilter, paymentStatusFilter, selectedView, pageName])

    // Reset page to 1 when filters change
    useEffect(() => {
        setPage(1)
    }, [search, statusFilter, paymentStatusFilter, selectedView])

    return {
        // Pagination
        page,
        setPage,
        limit,
        setLimit,

        // Filters
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        paymentStatusFilter,
        setPaymentStatusFilter,
        selectedView,
        setSelectedView,

        // Data
        bookings: (bookingsData?.data?.bookings || []) as Booking[],
        pagination: (bookingsData?.data?.pagination || {
            total: 0,
            page: 1,
            limit: 10,
            pages: 0
        }) as Pagination,
        stats: (statsData?.data || {
            total_bookings: 0,
            pending_bookings: 0,
            confirmed_bookings: 0,
            completed_bookings: 0,
            today_bookings: 0,
            upcoming_bookings: 0,
            paid_bookings: 0,
            total_revenue: 0
        }) as BookingsStats,

        // Loading states
        bookingsLoading,
        statsLoading,

        // Error states
        bookingsError,

        // Actions
        handleStatusChange,
        handlePaymentStatusUpdate,
        refetchBookings,
        refetchStats,

        handleInvoiceCreate,
    }
}