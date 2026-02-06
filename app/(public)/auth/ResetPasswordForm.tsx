/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react"
import useCustomToast from "@/hooks/use-custom-toast"
import { http } from "@/config/http"
import { useResetPassword } from "@/api/auth"

export default function ResetPasswordForm() {
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [token, setToken] = useState<string | null>(null)
    const [passwordReset, setPasswordReset] = useState(false)

    const router = useRouter()
    const searchParams = useSearchParams()
    const toast = useCustomToast()
    const resetPasswordMutation = useResetPassword()

    useEffect(() => {
        // Get token from URL query parameter
        const tokenFromUrl = searchParams.get("token")

        if (!tokenFromUrl) {
            toast.error("Invalid or missing reset token")
            router.push("/client/login")
            return
        }

        setToken(tokenFromUrl)
        // Set the token as Bearer authorization header for the reset password request
        http.defaults.headers.common['Authorization'] = `Bearer ${tokenFromUrl}`
    }, [searchParams, router, toast])

    const validatePassword = () => {
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long")
            return false
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match")
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validatePassword()) return
        if (!token) {
            toast.error("Invalid reset token")
            return
        }

        try {
            await resetPasswordMutation.mutateAsync({
                newPassword,
                confirmPassword
            })

            setPasswordReset(true)
            toast.success("Password reset successfully")

            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push("/client/login")
            }, 2000)
        } catch (error: any) {
            toast.error(error.message || "Failed to reset password. Please try again.")
        } finally {
            // Clean up the authorization header
            delete http.defaults.headers.common['Authorization']
        }
    }

    if (passwordReset) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center p-4">
                <Card className="bg-white w-full md:max-w-xl border-slate-200 shadow-xl">
                    <div className="p-8 space-y-6 text-center">
                        <div className="flex justify-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-slate-900">Password reset successful!</h2>
                            <p className="text-slate-600">
                                Your password has been updated successfully. Redirecting you to login...
                            </p>
                        </div>

                        <Link href="/client/login" className="block pt-4">
                            <Button
                                size="lg"
                                className="w-full h-12 bg-blue-500 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                            >
                                Go to login
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        )
    }

    if (!token) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-slate-600 font-medium">Validating reset link...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center p-4">
            <Card className="bg-white w-full md:max-w-xl border-slate-200 shadow-xl">
                <div className="p-8 space-y-4">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-slate-900">Set new password</h2>
                        <p className="text-slate-600">
                            Enter your new password below. Make sure it&apos;s at least 6 characters long.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                        <div className="space-y-2">
                            <label htmlFor="newPassword" className="text-sm font-semibold text-slate-700">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="pl-11 pr-11 h-12 bg-slate-50 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showNewPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="pl-11 pr-11 h-12 bg-slate-50 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {newPassword && confirmPassword && newPassword !== confirmPassword && (
                            <p className="text-sm text-red-600">Passwords do not match</p>
                        )}

                        <Button
                            type="submit"
                            disabled={resetPasswordMutation.isPending || !newPassword || !confirmPassword}
                            size="lg"
                            className="w-full h-12 bg-blue-500 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                        >
                            {resetPasswordMutation.isPending ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Resetting password...
                                </>
                            ) : (
                                <>
                                    Reset password
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="pt-4 text-center text-sm text-slate-600">
                        Remember your password?{" "}
                        <Link href="/client/login" className="font-medium text-blue-600 hover:text-blue-700">
                            Sign in
                        </Link>
                    </div>
                </div>
            </Card>
        </div>
    )
}

