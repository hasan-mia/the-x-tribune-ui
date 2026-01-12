"use client"

import { useState, useRef, useEffect } from 'react'
import { Mail, Phone, Building2, Calendar, Edit3, MoreHorizontal, Download, Shield, X, Save, Loader2, Camera, Upload, Lock, Eye, EyeOff } from 'lucide-react'
import { useUpdateProfile } from '@/api/auth'
import { useUploadFiles } from '@/api/file'
import { useResetPassword } from '@/api/auth'
import { useAuth } from '@/hooks/use-auth'
import useCustomToast from '@/hooks/use-custom-toast'

export default function ClientProfile() {
    const toast = useCustomToast()
    const { user, updateUser, mounted } = useAuth()
    const updateProfile = useUpdateProfile()
    const uploadFiles = useUploadFiles()
    const resetPassword = useResetPassword()

    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        avatar: user?.avatar || null
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null)
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Password change state
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    })
    const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [passwordSuccess, setPasswordSuccess] = useState('')

    // Initialize form data from user
    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone: user.phone || '',
                avatar: user.avatar || null
            })
            setAvatarPreview(user.avatar || null)
        }
    }, [user])

    // Show loading while hydrating
    if (!mounted || !user) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">Loading profile...</p>
                </div>
            </div>
        )
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name as keyof typeof formData]: value }))
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name as keyof typeof errors]: '' }))
        }
    }

    const handleAvatarClick = () => {
        if (isEditing && !uploadFiles.isPending) {
            fileInputRef.current?.click()
        }
    }

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setErrors(prev => ({ ...prev, avatar: 'Please select an image file' }))
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, avatar: 'Image size must be less than 5MB' }))
            return
        }

        setIsUploadingAvatar(true)
        setErrors(prev => ({ ...prev, avatar: '' }))

        // Create preview
        const previewUrl = URL.createObjectURL(file)
        setAvatarPreview(previewUrl)

        // Upload file
        const uploadFormData = new FormData()
        uploadFormData.append('file', file)

        uploadFiles.mutate(uploadFormData, {
            onSuccess: (data) => {
                setFormData(prev => ({ ...prev, avatar: data.data }))
                setIsUploadingAvatar(false)
            },
            onError: (error) => {
                console.error('Failed to upload avatar:', error)
                setErrors(prev => ({
                    ...prev,
                    avatar: error.message || 'Failed to upload avatar'
                }))
                setAvatarPreview(formData.avatar)
                setIsUploadingAvatar(false)
            }
        })
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.first_name.trim()) {
            newErrors.first_name = 'First name is required'
        }

        if (!formData.last_name.trim()) {
            newErrors.last_name = 'Last name is required'
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format'
        }

        if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
            newErrors.phone = 'Invalid phone format'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSave = () => {
        if (!validateForm()) return

        const updateData = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone || null,
            avatar: formData.avatar
        }

        updateProfile.mutate(updateData, {
            onSuccess: (data) => {
                setIsEditing(false)
                // Update the user in the auth context
                updateUser(updateData)
            },
            onError: (error) => {
                toast.error(error.message || 'Failed to update profile')
                setErrors({ submit: error.message || 'Failed to update profile' })
            }
        })
    }

    const handleCancel = () => {
        setFormData({
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            avatar: user?.avatar || null
        })
        setAvatarPreview(user?.avatar || null)
        setErrors({})
        setIsEditing(false)
    }

    const getInitials = () => {
        const first = formData.first_name?.[0] || ''
        const last = formData.last_name?.[0] || ''
        return (first + last).toUpperCase()
    }



    const formatDateTime = (dateString: string | number | Date) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    // Password change handlers
    const handlePasswordChange = (e: { target: { name: any; value: any } }) => {
        const { name, value } = e.target
        setPasswordData(prev => ({ ...prev, [name]: value }))
        if (passwordErrors[name]) {
            setPasswordErrors(prev => ({ ...prev, [name]: '' }))
        }
        setPasswordSuccess('')
    }

    const validatePassword = () => {
        const newErrors: Record<string, string> = {}

        if (!passwordData.newPassword) {
            newErrors.newPassword = 'New password is required'
        } else if (passwordData.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters'
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
            newErrors.newPassword = 'Password must contain uppercase, lowercase, and number'
        }

        if (!passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password'
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }

        setPasswordErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handlePasswordSubmit = () => {
        if (!validatePassword()) return

        resetPassword.mutate(passwordData, {
            onSuccess: (response) => {
                console.log('Password updated successfully:', response)
                setPasswordSuccess(response.message || 'Password updated successfully')
                setPasswordData({ newPassword: '', confirmPassword: '' })
                setPasswordErrors({})
                // Auto-hide success message after 5 seconds
                setTimeout(() => setPasswordSuccess(''), 5000)
            },
            onError: (error) => {
                toast.error(error.message || 'Failed to update password:')
                setPasswordErrors({ submit: error.message || 'Failed to update password' })
            }
        })
    }

    const handleCancelPasswordChange = () => {
        setPasswordData({ newPassword: '', confirmPassword: '' })
        setPasswordErrors({})
        setPasswordSuccess('')
        setIsChangingPassword(false)
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Manage Profile</h1>
                        <p className="text-sm text-slate-500 mt-1">View and update your profile information</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {!isEditing && (
                            <>
                                <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                                    <Download className="h-4 w-4" />
                                    Export
                                </button>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    <Edit3 className="h-4 w-4" />
                                    Edit Profile
                                </button>
                            </>
                        )}
                        {isEditing && (
                            <>
                                <button
                                    onClick={handleCancel}
                                    disabled={updateProfile.isPending || isUploadingAvatar}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    <X className="h-4 w-4" />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={updateProfile.isPending || isUploadingAvatar}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {updateProfile.isPending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="h-4 w-4" />
                                    )}
                                    Save Changes
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Error Message */}
                {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-800">{errors.submit}</p>
                    </div>
                )}

                {/* Profile Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="h-24 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600"></div>
                    <div className="px-6 pb-6">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
                            {/* Avatar */}
                            <div className="relative group">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                                <div
                                    onClick={handleAvatarClick}
                                    className={`w-24 h-24 rounded-xl bg-white border-4 border-white shadow-md flex items-center justify-center text-2xl font-bold overflow-hidden ${isEditing ? 'cursor-pointer' : ''
                                        }`}
                                >
                                    {avatarPreview ? (
                                        <img
                                            src={avatarPreview}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-blue-600 bg-blue-50">
                                            {getInitials()}
                                        </div>
                                    )}
                                    {isUploadingAvatar && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
                                            <Loader2 className="h-6 w-6 text-white animate-spin" />
                                        </div>
                                    )}
                                </div>
                                {isEditing && !isUploadingAvatar && (
                                    <div
                                        onClick={handleAvatarClick}
                                        className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-xl transition-all flex items-center justify-center cursor-pointer"
                                    >
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                )}
                                {isEditing && (
                                    <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1.5 shadow-lg">
                                        <Upload className="h-3 w-3 text-white" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 sm:pb-1">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                    {!isEditing ? (
                                        <>
                                            <h2 className="text-xl font-semibold text-slate-900">
                                                {formData.first_name} {formData.last_name}
                                            </h2>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2.5 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full">
                                                    Active
                                                </span>
                                                <span className="px-2.5 py-0.5 text-xs font-medium bg-amber-50 text-amber-700 rounded-full flex items-center gap-1">
                                                    <Shield className="h-3 w-3" />
                                                    {user?.role?.name || 'User'}
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex-1 space-y-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <input
                                                        type="text"
                                                        name="first_name"
                                                        value={formData.first_name}
                                                        onChange={handleInputChange}
                                                        placeholder="First Name"
                                                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.first_name ? 'border-red-300' : 'border-slate-200'
                                                            }`}
                                                    />
                                                    {errors.first_name && (
                                                        <p className="text-xs text-red-600 mt-1">{errors.first_name}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        name="last_name"
                                                        value={formData.last_name}
                                                        onChange={handleInputChange}
                                                        placeholder="Last Name"
                                                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.last_name ? 'border-red-300' : 'border-slate-200'
                                                            }`}
                                                    />
                                                    {errors.last_name && (
                                                        <p className="text-xs text-red-600 mt-1">{errors.last_name}</p>
                                                    )}
                                                </div>
                                            </div>
                                            {errors.avatar && (
                                                <p className="text-xs text-red-600">{errors.avatar}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {!isEditing && (
                                    <p className="text-slate-500 text-sm mt-1">
                                        {user?.role?.description || 'Regular user with basic access'}
                                    </p>
                                )}
                            </div>
                            {!isEditing && (
                                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 self-start sm:self-auto">
                                    <MoreHorizontal className="h-5 w-5" />
                                </button>
                            )}
                        </div>

                        {/* Contact Info */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
                            {/* Email */}
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                    <Mail className="h-4 w-4 text-slate-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-400">Email</p>
                                    {!isEditing ? (
                                        <p className="text-sm text-slate-700 truncate">{formData.email}</p>
                                    ) : (
                                        <div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.email ? 'border-red-300' : 'border-slate-200'
                                                    }`}
                                            />
                                            {errors.email && (
                                                <p className="text-xs text-red-600 mt-0.5">{errors.email}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                    <Phone className="h-4 w-4 text-slate-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-400">Phone</p>
                                    {!isEditing ? (
                                        <p className="text-sm text-slate-700">{formData.phone || 'Not provided'}</p>
                                    ) : (
                                        <div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="+1 (555) 234-5678"
                                                className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.phone ? 'border-red-300' : 'border-slate-200'
                                                    }`}
                                            />
                                            {errors.phone && (
                                                <p className="text-xs text-red-600 mt-0.5">{errors.phone}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Role */}
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                    <Building2 className="h-4 w-4 text-slate-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-400">Role</p>
                                    <p className="text-sm text-slate-700">{user?.role?.name || 'User'}</p>
                                </div>
                            </div>

                            {/* Member Since */}
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                    <Calendar className="h-4 w-4 text-slate-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-400">Member Since</p>
                                    <p className="text-sm text-slate-700">{formatDateTime(user?.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info Section */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Account Details</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-slate-100">
                            <span className="text-sm text-slate-500">Role</span>
                            <span className="text-sm text-slate-900 font-medium">{user?.role?.name || 'User'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                            <span className="text-sm text-slate-500">Role Score</span>
                            <span className="text-sm text-slate-900">{user?.role?.score || 0}</span>
                        </div>
                        {user?.address && (
                            <div className="flex justify-between py-2 border-b border-slate-100">
                                <span className="text-sm text-slate-500">Address</span>
                                <span className="text-sm text-slate-900">{user.address}</span>
                            </div>
                        )}
                        <div className="flex justify-between py-2">
                            <span className="text-sm text-slate-500">Account Status</span>
                            <span className="text-sm text-emerald-600 font-medium">Active</span>
                        </div>
                    </div>
                </div>

                {/* Security Section - Password Change */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                <Lock className="h-5 w-5" />
                                Security
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">Manage your password and security settings</p>
                        </div>
                        {!isChangingPassword && (
                            <button
                                onClick={() => setIsChangingPassword(true)}
                                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                Change Password
                            </button>
                        )}
                    </div>

                    {isChangingPassword && (
                        <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
                            {/* Success Message */}
                            {passwordSuccess && (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-sm text-emerald-800">{passwordSuccess}</p>
                                </div>
                            )}

                            {/* Error Message */}
                            {passwordErrors.submit && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-sm text-red-800">{passwordErrors.submit}</p>
                                </div>
                            )}

                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Enter new password"
                                        className={`w-full px-4 py-2.5 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${passwordErrors.newPassword ? 'border-red-300' : 'border-slate-200'
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {passwordErrors.newPassword && (
                                    <p className="text-xs text-red-600 mt-1">{passwordErrors.newPassword}</p>
                                )}
                                <p className="text-xs text-slate-500 mt-1">
                                    Must be at least 8 characters with uppercase, lowercase, and number
                                </p>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Confirm new password"
                                        className={`w-full px-4 py-2.5 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${passwordErrors.confirmPassword ? 'border-red-300' : 'border-slate-200'
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {passwordErrors.confirmPassword && (
                                    <p className="text-xs text-red-600 mt-1">{passwordErrors.confirmPassword}</p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    onClick={handlePasswordSubmit}
                                    disabled={resetPassword.isPending}
                                    className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {resetPassword.isPending ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="h-4 w-4" />
                                            Update Password
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleCancelPasswordChange}
                                    disabled={resetPassword.isPending}
                                    className="px-6 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {!isChangingPassword && (
                        <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                            <div className="flex items-start gap-3">
                                <Shield className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm text-slate-700 font-medium">Password Protection</p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Your password should be strong and unique. We recommend changing it regularly for better security.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}