"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import {
    createJsonMutationConfig,
    deleteMutationConfig,
    type MutationParameters,
    updateJsonMutationConfig,
    useGet,
} from "@/api/api"
import { AxiosError } from "axios"
import useCustomToast from "@/hooks/use-custom-toast"

interface IncomeSourceTypeFormState {
    name: string
}

export default function useIncomeSourceTypes(pageName?: string, id?: string) {
    const toast = useCustomToast()
    const queryClient = useQueryClient()
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const initialFormState: IncomeSourceTypeFormState = {
        name: "",
    }

    const [formState, setFormState] = useState<IncomeSourceTypeFormState>(initialFormState)

    const handleInputChange = (e: any) => {
        const { name, value } = e.target
        setFormState((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // --- LIST INCOME SOURCE TYPES ---
    const {
        data: listData,
        isPending: listLoading,
        refetch: refetchList,
        isError: listError
    } = useGet(
        `/income-source-types/?page=${page}&limit=${encodeURIComponent(limit)}&search=${encodeURIComponent(search || "")}`,
        "income_source_types_list",
        pageName === "income-source-types",
    )

    // --- GET SINGLE INCOME SOURCE TYPE ---
    const {
        data: details,
        isPending: detailLoading,
        refetch: refetchDetail,
    } = useGet(
        id ? `/income-source-types/${id}` : "",
        `income_source_type_detail_${id}`,
        pageName === "update" && !!id,
    )

    // Reset form state when ID changes or mode changes
    useEffect(() => {
        if (pageName === "update" && id) {
            setFormState(initialFormState)
        } else if (pageName !== "update") {
            setFormState(initialFormState)
        }
    }, [id, pageName])

    // Populate form state with details data
    useEffect(() => {
        if (details?.data && pageName === "update") {
            setFormState({
                name: details.data.name || "",
            })
        }
    }, [details?.data, pageName])

    // --- MUTATIONS ---
    const createMutation = useMutation<any, Error, MutationParameters>(
        createJsonMutationConfig(queryClient, "income_source_types_list"),
    )

    const updateMutation = useMutation<any, Error, MutationParameters>(
        updateJsonMutationConfig(queryClient, "income_source_types_list"),
    )

    const deleteMutation = useMutation(deleteMutationConfig(queryClient, "income_source_types_list"))

    // --- CREATE INCOME SOURCE TYPE ---
    const createIncomeSourceType = async (): Promise<void> => {
        setIsLoading(true)
        try {
            const payload = {
                name: formState.name,
            }

            const response = await createMutation.mutateAsync({
                url: '/income-source-types',
                data: payload,
            })

            if (response?.success) {
                toast.success(response.message || "Income source type created successfully")
                refetchList()
                setFormState(initialFormState)
            } else {
                toast.error(response?.message || "Failed to create income source type")
            }
        } catch (err: any) {
            const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to create income source type"
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    // --- UPDATE INCOME SOURCE TYPE ---
    const updateIncomeSourceType = async (): Promise<void> => {
        if (!id) return
        setIsLoading(true)
        try {
            const payload = {
                name: formState.name,
            }

            const response = await updateMutation.mutateAsync({
                url: `/income-source-types/${id}`,
                data: payload,
            })

            if (response?.success) {
                toast.success(response.message || "Income source type updated successfully")
                queryClient.invalidateQueries({ queryKey: [`income_source_type_detail_${id}`] })
                queryClient.invalidateQueries({ queryKey: ["income_source_types_list"] })
            } else {
                toast.error(response?.message || "Failed to update income source type")
            }
        } catch (err: any) {
            const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to update income source type"
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    // --- DELETE INCOME SOURCE TYPE ---
    const onDeleteIncomeSourceType = async (id: string) => {
        try {
            await deleteMutation.mutateAsync(`/income-source-types/${id}`)
            toast.success("Income source type deleted successfully")
            queryClient.invalidateQueries({ queryKey: [`income_source_type_detail_${id}`] })
            queryClient.invalidateQueries({ queryKey: ["income_source_types_list"] })
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to delete income source type"

            toast.error(errorMessage)
            console.log("Delete error:", error)
        }
    }

    // Handle Pagination
    const handlePageChange = (page: number) => {
        setPage(page)
    }

    const fetchData = useCallback(async () => {
        await refetchList()
    }, [refetchList])

    const memoizedFetchData = useMemo(() => fetchData, [fetchData])

    useEffect(() => {
        if (pageName === "income-source-types") {
            memoizedFetchData()
            const timeout = setTimeout(() => {
                memoizedFetchData()
            }, 500)
            return () => clearTimeout(timeout)
        }
    }, [memoizedFetchData, page, limit, search, pageName])

    // Clear form state when component unmounts
    useEffect(() => {
        return () => {
            if (pageName === "update") {
                setFormState(initialFormState)
            }
        }
    }, [])

    return {
        page,
        setPage,
        limit,
        setLimit,
        search,
        setSearch,
        handlePageChange,
        // List
        listData,
        listLoading,
        refetchList,
        listError,
        // Single detail
        details,
        detailLoading,
        refetchDetail,
        // Form
        formState,
        handleInputChange,
        setFormState,
        // Actions
        createIncomeSourceType,
        updateIncomeSourceType,
        isLoading,
        // Delete
        onDeleteIncomeSourceType,
    }
}