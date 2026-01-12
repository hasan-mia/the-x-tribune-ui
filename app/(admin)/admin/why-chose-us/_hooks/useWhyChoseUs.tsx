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
import { useUploadFiles } from "@/api/file"
import useCustomToast from "@/hooks/use-custom-toast"

interface WhyChoseUsFormState {
    title: string
    slug: string
    description: string
    icon: string
    is_active: boolean
    sort_order: number
}

export default function useWhyChoseUs(pageName?: string, id?: string) {
    const toast = useCustomToast()
    const queryClient = useQueryClient()
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [uploadingIcon, setUploadingIcon] = useState(false)

    // File upload mutation
    const uploadMutation = useUploadFiles()

    const initialFormState: WhyChoseUsFormState = {
        title: "",
        slug: "",
        description: "",
        icon: "",
        is_active: true,
        sort_order: 1,
    }

    const [formState, setFormState] = useState<WhyChoseUsFormState>(initialFormState)

    const handleInputChange = (e: any) => {
        const { name, value } = e.target
        setFormState((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // Auto-generate slug from title
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
    }

    // --- LIST WHY CHOSE US ---
    const {
        data: listData,
        isPending: listLoading,
        refetch: refetchList,
        isError: listError
    } = useGet(
        `/why-chose-us?page=${page}&limit=${encodeURIComponent(limit)}&search=${encodeURIComponent(search || "")}`,
        "why_chose_us_list",
        pageName === "why-chose-us",
    )

    // --- GET SINGLE WHY CHOSE US ---
    const {
        data: details,
        isPending: detailLoading,
        refetch: refetchDetail,
    } = useGet(
        id ? `/why-chose-us/${id}` : "",
        `why_chose_us_detail_${id}`,
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
                title: details.data.title || "",
                slug: details.data.slug || "",
                description: details.data.description || "",
                icon: details.data.icon || "",
                is_active: details.data.is_active ?? true,
                sort_order: details.data.sort_order || 1,
            })
        }
    }, [details?.data, pageName])

    // --- MUTATIONS ---
    const createMutation = useMutation<any, Error, MutationParameters>(
        createJsonMutationConfig(queryClient, "why_chose_us_list"),
    )

    const updateMutation = useMutation<any, Error, MutationParameters>(
        updateJsonMutationConfig(queryClient, "why_chose_us_list"),
    )

    const deleteMutation = useMutation(deleteMutationConfig(queryClient, "why_chose_us_list"))

    // --- UPLOAD ICON IMAGE ---
    const onUploadIcon = async (file: File) => {
        setUploadingIcon(true)
        try {
            const formData = new FormData()
            formData.append("file", file)

            const response = await uploadMutation.mutateAsync(formData)

            if (response?.success && response?.data) {
                setFormState((prev) => ({
                    ...prev,
                    icon: response.data,
                }))
                toast.success("Icon uploaded successfully")
            }
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data?.message || "Upload failed")
            } else {
                toast.error("Upload failed")
            }
        } finally {
            setUploadingIcon(false)
        }
    }

    // Remove icon image
    const removeIcon = () => {
        setFormState((prev) => ({
            ...prev,
            icon: "",
        }))
    }

    // --- CREATE WHY CHOSE US ---
    const createWhyChoseUs = async (): Promise<void> => {
        setIsLoading(true)
        try {
            const payload = {
                title: formState.title,
                slug: formState.slug || generateSlug(formState.title),
                description: formState.description,
                icon: formState.icon,
                is_active: formState.is_active,
                sort_order: formState.sort_order,
            }

            const response = await createMutation.mutateAsync({
                url: '/why-chose-us',
                data: payload,
            })

            if (response?.success) {
                toast.success(response.message || "Why Chose Us created successfully")
                refetchList()
                setFormState(initialFormState)
            } else {
                toast.error(response?.message || "Failed to create Why Chose Us")
            }
        } catch (err: any) {
            const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to create Why Chose Us"
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    // --- UPDATE WHY CHOSE US ---
    const updateWhyChoseUs = async (): Promise<void> => {
        if (!id) return
        setIsLoading(true)
        try {
            const payload = {
                title: formState.title,
                description: formState.description,
                icon: formState.icon,
                is_active: formState.is_active,
                sort_order: formState.sort_order,
            }

            const response = await updateMutation.mutateAsync({
                url: `/why-chose-us/${id}`,
                data: payload,
            })

            if (response?.success) {
                toast.success(response.message || "Why Chose Us updated successfully")
                queryClient.invalidateQueries({ queryKey: [`why_chose_us_detail_${id}`] })
                queryClient.invalidateQueries({ queryKey: ["why_chose_us_list"] })
            } else {
                toast.error(response?.message || "Failed to update Why Chose Us")
            }
        } catch (err: any) {
            const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to update Why Chose Us"
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    // --- DELETE WHY CHOSE US ---
    const onDeleteWhyChoseUs = async (id: string) => {
        try {
            await deleteMutation.mutateAsync(`/why-chose-us/${id}`)
            toast.success("Why Chose Us deleted successfully")
            queryClient.invalidateQueries({ queryKey: [`why_chose_us_detail_${id}`] })
            queryClient.invalidateQueries({ queryKey: ["why_chose_us_list"] })
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to delete Why Chose Us"

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
        if (pageName === "why-chose-us") {
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
        generateSlug,
        // Actions
        createWhyChoseUs,
        updateWhyChoseUs,
        isLoading,
        // Delete
        onDeleteWhyChoseUs,
        // Icon upload
        uploadingIcon,
        onUploadIcon,
        removeIcon,
    }
}