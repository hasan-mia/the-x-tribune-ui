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
import useCustomToast from "@/hooks/use-custom-toast"

interface FaqFormState {
    question: string
    answer: string
    category: string
    is_active: boolean
    sort_order: number
}

export default function useFaqs(pageName?: string, id?: string) {
    const toast = useCustomToast()
    const queryClient = useQueryClient()
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const initialFormState: FaqFormState = {
        question: "",
        answer: "",
        category: "services",
        is_active: true,
        sort_order: 1,
    }

    const [formState, setFormState] = useState<FaqFormState>(initialFormState)

    const handleInputChange = (e: any) => {
        const { name, value } = e.target
        setFormState((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // --- LIST FAQs ---
    const {
        data: listData,
        isPending: listLoading,
        refetch: refetchList,
        isError: listError
    } = useGet(
        `/faqs?search=${encodeURIComponent(search || "")}`,
        "faqs_list",
        pageName === "faqs",
    )

    console.log(listData)

    // --- GET SINGLE FAQ ---
    const {
        data: details,
        isPending: detailLoading,
        refetch: refetchDetail,
    } = useGet(
        id ? `/faqs/${id}` : "",
        `faq_detail_${id}`,
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
                question: details.data.question || "",
                answer: details.data.answer || "",
                category: details.data.category || "services",
                is_active: details.data.is_active ?? true,
                sort_order: details.data.sort_order || 1,
            })
        }
    }, [details?.data, pageName])

    // --- MUTATIONS ---
    const createMutation = useMutation<any, Error, MutationParameters>(
        createJsonMutationConfig(queryClient, "faqs_list"),
    )

    const updateMutation = useMutation<any, Error, MutationParameters>(
        updateJsonMutationConfig(queryClient, "faqs_list"),
    )

    const deleteMutation = useMutation(deleteMutationConfig(queryClient, "faqs_list"))

    // --- CREATE FAQ ---
    const createFaq = async (): Promise<void> => {
        setIsLoading(true)
        try {
            const payload = {
                question: formState.question,
                answer: formState.answer,
                category: formState.category,
                is_active: formState.is_active,
                sort_order: formState.sort_order,
            }

            const response = await createMutation.mutateAsync({
                url: '/faqs',
                data: payload,
            })

            if (response?.success) {
                toast.success(response.message || "FAQ created successfully")
                refetchList()
                setFormState(initialFormState)
            } else {
                toast.error(response?.message || "Failed to create FAQ")
            }
        } catch (err: any) {
            const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to create FAQ"
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    // --- UPDATE FAQ ---
    const updateFaq = async (): Promise<void> => {
        if (!id) return
        setIsLoading(true)
        try {
            const payload = {
                question: formState.question,
                answer: formState.answer,
                category: formState.category,
                is_active: formState.is_active,
                sort_order: formState.sort_order,
            }

            const response = await updateMutation.mutateAsync({
                url: `/faqs/${id}`,
                data: payload,
            })

            if (response?.success) {
                toast.success(response.message || "FAQ updated successfully")
                queryClient.invalidateQueries({ queryKey: [`faq_detail_${id}`] })
                queryClient.invalidateQueries({ queryKey: ["faqs_list"] })
            } else {
                toast.error(response?.message || "Failed to update FAQ")
            }
        } catch (err: any) {
            const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to update FAQ"
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    // --- DELETE FAQ ---
    const onDeleteFaq = async (id: string) => {
        try {
            await deleteMutation.mutateAsync(`/faqs/${id}`)
            toast.success("FAQ deleted successfully")
            queryClient.invalidateQueries({ queryKey: [`faq_detail_${id}`] })
            queryClient.invalidateQueries({ queryKey: ["faqs_list"] })
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to delete FAQ"

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
        if (pageName === "faqs") {
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
        createFaq,
        updateFaq,
        isLoading,
        // Delete
        onDeleteFaq,
    }
}