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

// Updated form state interface
interface CategoryFormState {
    name: string
    description: string
    color: string
    is_active: boolean
}

export default function useCategories(pageName?: string, id?: string) {
    const toast = useCustomToast()
    const queryClient = useQueryClient()
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    // Initial form state with updated fields
    const initialFormState: CategoryFormState = {
        name: "",
        description: "",
        color: "#3B82F6",
        is_active: true,
    }

    const [formState, setFormState] = useState<CategoryFormState>(initialFormState)

    const handleInputChange = (e: any) => {
        const { name, value } = e.target
        setFormState((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // --- LIST CATEGORIES ---
    const {
        data: listData,
        isPending: listLoading,
        refetch: refetchList,
        isError: listError
    } = useGet(
        `/categories/?page=${page}&limit=${encodeURIComponent(limit)}&search=${encodeURIComponent(search || "")}`,
        "categories_list",
        pageName === "categories",
    )

    // --- GET SINGLE CATEGORY ---
    const {
        data: details,
        isPending: detailLoading,
        refetch: refetchDetail,
    } = useGet(
        id ? `/categories/${id}` : "",
        `category_detail_${id}`,
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
                description: details.data.description || "",
                color: details.data.color || "#3B82F6",
                is_active: details.data.is_active ?? true,
            })
        }
    }, [details?.data, pageName])

    // --- MUTATIONS ---
    const createMutation = useMutation<any, Error, MutationParameters>(
        createJsonMutationConfig(queryClient, "categories_list"),
    )

    const updateMutation = useMutation<any, Error, MutationParameters>(
        updateJsonMutationConfig(queryClient, "categories_list"),
    )

    const deleteMutation = useMutation(deleteMutationConfig(queryClient, "categories_list"))

    // --- CREATE CATEGORY ---
    const createCategory = async (): Promise<void> => {
        setIsLoading(true)
        try {
            const payload = {
                name: formState.name,
                description: formState.description,
                color: formState.color,
                is_active: formState.is_active,
            }

            const response = await createMutation.mutateAsync({
                url: '/categories',
                data: payload,
            })

            if (response?.success) {
                toast.success(response.message || "Category created successfully")
                refetchList()
                setFormState(initialFormState)
            } else {
                toast.error(response?.message || "Failed to create category")
            }
        } catch (err: any) {
            const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to create category"
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    // --- UPDATE CATEGORY ---
    const updateCategory = async (): Promise<void> => {
        if (!id) return
        setIsLoading(true)
        try {
            const payload = {
                name: formState.name,
                description: formState.description,
                color: formState.color,
                is_active: formState.is_active,
            }

            const response = await updateMutation.mutateAsync({
                url: `/categories/${id}`,
                data: payload,
            })

            if (response?.success) {
                toast.success(response.message || "Category updated successfully")
                queryClient.invalidateQueries({ queryKey: [`category_detail_${id}`] })
                queryClient.invalidateQueries({ queryKey: ["categories_list"] })
            } else {
                toast.error(response?.message || "Failed to update category")
            }
        } catch (err: any) {
            const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to update category"
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    // --- DELETE CATEGORY ---
    const onDeleteCategory = async (id: string) => {
        try {
            await deleteMutation.mutateAsync(`/categories/${id}`)
            toast.success("Category deleted successfully")
            queryClient.invalidateQueries({ queryKey: [`category_detail_${id}`] })
            queryClient.invalidateQueries({ queryKey: ["categories_list"] })
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

    // Handle Pagination
    const handlePageChange = (page: number) => {
        setPage(page)
    }

    const fetchData = useCallback(async () => {
        await refetchList()
    }, [refetchList])

    const memoizedFetchData = useMemo(() => fetchData, [fetchData])

    useEffect(() => {
        if (pageName === "categories") {
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
        createCategory,
        updateCategory,
        isLoading,
        // Delete
        onDeleteCategory,
    }
}