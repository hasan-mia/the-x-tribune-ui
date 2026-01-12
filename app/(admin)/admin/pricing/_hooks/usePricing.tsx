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

interface PlanFeature {
    feature: string
    is_included: boolean
    sort_order: number
}

interface PricingFormState {
    name: string
    slug: string
    icon: string
    description: string
    monthly_price: number
    annual_price: number
    stripe_monthly_price_id: string
    stripe_annual_price_id: string
    stripe_product_id: string
    is_popular: boolean
    is_active: boolean
    sort_order: number
    trial_days: number
    features: PlanFeature[]
}

export default function usePricing(pageName?: string, id?: string) {
    const toast = useCustomToast()
    const queryClient = useQueryClient()
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)

    const uploadMutation = useUploadFiles()

    const initialFormState: PricingFormState = {
        name: "",
        slug: "",
        icon: "",
        description: "",
        monthly_price: 0,
        annual_price: 0,
        stripe_monthly_price_id: "",
        stripe_annual_price_id: "",
        stripe_product_id: "",
        is_popular: false,
        is_active: true,
        sort_order: 0,
        trial_days: 0,
        features: [],
    }

    const [formState, setFormState] = useState<PricingFormState>(initialFormState)

    const handleInputChange = (e: any) => {
        const { name, value, type } = e.target
        setFormState((prev) => ({
            ...prev,
            [name]: type === "number" ? parseFloat(value) || 0 : value,
        }))
    }

    const generateSlug = (name: string) => {
        return name
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
        return params.toString()
    }, [page, limit, search])

    // --- LIST PRICING PLANS ---
    const {
        data: listData,
        isPending: listLoading,
        refetch: refetchList,
        isError: listError
    } = useGet(
        `/pricing?${queryParams}`,
        "pricing_plans_list",
        pageName === "pricing",
    )

    // --- GET SINGLE PLAN ---
    const {
        data: details,
        isPending: detailLoading,
        refetch: refetchDetail,
    } = useGet(
        id ? `/pricing/${id}` : "",
        `pricing_plan_detail_${id}`,
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
            const plan = details.data
            setFormState({
                name: plan.name || "",
                slug: plan.slug || "",
                icon: plan.icon || "",
                description: plan.description || "",
                monthly_price: plan.monthly_price || 0,
                annual_price: plan.annual_price || 0,
                stripe_monthly_price_id: plan.stripe_monthly_price_id || "",
                stripe_annual_price_id: plan.stripe_annual_price_id || "",
                stripe_product_id: plan.stripe_product_id || "",
                is_popular: plan.is_popular ?? false,
                is_active: plan.is_active ?? true,
                sort_order: plan.sort_order || 0,
                trial_days: plan.trial_days || 0,
                features: plan.features?.map((f: any) => ({
                    feature: f.feature,
                    is_included: f.is_included ?? true,
                    sort_order: f.sort_order || 0,
                })) || [],
            })
        }
    }, [details?.data, pageName])

    // --- MUTATIONS ---
    const createMutation = useMutation(
        createJsonMutationConfig(queryClient, "pricing_plans_list"),
    )

    const updateMutation = useMutation(
        updateJsonMutationConfig(queryClient, "pricing_plans_list"),
    )

    const deleteMutation = useMutation(deleteMutationConfig(queryClient, "pricing_plans_list"))

    // --- UPLOAD IMAGE ---
    const onUploadIcon = async (file: File) => {
        setUploadingImage(true)
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
            setUploadingImage(false)
        }
    }

    const removeIcon = () => {
        setFormState((prev) => ({
            ...prev,
            icon: "",
        }))
    }

    // --- FEATURE MANAGEMENT ---
    const addFeature = () => {
        setFormState((prev) => ({
            ...prev,
            features: [
                ...prev.features,
                {
                    feature: "",
                    is_included: true,
                    sort_order: prev.features.length,
                },
            ],
        }))
    }

    const updateFeature = (index: number, field: keyof PlanFeature, value: any) => {
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

    // --- CREATE PRICING PLAN ---
    const createPricingPlan = async (): Promise<boolean> => {
        setIsLoading(true)
        try {
            // Validation
            if (!formState.name) {
                toast.error("Name is required")
                return false
            }

            if (formState.monthly_price <= 0) {
                toast.error("Monthly price must be greater than 0")
                return false
            }

            if (formState.annual_price <= 0) {
                toast.error("Annual price must be greater than 0")
                return false
            }

            const payload = {
                ...formState,
                slug: formState.slug || generateSlug(formState.name),
                features: formState.features.filter(f => f.feature.trim()),
            }

            const response = await createMutation.mutateAsync({
                url: '/pricing',
                data: payload,
            })

            if (response?.success) {
                toast.success(response.message || "Pricing plan created successfully")
                refetchList()
                setFormState(initialFormState)
                return true
            } else {
                toast.error(response?.message || "Failed to create pricing plan")
                return false
            }
        } catch (err: any) {
            const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to create pricing plan"
            toast.error(errorMessage)
            return false
        } finally {
            setIsLoading(false)
        }
    }

    // --- UPDATE PRICING PLAN ---
    const updatePricingPlan = async (): Promise<boolean> => {
        if (!id) return false
        setIsLoading(true)
        try {
            // Validation
            if (!formState.name) {
                toast.error("Name is required")
                return false
            }

            if (formState.monthly_price <= 0) {
                toast.error("Monthly price must be greater than 0")
                return false
            }

            if (formState.annual_price <= 0) {
                toast.error("Annual price must be greater than 0")
                return false
            }

            const payload = {
                ...formState,
                features: formState.features.filter(f => f.feature.trim()),
            }

            const response = await updateMutation.mutateAsync({
                url: `/pricing/${id}`,
                data: payload,
            })

            if (response?.success) {
                toast.success(response.message || "Pricing plan updated successfully")
                queryClient.invalidateQueries({ queryKey: [`pricing_plan_detail_${id}`] })
                queryClient.invalidateQueries({ queryKey: ["pricing_plans_list"] })
                return true
            } else {
                toast.error(response?.message || "Failed to update pricing plan")
                return false
            }
        } catch (err: any) {
            const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to update pricing plan"
            toast.error(errorMessage)
            return false
        } finally {
            setIsLoading(false)
        }
    }

    // --- DELETE PRICING PLAN ---
    const onDeletePricingPlan = async (id: string) => {
        try {
            await deleteMutation.mutateAsync(`/pricing/${id}`)
            toast.success("Pricing plan deleted successfully")
            queryClient.invalidateQueries({ queryKey: [`pricing_plan_detail_${id}`] })
            queryClient.invalidateQueries({ queryKey: ["pricing_plans_list"] })
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to delete pricing plan"
            toast.error(errorMessage)
        }
    }

    const fetchData = useCallback(async () => {
        await refetchList()
    }, [refetchList])

    const memoizedFetchData = useMemo(() => fetchData, [fetchData])

    useEffect(() => {
        if (pageName === "pricing") {
            memoizedFetchData()
            const timeout = setTimeout(() => {
                memoizedFetchData()
            }, 500)
            return () => clearTimeout(timeout)
        }
    }, [memoizedFetchData, page, limit, search, pageName])

    return {
        page,
        setPage,
        limit,
        setLimit,
        search,
        setSearch,
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
        createPricingPlan,
        updatePricingPlan,
        isLoading,
        onDeletePricingPlan,
        // Image upload
        uploadingImage,
        onUploadIcon,
        removeIcon,
        // Features
        addFeature,
        updateFeature,
        removeFeature,
    }
}
