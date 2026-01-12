"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import {
    type MutationParameters,
    updateJsonMutationConfig,
    useGet,
} from "@/api/api"
import { AxiosError } from "axios"
import useCustomToast from "@/hooks/use-custom-toast"

export default function useAdmins(pageName?: string) {
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

    // Fetch admins
    const {
        data: listData,
        isPending: listLoading,
        refetch: refetchList,
        isError: listError
    } = useGet(
        `/users/admins?${queryParams}`,
        "admins_list",
        pageName === "admins",
    )

    const updateMutation = useMutation<any, Error, MutationParameters>(
        updateJsonMutationConfig(queryClient, "admins_list"),
    )


    // Status change
    const handleStatusChange = async (id: string, value: "pending" | "active" | "suspended") => {
        try {
            const response = await updateMutation.mutateAsync({
                url: `/users/${id}`,
                data: { status: value },
            })

            if (response) {
                toast.success("Status updated successfully")
                queryClient.invalidateQueries({ queryKey: ["admins_list"] })
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error?.response?.data?.message || "Failed to update status")
            } else {
                console.error("An error occurred:", error)
            }
        }
    }

    const fetchData = useCallback(async () => {
        await refetchList()
    }, [refetchList])

    const memoizedFetchData = useMemo(() => fetchData, [fetchData])

    useEffect(() => {
        if (pageName === "admins") {
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
        listData,
        listLoading,
        refetchList,
        listError,
    }
}