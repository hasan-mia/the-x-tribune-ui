"use client";

import React, { useState, useEffect } from 'react';
import { Upload, X, Loader2, ImageIcon, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUploadFiles } from '@/api/file';
import { useGetSettings } from '@/api/settings';
import { http } from '@/config/http';
import useCustomToast from '@/hooks/use-custom-toast';

interface LogoFormState {
    icon: string;
    name: string;
}

interface LogoValue {
    icon: string;
    name: string;
}

interface UpdateLogoPayload {
    key: string;
    description: string;
    value: LogoValue;
}

interface UpdateLogoData {
    icon: string;
    name: string;
}

const LogoUpdate: React.FC = () => {
    const toast = useCustomToast();
    const [formState, setFormState] = useState<LogoFormState>({
        icon: '',
        name: 'logo'
    });
    const [uploadingImage, setUploadingImage] = useState<boolean>(false);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [imageError, setImageError] = useState<boolean>(false);
    const [isDirty, setIsDirty] = useState<boolean>(false);

    const queryClient = useQueryClient();
    const uploadMutation = useUploadFiles();
    const { data: logoSettings, isLoading: isLoadingSettings } = useGetSettings('logo');

    // Load existing logo settings
    useEffect(() => {
        if (logoSettings?.data?.value) {
            const value = logoSettings.data.value as LogoValue;
            setFormState({
                icon: value.icon || '',
                name: value.name || 'logo'
            });
            if (value.icon) {
                setPreviewUrl(value.icon);
                setImageError(false);
            }
        }
    }, [logoSettings]);

    // Update logo mutation
    const updateLogoMutation = useMutation({
        mutationFn: async (data: UpdateLogoData) => {
            const payload: UpdateLogoPayload = {
                key: 'logo',
                description: 'Logo information displayed on the website',
                value: {
                    icon: data.icon,
                    name: data.name
                }
            };

            const response = await http.put('/settings/logo', payload);

            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to update logo');
            }

            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings', 'logo'] });
            toast.success('Logo updated successfully');
            setIsDirty(false);
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update logo');
        }
    });

    const onUploadImage = async (file: File): Promise<void> => {
        setUploadingImage(true);
        setImageError(false);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await uploadMutation.mutateAsync(formData);

            if (response?.success && response?.data) {
                setFormState(prev => ({
                    ...prev,
                    icon: response.data
                }));
                setPreviewUrl(response.data);
                setIsDirty(true);
                toast.success('Image uploaded successfully');
            } else {
                throw new Error('Upload failed - no data returned');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Upload failed';
            toast.error(errorMessage);
            setImageError(true);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Please select a valid image file');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size must be less than 5MB');
                return;
            }

            onUploadImage(file);
        }
    };

    const handleUpdateLogo = (): void => {
        if (!formState.icon) {
            toast.error('Please upload an image first');
            return;
        }

        if (!formState.name.trim()) {
            toast.error('Please enter a display name');
            return;
        }

        updateLogoMutation.mutate({
            icon: formState.icon,
            name: formState.name
        });
    };

    const removeImage = (): void => {
        setFormState(prev => ({ ...prev, icon: '' }));
        setPreviewUrl('');
        setImageError(false);
        setIsDirty(true);
    };

    const handleImageError = (): void => {
        setImageError(true);
    };

    const handleImageLoad = (): void => {
        setImageError(false);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setFormState(prev => ({ ...prev, name: e.target.value }));
        setIsDirty(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 py-8 px-4">
            <div className="mx-auto">
                {isLoadingSettings ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                        <p className="text-slate-600 font-medium">Loading logo settings...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 px-8 py-6 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-blue-600 rounded-xl shadow-sm">
                                        <ImageIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-slate-900">Logo Management</h1>
                                        <p className="text-sm text-slate-600 mt-0.5">Update your organization's logo and branding</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleUpdateLogo}
                                    disabled={!formState.icon || !formState.name.trim() || updateLogoMutation.isPending}
                                    className="px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm hover:shadow-md disabled:shadow-none"
                                >


                                    {updateLogoMutation.isPending ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            Save Logo
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="p-8 space-y-6">
                            {/* Display Name Input */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Display Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formState.name}
                                    onChange={handleNameChange}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-slate-900 placeholder:text-slate-400"
                                    placeholder="Enter display name (e.g., Company Logo)"
                                    disabled={uploadingImage || updateLogoMutation.isPending}
                                />
                                <p className="mt-2 text-xs text-slate-500">This name will be used for internal identification purposes.</p>
                            </div>

                            {/* Image Upload Section */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Logo Image <span className="text-red-500">*</span>
                                </label>

                                {!previewUrl ? (
                                    <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50/50 hover:bg-slate-100/50 hover:border-slate-400 transition-all group">
                                        <div className="flex flex-col items-center justify-center py-8 px-6 text-center">
                                            {uploadingImage ? (
                                                <>
                                                    <Loader2 className="w-14 h-14 text-blue-600 animate-spin mb-4" />
                                                    <p className="text-base text-slate-700 font-semibold mb-1">Uploading image...</p>
                                                    <p className="text-sm text-slate-500">Please wait while we process your file</p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="p-4 bg-blue-50 rounded-full mb-4 group-hover:bg-blue-100 transition-colors">
                                                        <Upload className="w-10 h-10 text-blue-600" />
                                                    </div>
                                                    <p className="text-base text-slate-700 font-semibold mb-1">
                                                        Click to upload logo
                                                    </p>
                                                    <p className="text-sm text-slate-500 mb-4">
                                                        or drag and drop
                                                    </p>
                                                    <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg">
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                                                            <span>PNG, JPG, GIF</span>
                                                        </div>
                                                        <div className="w-px h-4 bg-slate-300"></div>
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                                                            <span>Max 5MB</span>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            disabled={uploadingImage}
                                        />
                                    </label>
                                ) : (
                                    <div className="relative w-full h-80 border border-slate-300 rounded-lg overflow-hidden bg-white shadow-sm">
                                        {imageError ? (
                                            <div className="flex flex-col items-center justify-center w-full h-full bg-slate-50">
                                                <div className="p-4 bg-red-50 rounded-full mb-3">
                                                    <AlertCircle className="w-12 h-12 text-red-500" />
                                                </div>
                                                <p className="text-base font-semibold text-slate-700 mb-1">Failed to load image</p>
                                                <p className="text-sm text-slate-500">The image URL is saved but cannot be displayed</p>
                                            </div>
                                        ) : (
                                            <img
                                                src={previewUrl}
                                                alt="Logo preview"
                                                className="w-full h-full object-contain p-4"
                                                onError={handleImageError}
                                                onLoad={handleImageLoad}
                                            />
                                        )}
                                        <button
                                            onClick={removeImage}
                                            className="absolute top-3 right-3 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
                                            disabled={uploadingImage}
                                            title="Remove image"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="bg-slate-50 px-8 py-5 border-t border-slate-200">
                            {isDirty && (
                                <div className="text-sm text-slate-600">
                                    <span className="flex items-center gap-1.5 text-amber-600">
                                        <AlertCircle className="w-4 h-4" />
                                        Unsaved changes
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LogoUpdate;