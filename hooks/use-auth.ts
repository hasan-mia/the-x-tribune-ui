"use client"

import { useCallback, useEffect, useState } from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { useLogin, useRegister, useUserInfo } from "@/api/auth"
import { useQueryClient } from "@tanstack/react-query"

export function useAuth() {
  const { token, user, setToken, setUser, logout: clearAuth } = useAuthStore()
  const queryClient = useQueryClient()
  const [mounted, setMounted] = useState(false)

  // Wait for zustand to hydrate from localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  // Fetch user info when token exists AND we're mounted
  const { data: userInfo, isLoading, refetch } = useUserInfo(mounted && !!token)

  // Update user in store when fetched
  useEffect(() => {
    if (userInfo) {
      setUser({
        id: userInfo.id,
        email: userInfo.email,
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        role: userInfo.role,
        avatar: userInfo.avatar,
        phone: userInfo.phone,
        address: userInfo.address,
        createdAt: new Date(userInfo.created_at),
      })
    }
  }, [userInfo, setUser])

  const loginMutation = useLogin()
  const registerMutation = useRegister()

  const login = useCallback(async (email: string, password: string) => {
    try {
      const result = await loginMutation.mutateAsync({ email, password })

      if (result?.token) {
        setToken(result.token)
        const { data } = await refetch()
        return { success: true, user: data }
      }

      return { success: false, error: "No token received" }
    } catch (error: any) {
      console.error("Login error:", error)
      return {
        success: false,
        error: error?.message || "Login failed"
      }
    }
  }, [loginMutation, setToken, refetch])

  const register = useCallback(async (data: {
    email: string
    password: string
    first_name: string
    last_name: string
  }) => {
    try {
      const result = await registerMutation.mutateAsync(data)

      if (result?.token) {
        setToken(result.token)
        const { data: userData } = await refetch()
        return { success: true, user: userData }
      }

      return { success: false, error: "No token received" }
    } catch (error: any) {
      console.error("Registration error:", error)
      return {
        success: false,
        error: error?.message || "Registration failed"
      }
    }
  }, [registerMutation, setToken, refetch])

  const logout = useCallback(() => {
    clearAuth()
    queryClient.clear()
  }, [clearAuth, queryClient])

  const updateUser = useCallback((updates: Partial<typeof user>) => {
    if (user) {
      setUser({ ...user, ...updates })
    }
  }, [user, setUser])

  // Score-based role checks
  const roleScore = user?.role?.score ?? 0

  // Define role levels based on score
  const isSuperAdmin = roleScore >= 999  // Super Admin
  const isAdmin = roleScore >= 10        // Admin or higher
  const isUser = roleScore >= 0          // Regular user
  const isAuthenticated = !!token && !!user

  // Score-based permissions with thresholds
  const hasPermission = useCallback((requiredScore: number) => {
    if (!user?.role?.score) return false
    return user.role.score >= requiredScore
  }, [user])

  // Role-based permission checks
  const hasRolePermission = useCallback((requiredRole: "User" | "Admin" | "Super Admin") => {
    if (!user) return false

    const roleScoreMap = {
      "User": 1,
      "Admin": 10,
      "Super Admin": 999
    }

    return (user.role?.score ?? 0) >= roleScoreMap[requiredRole]
  }, [user])

  // Permission flags
  const canAccessAdminPanel = roleScore >= 10
  const canManageProducts = roleScore >= 10
  const canManageOrders = roleScore >= 10
  const canManageUsers = roleScore >= 999  // Only Super Admin
  const canViewAnalytics = roleScore >= 10
  const canManageRoles = roleScore >= 999  // Only Super Admin

  return {
    user,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated,
    isSuperAdmin,
    isAdmin,
    isUser,
    roleScore,
    hasPermission,          // Check by score number
    hasRolePermission,      // Check by role name
    canAccessAdminPanel,
    canManageProducts,
    canManageOrders,
    canManageUsers,
    canViewAnalytics,
    canManageRoles,
    mounted,
    loading: !mounted || isLoading || loginMutation.isPending || registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  }
}