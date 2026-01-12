"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Mail, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import useCustomToast from "@/hooks/use-custom-toast"
import { useForgotPassword } from "@/api/auth"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [emailSent, setEmailSent] = useState(false)
    const toast = useCustomToast()
    const forgotPasswordMutation = useForgotPassword()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            await forgotPasswordMutation.mutateAsync({
                identifier: email,
                type: "email"
            })

            setEmailSent(true)
            toast.success("Password reset link sent to your email")
        } catch (error: any) {
            toast.error(error.message || "Failed to send reset link. Please try again.")
        }
    }

    if (emailSent) {
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
                            <h2 className="text-2xl font-bold text-slate-900">Check your email</h2>
                            <p className="text-slate-600">
                                We've sent a password reset link to <span className="font-semibold">{email}</span>
                            </p>
                            <p className="text-sm text-slate-500 pt-2">
                                The link will expire in 7 days. If you don't see the email, check your spam folder.
                            </p>
                        </div>

                        <div className="pt-4 space-y-3">
                            <Link href="/client/login" className="block">
                                <Button
                                    size="lg"
                                    className="w-full h-12 bg-blue-500 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                                >
                                    <ArrowLeft className="w-5 h-5 mr-2" />
                                    Back to login
                                </Button>
                            </Link>

                            <button
                                onClick={() => {
                                    setEmailSent(false)
                                    setEmail("")
                                }}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Try a different email
                            </button>
                        </div>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center p-4">
            <Card className="bg-white w-full md:max-w-xl border-slate-200 shadow-xl">
                <div className="p-8 space-y-4">
                    <Link href="/client/login" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 font-medium mb-2">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to login
                    </Link>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-slate-900">Forgot your password?</h2>
                        <p className="text-slate-600">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-11 h-12 bg-slate-50 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={forgotPasswordMutation.isPending}
                            size="lg"
                            className="w-full h-12 bg-blue-500 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                        >
                            {forgotPasswordMutation.isPending ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Sending link...
                                </>
                            ) : (
                                <>
                                    Send reset link
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