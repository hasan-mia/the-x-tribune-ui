"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import {
    deleteMutationConfig,
    type MutationParameters,
    updateJsonMutationConfig,
    useGet,
} from "@/api/api"
import { AxiosError } from "axios"
import useCustomToast from "@/hooks/use-custom-toast"

export default function useContactUs(pageName?: string) {
    const toast = useCustomToast()
    const queryClient = useQueryClient()
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("")

    // Build query params
    const queryParams = useMemo(() => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        })
        if (search) params.append("search", search)
        if (statusFilter && statusFilter !== "all") params.append('status', statusFilter)
        return params.toString()
    }, [page, limit, search, statusFilter])

    // Fetch contact messages
    const {
        data: listData,
        isPending: listLoading,
        refetch: refetchList,
        isError: listError
    } = useGet(
        `/contact-us?${queryParams}`,
        "contact_us_list",
        pageName === "contact-us",
    )

    const updateMutation = useMutation<any, Error, MutationParameters>(
        updateJsonMutationConfig(queryClient, "contact_us_list"),
    )

    const deleteMutation = useMutation(deleteMutationConfig(queryClient, "contact_us_list"))

    // Status change
    const handleStatusChange = async (id: string, value: "new" | "in_progress" | "resolved" | "archived") => {
        try {
            const response = await updateMutation.mutateAsync({
                url: `/contact-us/${id}`,
                data: { status: value },
            })

            if (response) {
                toast.success("Status updated successfully")
                queryClient.invalidateQueries({ queryKey: ["contact_us_list"] })
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error?.response?.data?.message || "Failed to update status")
            } else {
                console.error("An error occurred:", error)
            }
        }
    }

    // Delete contact message
    const onDeleteContact = async (id: string) => {
        try {
            await deleteMutation.mutateAsync(`/contact-us/${id}`)
            toast.success("Category deleted successfully")
            queryClient.invalidateQueries({ queryKey: ["contact_us_list"] })
        } catch (error: any) {
            // Handle both AxiosError and custom HTTP interceptor errors
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to delete category"

            toast.error(errorMessage)
            console.log("Delete error:", error)
        }
    }

    const fetchData = useCallback(async () => {
        await refetchList()
    }, [refetchList])

    const memoizedFetchData = useMemo(() => fetchData, [fetchData])

    useEffect(() => {
        if (pageName === "contact-us") {
            memoizedFetchData()
            const timeout = setTimeout(() => {
                memoizedFetchData()
            }, 500)
            return () => clearTimeout(timeout)
        }
    }, [memoizedFetchData, page, limit, search, statusFilter, pageName])

    return {
        page,
        setPage,
        limit,
        setLimit,
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        handleStatusChange,
        onDeleteContact,
        listData,
        listLoading,
        refetchList,
        listError,
    }
}
