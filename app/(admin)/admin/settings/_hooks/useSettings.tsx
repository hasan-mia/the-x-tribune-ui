"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import {
    createJsonMutationConfig,
    updateJsonMutationConfig,
    type MutationParameters,
    useGet,
} from "@/api/api"
import useCustomToast from "@/hooks/use-custom-toast"
import { AxiosError } from "axios"
import { useUploadFiles } from "@/api/file"

interface SettingFormState {
    key: string
    value: any
    description: string
}

export default function useSettings(pageName?: string, settingKey?: string) {
    const toast = useCustomToast()
    const queryClient = useQueryClient()
    const [isLoading, setIsLoading] = useState(false)

    const initialFormState: SettingFormState = {
        key: "",
        value: "",
        description: "",
    }

    const [formState, setFormState] = useState<SettingFormState>(initialFormState)

    // --- LIST ALL SETTINGS ---
    const {
        data: listData,
        isPending: listLoading,
        refetch: refetchList,
        isError: listError
    } = useGet(
        `/settings`,
        "settings_list",
        pageName === "settings",
    )

    // --- GET SINGLE SETTING ---
    const {
        data: details,
        isPending: detailLoading,
        refetch: refetchDetail,
    } = useGet(
        settingKey ? `/settings/${settingKey}` : "",
        `setting_detail_${settingKey}`,
        pageName === "update" && !!settingKey,
    )

    // Reset form state when key changes
    useEffect(() => {
        if (pageName === "update" && settingKey) {
            setFormState(initialFormState)
        } else if (pageName !== "update") {
            setFormState(initialFormState)
        }
    }, [settingKey, pageName])

    // Populate form state with details data
    useEffect(() => {
        if (details?.data && pageName === "update") {
            setFormState({
                key: details.data.key || "",
                value: details.data.value || "",
                description: details.data.description || "",
            })
        }
    }, [details?.data, pageName])

    // --- MUTATIONS ---
    const createMutation = useMutation<any, Error, MutationParameters>(
        createJsonMutationConfig(queryClient, "settings_list"),
    )

    const updateMutation = useMutation<any, Error, MutationParameters>(
        updateJsonMutationConfig(queryClient, "settings_list"),
    )

    // File upload mutation
    const uploadMutation = useUploadFiles()

    // --- CREATE SETTING ---
    const createSetting = async (payload: SettingFormState): Promise<any> => {
        setIsLoading(true)
        try {
            const response = await createMutation.mutateAsync({
                url: '/settings',
                data: payload,
            })

            if (response?.success) {
                toast.success(response.message || "Setting created successfully")
                refetchList()
                setFormState(initialFormState)
                return response
            } else {
                toast.error(response?.message || "Failed to create setting")
                return null
            }
        } catch (err: any) {
            const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to create setting"
            toast.error(errorMessage)
            return null
        } finally {
            setIsLoading(false)
        }
    }

    // --- UPDATE SETTING ---
    const updateSetting = async (key: string, payload: SettingFormState): Promise<any> => {
        setIsLoading(true)
        try {
            const response = await updateMutation.mutateAsync({
                url: `/settings/${key}`,
                data: payload,
            })

            if (response?.success) {
                toast.success(response.message || "Setting updated successfully")
                queryClient.invalidateQueries({ queryKey: [`setting_detail_${key}`] })
                queryClient.invalidateQueries({ queryKey: ["settings_list"] })
                return response
            } else {
                toast.error(response?.message || "Failed to update setting")
                return null
            }
        } catch (err: any) {
            const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to update setting"
            toast.error(errorMessage)
            return null
        } finally {
            setIsLoading(false)
        }
    }

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

    const fetchData = useCallback(async () => {
        await refetchList()
    }, [refetchList])

    const memoizedFetchData = useMemo(() => fetchData, [fetchData])

    useEffect(() => {
        if (pageName === "settings") {
            memoizedFetchData()
        }
    }, [memoizedFetchData, pageName])

    return {
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
        // Actions
        createSetting,
        updateSetting,
        isLoading,

        onUploadImage,
        removeImage,
    }
}

function setUploadingImage(arg0: boolean) {
    throw new Error("Function not implemented.")
}
