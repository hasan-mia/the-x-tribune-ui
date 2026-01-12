"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    CheckCircle2,
    ShieldCheck,
    Sparkles,
    Gift,
    TrendingUp,
} from "lucide-react"
import { useAuthContext } from "@/contexts/auth-context"
import useCustomToast from "@/hooks/use-custom-toast"

export default function SignupPage() {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [agreedToTerms, setAgreedToTerms] = useState(false)
    const router = useRouter()
    const { register } = useAuthContext()
    const toast = useCustomToast()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    const validatePassword = () => {
        if (formData.password.length < 6) {
            toast.info("Password must be at least 6 characters long")
            return false
        }
        if (formData.password !== formData.confirmPassword) {
            toast.info("Please make sure your passwords match")
            return false
        }
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!agreedToTerms) {
            toast.info("Please accept the terms and conditions")
            return
        }

        if (!validatePassword()) return

        setLoading(true)

        try {
            await register(formData)
            toast.success("Your account has been created successfully")

            setTimeout(() => {
                router.push("/organizer")
            }, 500)
        } catch (error: any) {
            toast.error(error.message || "Please try again")
        } finally {
            setLoading(false)
        }
    }

    const passwordStrength = () => {
        const password = formData.password
        if (!password) return { strength: 0, label: "", color: "" }

        let strength = 0
        if (password.length >= 6) strength += 25
        if (password.length >= 10) strength += 25
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25
        if (/\d/.test(password) && /\W/.test(password)) strength += 25

        if (strength <= 25) return { strength, label: "Weak", color: "bg-red-500" }
        if (strength <= 50) return { strength, label: "Fair", color: "bg-orange-500" }
        if (strength <= 75) return { strength, label: "Good", color: "bg-yellow-500" }
        return { strength, label: "Strong", color: "bg-green-500" }
    }

    const strength = passwordStrength()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 flex items-center justify-center px-4">
            <Card className="w-full md:max-w-xl bg-white border-slate-200 shadow-xl">
                <div className="p-8 space-y-4">
                    <div className="space-y-2 text-center">
                        <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
                        <p className="text-slate-600">Start your journey today</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* First Name */}
                        <div className="space-y-2">
                            <label htmlFor="first_name" className="text-sm font-semibold text-slate-700">
                                First Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    placeholder="John"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="pl-11 h-12 bg-slate-50 border-slate-300 focus:border-purple-500 focus:ring-purple-500"
                                    required
                                />
                            </div>
                        </div>

                        {/* Last Name */}
                        <div className="space-y-2">
                            <label htmlFor="last_name" className="text-sm font-semibold text-slate-700">
                                Last Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    placeholder="Doe"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="pl-11 h-12 bg-slate-50 border-slate-300 focus:border-purple-500 focus:ring-purple-500"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="pl-11 h-12 bg-slate-50 border-slate-300 focus:border-purple-500 focus:ring-purple-500"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a strong password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="pl-11 pr-11 h-12 bg-slate-50 border-slate-300 focus:border-purple-500 focus:ring-purple-500"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Password Strength */}
                            {formData.password && (
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-600">Password strength:</span>
                                        <span className={`font-semibold ${strength.label === "Weak" ? "text-red-600" :
                                            strength.label === "Fair" ? "text-orange-600" :
                                                strength.label === "Good" ? "text-yellow-600" :
                                                    "text-green-600"
                                            }`}>
                                            {strength.label}
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-300 ${strength.color}`}
                                            style={{ width: `${strength.strength}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="pl-11 pr-11 h-12 bg-slate-50 border-slate-300 focus:border-purple-500 focus:ring-purple-500"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                <div className="flex items-center gap-2 text-sm text-green-600">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Passwords match</span>
                                </div>
                            )}
                        </div>

                        {/* Terms Checkbox */}
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="w-5 h-5 mt-0.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-sm text-slate-600">
                                I agree to the{" "}
                                <Link href="/terms-of-service" className="text-purple-600 hover:text-purple-700 font-medium">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link href="/privacy-policy" className="text-purple-600 hover:text-purple-700 font-medium">
                                    Privacy Policy
                                </Link>
                            </span>
                        </label>

                        <Button
                            type="submit"
                            disabled={loading}
                            size="lg"
                            className="w-full h-12 bg-blue-500 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-slate-500 font-medium">
                                Already have an account?
                            </span>
                        </div>
                    </div>

                    <Link href="/client/login">
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full h-12 border-2 border-slate-300 hover:bg-slate-50 text-base font-semibold"
                        >
                            Sign in instead
                        </Button>
                    </Link>
                </div>
            </Card>
        </div>
    )
}