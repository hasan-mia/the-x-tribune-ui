// app/(dashboard)/admin/testimonials/_hooks/useTestimonial.ts
"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import {
    deleteMutationConfig,
    type MutationParameters,
    updateJsonMutationConfig,
    createJsonMutationConfig,
    useGet,
} from "@/api/api"
import { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { useUploadFiles } from "@/api/file"
import useCustomToast from "@/hooks/use-custom-toast"

interface TestimonialFormState {
    name: string
    avatar: string
    role: string
    text: string
    rating: number
    isActive: boolean
    displayOrder: number
}

export default function useTestimonial(pageName?: string, testimonialId?: string) {
    const toast = useCustomToast()
    const queryClient = useQueryClient()
    const router = useRouter()
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [isLoading, setIsLoading] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)

    // File upload mutation
    const uploadMutation = useUploadFiles()

    // Initial form state
    const initialFormState: TestimonialFormState = {
        name: "",
        avatar: "",
        role: "",
        text: "",
        rating: 5,
        isActive: true,
        displayOrder: 0,
    }

    const [formState, setFormState] = useState<TestimonialFormState>(initialFormState)

    // Build query params
    const queryParams = useMemo(() => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        })
        if (search) params.append("search", search)
        if (statusFilter && statusFilter !== "all") params.append("isActive", statusFilter)
        return params.toString()
    }, [page, limit, search, statusFilter])

    // --- LIST TESTIMONIALS ---
    const {
        data: listData,
        isPending: listLoading,
        refetch: refetchList,
        isError: listError,
    } = useGet(
        `/testimonials?${queryParams}`,
        "testimonials_list",
        pageName === "testimonials"
    )

    // --- GET SINGLE TESTIMONIAL ---
    const {
        data: details,
        isPending: detailLoading,
        refetch: refetchDetail,
    } = useGet(
        testimonialId ? `/testimonials/${testimonialId}` : "",
        `testimonial_detail_${testimonialId}`,
        pageName === "update" && !!testimonialId
    )

    // Reset form state when ID changes or mode changes
    useEffect(() => {
        if (pageName === "update" && testimonialId) {
            setFormState(initialFormState)
        } else if (pageName !== "update") {
            setFormState(initialFormState)
        }
    }, [testimonialId, pageName])

    // Populate form state with details data
    useEffect(() => {
        if (details?.data && pageName === "update") {
            setFormState({
                name: details.data.name || "",
                avatar: details.data.avatar || "",
                role: details.data.role || "",
                text: details.data.text || "",
                rating: details.data.rating || 5,
                isActive: details.data.isActive ?? true,
                displayOrder: details.data.displayOrder || 0,
            })
        }
    }, [details?.data, pageName])

    // --- MUTATIONS ---
    const createMutation = useMutation<any, Error, MutationParameters>(
        createJsonMutationConfig(queryClient, "testimonials_list")
    )

    const updateMutation = useMutation<any, Error, MutationParameters>(
        updateJsonMutationConfig(queryClient, "testimonials_list")
    )

    const deleteMutation = useMutation(deleteMutationConfig(queryClient, "testimonials_list"))

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
                    avatar: response.data,
                }))
                toast.success("Avatar uploaded successfully")
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
            avatar: "",
        }))
    }

    // Handle input change
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target
        const checked = (e.target as HTMLInputElement).checked

        setFormState((prev) => ({
            ...prev,
            [name]: type === "checkbox"
                ? checked
                : name === "rating" || name === "displayOrder"
                    ? Number(value)
                    : value,
        }))
    }

    // --- CREATE TESTIMONIAL ---
    const createTestimonial = async (): Promise<void> => {
        setIsLoading(true)
        try {
            const payload = {
                name: formState.name,
                avatar: formState.avatar,
                role: formState.role,
                text: formState.text,
                rating: Number(formState.rating),
                isActive: formState.isActive,
                displayOrder: Number(formState.displayOrder),
            }

            const response = await createMutation.mutateAsync({
                url: "/testimonials",
                data: payload,
            })

            if (response?.success) {
                toast.success(response.message || "Testimonial created successfully")
                queryClient.invalidateQueries({ queryKey: ["testimonials_list"] })
                setFormState(initialFormState)
            }
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data?.message || "Failed to create testimonial")
            }
        } finally {
            setIsLoading(false)
        }
    }

    // --- UPDATE TESTIMONIAL ---
    const updateTestimonial = async (): Promise<void> => {
        if (!testimonialId) return
        setIsLoading(true)
        try {
            const payload = {
                name: formState.name,
                avatar: formState.avatar,
                role: formState.role,
                text: formState.text,
                rating: Number(formState.rating),
                isActive: formState.isActive,
                displayOrder: Number(formState.displayOrder),
            }

            const response = await updateMutation.mutateAsync({
                url: `/testimonials/${testimonialId}`,
                data: payload,
            })

            if (response?.success) {
                toast.success(response.message || "Testimonial updated successfully")
                queryClient.invalidateQueries({ queryKey: [`testimonial_detail_${testimonialId}`] })
                queryClient.invalidateQueries({ queryKey: ["testimonials_list"] })
            }
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data?.message || "Failed to update testimonial")
            }
        } finally {
            setIsLoading(false)
        }
    }

    // Status change
    const handleStatusChange = async (id: string, isActive: boolean) => {
        try {
            const response = await updateMutation.mutateAsync({
                url: `/testimonials/${id}`,
                data: { isActive },
            })

            if (response?.success) {
                toast.success("Status updated successfully")
                queryClient.invalidateQueries({ queryKey: ["testimonials_list"] })
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error?.response?.data?.message || "Failed to update status")
            } else {
                console.error("An error occurred:", error)
            }
        }
    }

    // --- DELETE TESTIMONIAL ---
    const onDeleteTestimonial = async (id: string) => {
        try {
            const response = await deleteMutation.mutateAsync(`/testimonials/${id}`)
            if (response) {
                toast.success("Testimonial deleted successfully")
                queryClient.invalidateQueries({ queryKey: [`testimonial_detail_${id}`] })
                queryClient.invalidateQueries({ queryKey: ["testimonials_list"] })
            }
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to delete testimonial"

            toast.error(errorMessage)
            console.log("Delete error:", error)
        }
    }

    const fetchData = useCallback(async () => {
        await refetchList()
    }, [refetchList])

    const memoizedFetchData = useMemo(() => fetchData, [fetchData])

    useEffect(() => {
        if (pageName === "testimonials") {
            memoizedFetchData()
            const timeout = setTimeout(() => {
                memoizedFetchData()
            }, 500)
            return () => clearTimeout(timeout)
        }
    }, [memoizedFetchData, page, limit, search, statusFilter, pageName])

    // Clear form state when component unmounts
    useEffect(() => {
        return () => {
            if (pageName === "update" || pageName === "create") {
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
        statusFilter,
        setStatusFilter,
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
        setFormState,
        handleInputChange,
        // Actions
        createTestimonial,
        updateTestimonial,
        handleStatusChange,
        onDeleteTestimonial,
        isLoading,
        // Image upload
        uploadingImage,
        onUploadImage,
        removeImage,
    }
}