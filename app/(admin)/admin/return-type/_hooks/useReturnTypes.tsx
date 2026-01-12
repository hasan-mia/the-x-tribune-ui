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

interface DocumentTypeFormState {
    name: string
}

export default function useReturnTypes(pageName?: string, id?: string) {
    const toast = useCustomToast()
    const queryClient = useQueryClient()
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const initialFormState: DocumentTypeFormState = {
        name: "",
    }

    const [formState, setFormState] = useState<DocumentTypeFormState>(initialFormState)

    const handleInputChange = (e: any) => {
        const { name, value } = e.target
        setFormState((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // --- LIST DOCUMENT TYPES ---
    const {
        data: listData,
        isPending: listLoading,
        refetch: refetchList,
        isError: listError
    } = useGet(
        `/return-types/?page=${page}&limit=${encodeURIComponent(limit)}&search=${encodeURIComponent(search || "")}`,
        "return_types_list",
        pageName === "return-types",
    )

    // --- GET SINGLE DOCUMENT TYPE ---
    const {
        data: details,
        isPending: detailLoading,
        refetch: refetchDetail,
    } = useGet(
        id ? `/return-types/${id}` : "",
        `return_type_detail_${id}`,
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
        createJsonMutationConfig(queryClient, "return_types_list"),
    )

    const updateMutation = useMutation<any, Error, MutationParameters>(
        updateJsonMutationConfig(queryClient, "return_types_list"),
    )

    const deleteMutation = useMutation(deleteMutationConfig(queryClient, "return_types_list"))

    // --- CREATE DOCUMENT TYPE ---
    const createDocumentType = async (): Promise<void> => {
        setIsLoading(true)
        try {
            const payload = {
                name: formState.name,
            }

            const response = await createMutation.mutateAsync({
                url: '/return-types',
                data: payload,
            })

            if (response?.success) {
                toast.success(response.message || "Return type created successfully")
                refetchList()
                setFormState(initialFormState)
            } else {
                toast.error(response?.message || "Failed to create return type")
            }
        } catch (err: any) {
            const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to create return type"
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    // --- UPDATE DOCUMENT TYPE ---
    const updateDocumentType = async (): Promise<void> => {
        if (!id) return
        setIsLoading(true)
        try {
            const payload = {
                name: formState.name,
            }

            const response = await updateMutation.mutateAsync({
                url: `/return-types/${id}`,
                data: payload,
            })

            if (response?.success) {
                toast.success(response.message || "Return type updated successfully")
                queryClient.invalidateQueries({ queryKey: [`return_types_list${id}`] })
                queryClient.invalidateQueries({ queryKey: ["return_types_list"] })
            } else {
                toast.error(response?.message || "Failed to update return type")
            }
        } catch (err: any) {
            const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to update return type"
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    // --- DELETE DOCUMENT TYPE ---
    const onDeleteDocumentType = async (id: string) => {
        try {
            await deleteMutation.mutateAsync(`/return-types/${id}`)
            toast.success("Return type deleted successfully")
            queryClient.invalidateQueries({ queryKey: [`return_types_list${id}`] })
            queryClient.invalidateQueries({ queryKey: ["return_types_list"] })
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to delete return type"

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
        if (pageName === "return-types") {
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
        createDocumentType,
        updateDocumentType,
        isLoading,
        // Delete
        onDeleteDocumentType,
    }
}