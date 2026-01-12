"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import {
    createJsonMutationConfig,
    deleteMutationConfig,
    updateJsonMutationConfig,
    useGet,
} from "@/api/api"
import { AxiosError } from "axios"
import { useUploadFiles } from "@/api/file"
import useCustomToast from "@/hooks/use-custom-toast"

interface ServiceFeature {
    feature_text: string
    is_included: boolean
    sort_order: number
}

interface ServiceFormState {
    title: string
    slug: string
    icon: string
    short_description: string
    description: string
    service_type: "free_consultation" | "paid_service" | "subscription"
    price: number
    currency: string
    plan_id: string | null
    requires_scheduling: boolean
    duration: number | null
    meeting_color: string
    featured_image: string
    is_active: boolean
    is_featured: boolean
    sort_order: number
    meta_title: string
    meta_description: string
    features: ServiceFeature[]
}

export default function useServices(pageName?: string, id?: string) {
    const toast = useCustomToast()
    const queryClient = useQueryClient()
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [search, setSearch] = useState("")
    const [serviceTypeFilter, setServiceTypeFilter] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)

    const uploadMutation = useUploadFiles()

    const initialFormState: ServiceFormState = {
        title: "",
        slug: "",
        icon: "",
        short_description: "",
        description: "",
        service_type: "paid_service",
        price: 0,
        currency: "USD",
        plan_id: null,
        requires_scheduling: false,
        duration: null,
        meeting_color: "",
        featured_image: "",
        is_active: true,
        is_featured: false,
        sort_order: 0,
        meta_title: "",
        meta_description: "",
        features: [],
    }

    const [formState, setFormState] = useState<ServiceFormState>(initialFormState)

    const handleInputChange = (e: any) => {
        const { name, value, type } = e.target
        setFormState((prev) => ({
            ...prev,
            [name]: type === "number" ? parseFloat(value) || 0 : value,
        }))
    }

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
    }

    // Build query params
    const queryParams = useMemo(() => {
        const params = new URLSearchParams()
        params.append('page', page.toString())
        params.append('limit', limit.toString())
        if (search) params.append('search', search)
        if (serviceTypeFilter && serviceTypeFilter !== "all") params.append('service_type', serviceTypeFilter)

        return params.toString()
    }, [page, limit, search, serviceTypeFilter])

    // --- LIST SERVICES ---
    const {
        data: listData,
        isPending: listLoading,
        refetch: refetchList,
        isError: listError
    } = useGet(
        `/services/admin/all?${queryParams}`,
        "services_list",
        pageName === "services",
    )

    // --- GET SINGLE SERVICE ---
    const {
        data: details,
        isPending: detailLoading,
        refetch: refetchDetail,
    } = useGet(
        id ? `/services/${id}` : "",
        `service_detail_${id}`,
        pageName === "update" && !!id,
    )

    // Reset form state when ID changes
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
            const service = details.data
            setFormState({
                title: service.title || "",
                slug: service.slug || "",
                icon: service.icon || "",
                short_description: service.short_description || "",
                description: service.description || "",
                service_type: service.service_type || "paid_service",
                price: service.price || 0,
                currency: service.currency || "USD",
                plan_id: service.plan_id || null,
                requires_scheduling: service.requires_scheduling ?? false,
                duration: service.duration || null,
                meeting_color: service.meeting_color || "",
                featured_image: service.featured_image || "",
                is_active: service.is_active ?? true,
                is_featured: service.is_featured ?? false,
                sort_order: service.sort_order || 0,
                meta_title: service.meta_title || "",
                meta_description: service.meta_description || "",
                features: service.features?.map((f: any) => ({
                    feature_text: f.feature_text,
                    is_included: f.is_included ?? true,
                    sort_order: f.sort_order || 0,
                })) || [],
            })
        }
    }, [details?.data, pageName])

    // --- MUTATIONS ---
    const createMutation = useMutation(
        createJsonMutationConfig(queryClient, "services_list"),
    )

    const updateMutation = useMutation(
        updateJsonMutationConfig(queryClient, "services_list"),
    )

    const deleteMutation = useMutation(deleteMutationConfig(queryClient, "services_list"))

    // --- UPLOAD IMAGE ---
    const onUploadImage = async (file: File, fieldName: 'icon' | 'featured_image') => {
        setUploadingImage(true)
        try {
            const formData = new FormData()
            formData.append("file", file)

            const response = await uploadMutation.mutateAsync(formData)

            if (response?.success && response?.data) {
                setFormState((prev) => ({
                    ...prev,
                    [fieldName]: response.data,
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

    const removeImage = (fieldName: 'icon' | 'featured_image') => {
        setFormState((prev) => ({
            ...prev,
            [fieldName]: "",
        }))
    }

    // --- FEATURE MANAGEMENT ---
    const addFeature = () => {
        setFormState((prev) => ({
            ...prev,
            features: [
                ...prev.features,
                {
                    feature_text: "",
                    is_included: true,
                    sort_order: prev.features.length,
                },
            ],
        }))
    }

    const updateFeature = (index: number, field: keyof ServiceFeature, value: any) => {
        setFormState((prev) => ({
            ...prev,
            features: prev.features.map((f, i) =>
                i === index ? { ...f, [field]: value } : f
            ),
        }))
    }

    const removeFeature = (index: number) => {
        setFormState((prev) => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index),
        }))
    }

    // --- CREATE SERVICE ---
    const createService = async (): Promise<boolean> => {
        setIsLoading(true)
        try {
            // Validation
            if (!formState.title) {
                toast.error("Title is required")
                return false
            }

            if (formState.service_type === "subscription" && !formState.plan_id) {
                toast.error("Plan ID is required for subscription services")
                return false
            }

            if (formState.requires_scheduling && !formState.duration) {
                toast.error("Duration is required for services that require scheduling")
                return false
            }

            const payload = {
                ...formState,
                slug: formState.slug || generateSlug(formState.title),
                features: formState.features.filter(f => f.feature_text.trim()),
            }

            const response = await createMutation.mutateAsync({
                url: '/services',
                data: payload,
            })

            if (response?.success) {
                toast.success(response.message || "Service created successfully")
                refetchList()
                setFormState(initialFormState)
                return true
            } else {
                toast.error(response?.message || "Failed to create service")
                return false
            }
        } catch (err: any) {
            const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to create service"
            toast.error(errorMessage)
            return false
        } finally {
            setIsLoading(false)
        }
    }

    // --- UPDATE SERVICE ---
    const updateService = async (): Promise<boolean> => {
        if (!id) return false
        setIsLoading(true)
        try {
            // Validation
            if (!formState.title) {
                toast.error("Title is required")
                return false
            }

            if (formState.service_type === "subscription" && !formState.plan_id) {
                toast.error("Plan ID is required for subscription services")
                return false
            }

            if (formState.requires_scheduling && !formState.duration) {
                toast.error("Duration is required for services that require scheduling")
                return false
            }

            const payload = {
                ...formState,
                features: formState.features.filter(f => f.feature_text.trim()),
            }

            const response = await updateMutation.mutateAsync({
                url: `/services/${id}`,
                data: payload,
            })

            if (response?.success) {
                toast.success(response.message || "Service updated successfully")
                queryClient.invalidateQueries({ queryKey: [`service_detail_${id}`] })
                queryClient.invalidateQueries({ queryKey: ["services_list"] })
                return true
            } else {
                toast.error(response?.message || "Failed to update service")
                return false
            }
        } catch (err: any) {
            const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to update service"
            toast.error(errorMessage)
            return false
        } finally {
            setIsLoading(false)
        }
    }

    // --- DELETE SERVICE ---
    const onDeleteService = async (id: string) => {
        try {
            await deleteMutation.mutateAsync(`/services/${id}`)
            toast.success("Service deleted successfully")
            queryClient.invalidateQueries({ queryKey: [`service_detail_${id}`] })
            queryClient.invalidateQueries({ queryKey: ["services_list"] })
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to delete service"
            toast.error(errorMessage)
        }
    }

    const fetchData = useCallback(async () => {
        await refetchList()
    }, [refetchList])

    const memoizedFetchData = useMemo(() => fetchData, [fetchData])

    useEffect(() => {
        if (pageName === "services") {
            memoizedFetchData()
            const timeout = setTimeout(() => {
                memoizedFetchData()
            }, 500)
            return () => clearTimeout(timeout)
        }
    }, [memoizedFetchData, page, limit, search, serviceTypeFilter, pageName])


    // const handleFilter = useCallback((filters: Record<string, string>) => {
    //     setColumnFilters(filters)
    //     setPage(1)
    // }, [])

    const handleTypeFilter = useCallback((value: string) => {
        setServiceTypeFilter(value)
        setPage(1)
    }, [])


    // Handle search
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
        setPage(1)
    }



    return {
        page,
        setPage,
        limit,
        setLimit,
        search,
        setSearch,
        serviceTypeFilter,
        setServiceTypeFilter,
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
        createService,
        updateService,
        isLoading,
        onDeleteService,
        // Image upload
        uploadingImage,
        onUploadImage,
        removeImage,
        // Features
        addFeature,
        updateFeature,
        removeFeature,

        // filter
        handleTypeFilter,
    }
}
