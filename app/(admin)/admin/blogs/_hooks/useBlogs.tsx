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

export default function useBlogs(pageName?: string, id?: string) {
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
        slug: "",
        excerpt: "",
        content: "",
        featured_image: "",
        category_id: "",
        read_time: "",
        status: "draft" as "draft" | "published",
        is_featured: false,
        meta_title: "",
        meta_description: "",
    }

    const [formState, setFormState] = useState(initialFormState)

    const handleInputChange = (e: any) => {
        const { name, value, type, checked } = e.target
        setFormState((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    // Custom handler for content (rich text editor)
    const handleContentChange = (value: string) => {
        setFormState((prev) => ({
            ...prev,
            content: value,
        }))
    }

    // --- LIST BLOGS ---
    const {
        data: listData,
        isPending: listLoading,
        refetch: refetchList,
        isError: listError
    } = useGet(
        `/blogs/all/?page=${page}&limit=${encodeURIComponent(limit)}&search=${encodeURIComponent(search || "")}`,
        "blogs_list",
        pageName === "blogs",
    )

    // --- GET SINGLE BLOG ---
    const {
        data: details,
        isPending: detailLoading,
        refetch: refetchDetail,
    } = useGet(
        id ? `/blogs/${id}` : "",
        `blog_detail_${id}`,
        pageName === "update" && !!id,
    )

    // --- GET CATEGORIES (for dropdown) ---
    const {
        data: categoriesData,
        isPending: categoriesLoading,
    } = useGet(
        `/categories?page=1&limit=100`,
        "categories_all",
        true, // Always fetch categories
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
                excerpt: details.data.excerpt || "",
                content: details.data.content || "",
                featured_image: details.data.featured_image || "",
                category_id: details.data.category_id || "",
                read_time: details.data.read_time || "",
                status: details.data.status || "draft",
                is_featured: details.data.is_featured || false,
                meta_title: details.data.meta_title || "",
                meta_description: details.data.meta_description || "",
            })
        }
    }, [details?.data, pageName])

    // --- MUTATIONS ---
    const createMutation = useMutation<any, Error, MutationParameters>(
        createJsonMutationConfig(queryClient, "blogs_list"),
    )

    const updateMutation = useMutation<any, Error, MutationParameters>(
        updateJsonMutationConfig(queryClient, "blogs_list"),
    )

    const deleteMutation = useMutation(deleteMutationConfig(queryClient, "blogs_list"))

    // --- UPLOAD FEATURED IMAGE ---
    const onUploadImage = async (file: File) => {
        setUploadingImage(true)
        try {
            const formData = new FormData()
            formData.append("file", file)

            const response = await uploadMutation.mutateAsync(formData)

            if (response?.success && response?.data) {
                setFormState((prev) => ({
                    ...prev,
                    featured_image: response.data,
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

    // Remove featured image
    const removeFeaturedImage = () => {
        setFormState((prev) => ({
            ...prev,
            featured_image: "",
        }))
    }

    // --- CREATE BLOG ---
    const createBlog = async (): Promise<void> => {
        setIsLoading(true)
        try {
            const payload = {
                title: formState.title,
                slug: formState.slug,
                excerpt: formState.excerpt,
                content: formState.content,
                featured_image: formState.featured_image,
                category_id: formState.category_id,
                read_time: formState.read_time,
                status: formState.status,
                is_featured: formState.is_featured,
                meta_title: formState.meta_title,
                meta_description: formState.meta_description,
            }

            const response = await createMutation.mutateAsync({
                url: '/blogs',
                data: payload,
            })

            if (response?.success) {
                toast.success(response.message)
                router.push("/admin/blogs")
            }
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data?.message || "Failed to create blog")
            }
        } finally {
            setIsLoading(false)
        }
    }

    // --- UPDATE BLOG ---
    const updateBlog = async (): Promise<void> => {
        if (!id) return
        setIsLoading(true)
        try {
            const payload = {
                title: formState.title,
                slug: formState.slug,
                excerpt: formState.excerpt,
                content: formState.content,
                featured_image: formState.featured_image,
                category_id: formState.category_id,
                read_time: formState.read_time,
                status: formState.status,
                is_featured: formState.is_featured,
                meta_title: formState.meta_title,
                meta_description: formState.meta_description,
            }

            const response = await updateMutation.mutateAsync({
                url: `/blogs/${id}`,
                data: payload,
            })

            if (response?.success) {
                toast.success(response.message)
                queryClient.invalidateQueries({ queryKey: [`blog_detail_${id}`] })
                queryClient.invalidateQueries({ queryKey: ["blogs_list"] })
                router.push("/admin/blogs")
            }
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data?.message || "Failed to update blog")
            }
        } finally {
            setIsLoading(false)
        }
    }

    // --- DELETE BLOG ---
    const onDeleteBlog = async (id: string) => {
        try {
            const response = await deleteMutation.mutateAsync(`/blogs/${id}`)
            if (response) {
                toast.success("Blog deleted successfully")
                queryClient.invalidateQueries({ queryKey: [`blog_detail_${id}`] })
                queryClient.invalidateQueries({ queryKey: ["blogs_list"] })
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error?.response?.data?.message || "Failed to delete blog")
            } else {
                console.error("An error occurred:", error)
            }
        }
    }

    // Status change
    const handleStatusChange = async (id: string, value: "draft" | "published") => {
        try {
            const response = await updateMutation.mutateAsync({
                url: `/blogs/${id}`,
                data: { status: value },
            })

            if (response) {
                toast.success("Status changed successfully")
                queryClient.invalidateQueries({ queryKey: ["blogs_list"] })
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
        if (pageName === "blogs") {
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
        handleStatusChange,
        // List
        listData,
        listLoading,
        refetchList,
        listError,
        // Single detail
        details,
        detailLoading,
        refetchDetail,
        // Categories
        categories: categoriesData?.data || [],
        categoriesLoading,
        // Form
        formState,
        handleInputChange,
        handleContentChange,
        setFormState,
        // Actions
        createBlog,
        updateBlog,
        isLoading,
        // Delete
        onDeleteBlog,
        // Image upload
        uploadingImage,
        onUploadImage,
        removeFeaturedImage,
    }
}