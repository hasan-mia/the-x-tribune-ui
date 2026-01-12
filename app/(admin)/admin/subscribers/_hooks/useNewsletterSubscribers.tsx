"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useGet } from "@/api/api"

export default function useNewsletterSubscribers(pageName?: string) {
    const queryClient = useQueryClient()
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("")
    const [source, setSource] = useState("")

    // --- LIST NEWSLETTER SUBSCRIBERS ---
    const {
        data: listData,
        isPending: listLoading,
        refetch: refetchList,
        isError: listError
    } = useGet(
        `/newsletter/subscribers?page=${page}&limit=${encodeURIComponent(limit)}&search=${encodeURIComponent(search || "")}&status=${encodeURIComponent(status || "")}&source=${encodeURIComponent(source || "")}`,
        "newsletter_subscribers_list",
        pageName === "newsletter-subscribers",
    )

    // Handle Pagination
    const handlePageChange = (page: number) => {
        setPage(page)
    }

    const fetchData = useCallback(async () => {
        await refetchList()
    }, [refetchList])

    const memoizedFetchData = useMemo(() => fetchData, [fetchData])

    useEffect(() => {
        if (pageName === "newsletter-subscribers") {
            memoizedFetchData()
            const timeout = setTimeout(() => {
                memoizedFetchData()
            }, 500)
            return () => clearTimeout(timeout)
        }
    }, [memoizedFetchData, page, limit, search, status, source, pageName])

    return {
        page,
        setPage,
        limit,
        setLimit,
        search,
        setSearch,
        status,
        setStatus,
        source,
        setSource,
        handlePageChange,
        // List
        listData,
        listLoading,
        refetchList,
        listError,
    }
}