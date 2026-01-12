"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react"
import { useAuthContext } from "@/contexts/auth-context"
import useCustomToast from "@/hooks/use-custom-toast"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated, user, loading: authLoading, mounted } = useAuthContext()
  const router = useRouter()
  const toast = useCustomToast()

  // Redirect if already logged in
  useEffect(() => {
    if (mounted && !authLoading && isAuthenticated && user) {
      // Redirect based on role
      if (user?.role?.score >= 10) {
        console.log("Ok..........")
        router.push("/admin/dashboard")
      } else {
        router.push("/")
      }
    }
  }, [isAuthenticated, user, authLoading, mounted, router])

  // Show loading while checking auth
  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render login form if user is authenticated
  if (isAuthenticated) {
    return null
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await login(email, password)

      if (result.success) {

        toast.success(`Logged in as ${result.user.first_name}`,)
        if (result.user.role.score < 10) {
          toast.error("You do not have access to the admin dashboard.",)
          setLoading(false)
          return
        }
        router.push("/admin/dashboard")
      } else {
        toast.error(result.error || "Invalid credentials. Please try again.",)
      }
    } catch (error) {
      toast.error("Invalid credentials. Please try again.",)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
      <Card className="bg-white w-full md:max-w-xl border-slate-200 shadow-xl">
        <div className="p-8 space-y-4">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold text-slate-900">Access Admin Dashboard</h2>
            <p className="text-slate-600">Enter your credentials to access admin dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
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

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 h-12 bg-slate-50 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>


            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full h-12 bg-blue-500 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

        </div>
      </Card>
    </div>
  )
}