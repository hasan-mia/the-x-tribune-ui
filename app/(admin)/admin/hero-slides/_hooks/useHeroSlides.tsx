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
import { useRouter } from "next/navigation"
import { useUploadFiles } from "@/api/file"
import useCustomToast from "@/hooks/use-custom-toast"

export default function useHeroSlides(pageName?: string, id?: string) {
    const toast = useCustomToast()
    const queryClient = useQueryClient()
    const router = useRouter()
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)

    // File upload mutation
    const uploadMutation = useUploadFiles()

    // Initial form state
    const initialFormState = {
        title: "",
        description: "",
        image_url: "",
        image_alt: "",
        primary_btn_text: "",
        primary_btn_link: "",
        secondary_btn_text: "",
        secondary_btn_link: "",
        badge_text: "",
        is_active: true,
        sort_order: 1,
        start_date: null as string | null,
        end_date: null as string | null,
    }

    const [formState, setFormState] = useState(initialFormState)

    const handleInputChange = (e: any) => {
        const { name, value, type, checked } = e.target
        setFormState((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    // --- LIST HERO SLIDES ---
    const {
        data: listData,
        isPending: listLoading,
        refetch: refetchList,
        isError: listError
    } = useGet(
        `/hero-slides/admin/all`,
        "hero_slides_list",
        pageName === "hero-slides",
    )

    // --- GET SINGLE HERO SLIDE ---
    const {
        data: details,
        isPending: detailLoading,
        refetch: refetchDetail,
    } = useGet(
        id ? `/hero-slides/${id}` : "",
        `hero_slide_detail_${id}`,
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
                description: details.data.description || "",
                image_url: details.data.image_url || "",
                image_alt: details.data.image_alt || "",
                primary_btn_text: details.data.primary_btn_text || "",
                primary_btn_link: details.data.primary_btn_link || "",
                secondary_btn_text: details.data.secondary_btn_text || "",
                secondary_btn_link: details.data.secondary_btn_link || "",
                badge_text: details.data.badge_text || "",
                is_active: details.data.is_active ?? true,
                sort_order: details.data.sort_order || 1,
                start_date: details.data.start_date || null,
                end_date: details.data.end_date || null,
            })
        }
    }, [details?.data, pageName])

    // --- MUTATIONS ---
    const createMutation = useMutation<any, Error, MutationParameters>(
        createJsonMutationConfig(queryClient, "hero_slides_list"),
    )

    const updateMutation = useMutation<any, Error, MutationParameters>(
        updateJsonMutationConfig(queryClient, "hero_slides_list"),
    )

    const deleteMutation = useMutation(deleteMutationConfig(queryClient, "hero_slides_list"))

    // --- UPLOAD IMAGE ---
    const onUploadImage = async (file: File) => {
        setUploadingImage(true)
        try {
            const formData = new FormData()
            formData.append("file", file)

            const response = await uploadMutation.mutateAsync(formData)

            if (response?.success && response?.data) {
                setFormState((prev) => ({
                    ...prev,
                    image_url: response.data,
                }))
                toast.success("Image uploaded successfully")
            }
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data?.message || "Upload failed")
            } else {
                toast.error("Upload failed")
            }
        } finally {
            setUploadingImage(false)
        }
    }

    // Remove image
    const removeImage = () => {
        setFormState((prev) => ({
            ...prev,
            image_url: "",
        }))
    }

    // --- CREATE HERO SLIDE ---
    const createHeroSlide = async (): Promise<void> => {
        setIsLoading(true)
        try {
            const payload = {
                title: formState.title,
                description: formState.description,
                image_url: formState.image_url,
                image_alt: formState.image_alt,
                primary_btn_text: formState.primary_btn_text,
                primary_btn_link: formState.primary_btn_link,
                secondary_btn_text: formState.secondary_btn_text,
                secondary_btn_link: formState.secondary_btn_link,
                badge_text: formState.badge_text,
                is_active: formState.is_active,
                sort_order: Number(formState.sort_order),
                start_date: formState.start_date || null,
                end_date: formState.end_date || null,
            }

            const response = await createMutation.mutateAsync({
                url: '/hero-slides',
                data: payload,
            })

            if (response?.success) {
                toast.success(response.message || "Hero slide created successfully")
                router.push("/admin/hero-slides")
            }
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data?.message || "Failed to create hero slide")
            }
        } finally {
            setIsLoading(false)
        }
    }

    // --- UPDATE HERO SLIDE ---
    const updateHeroSlide = async (): Promise<void> => {
        if (!id) return
        setIsLoading(true)
        try {
            const payload = {
                title: formState.title,
                description: formState.description,
                image_url: formState.image_url,
                image_alt: formState.image_alt,
                primary_btn_text: formState.primary_btn_text,
                primary_btn_link: formState.primary_btn_link,
                secondary_btn_text: formState.secondary_btn_text,
                secondary_btn_link: formState.secondary_btn_link,
                badge_text: formState.badge_text,
                is_active: formState.is_active,
                sort_order: Number(formState.sort_order),
                start_date: formState.start_date || null,
                end_date: formState.end_date || null,
            }

            const response = await updateMutation.mutateAsync({
                url: `/hero-slides/${id}`,
                data: payload,
            })

            if (response?.success) {
                toast.success(response.message || "Hero slide updated successfully")
                queryClient.invalidateQueries({ queryKey: [`hero_slide_detail_${id}`] })
                queryClient.invalidateQueries({ queryKey: ["hero_slides_list"] })
                router.push("/admin/hero-slides")
            }
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data?.message || "Failed to update hero slide")
            }
        } finally {
            setIsLoading(false)
        }
    }

    // --- DELETE HERO SLIDE ---
    const onDeleteHeroSlide = async (id: string) => {
        try {
            const response = await deleteMutation.mutateAsync(`/hero-slides/${id}`)
            if (response) {
                toast.success("Hero slide deleted successfully")
                queryClient.invalidateQueries({ queryKey: [`hero_slide_detail_${id}`] })
                queryClient.invalidateQueries({ queryKey: ["hero_slides_list"] })
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error?.response?.data?.message || "Failed to delete hero slide")
            } else {
                console.error("An error occurred:", error)
            }
        }
    }

    // Active status change
    const handleActiveChange = async (id: string, value: boolean) => {
        try {
            const response = await updateMutation.mutateAsync({
                url: `/hero-slides/${id}`,
                data: { is_active: value },
            })

            if (response) {
                toast.success("Status changed successfully")
                queryClient.invalidateQueries({ queryKey: ["hero_slides_list"] })
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error?.response?.data?.message || "Failed to change status")
            } else {
                console.error("An error occurred:", error)
            }
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
        if (pageName === "hero-slides") {
            memoizedFetchData()
        }
    }, [memoizedFetchData, pageName])

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
        handleActiveChange,
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
        createHeroSlide,
        updateHeroSlide,
        isLoading,
        // Delete
        onDeleteHeroSlide,
        // Image upload
        uploadingImage,
        onUploadImage,
        removeImage,
    }
}