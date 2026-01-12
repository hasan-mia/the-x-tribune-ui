"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Search, UserCircle } from "lucide-react"
import { DataTable, DataTableColumn } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { formatDate } from "@/utils/helper"
import ConfirmDeleteModal from "@/components/shared/confirm-modal"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useClients from "./_hooks/useClients"

interface User {
  id: string
  avatar: string | null
  email: string
  first_name: string
  last_name: string
  phone: string | null
  status: "pending" | "active" | "suspended"
  email_verified: boolean
  last_login: string | null
  created_at: string
  updated_at: string
  role: {
    id: string
    name: string
    score: number
    description: string
  }
}

export default function AdminUsersPage() {
  const {
    listData,
    listLoading,
    listError,
    handleStatusChange,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    limit,
    setPage,
    setLimit,
  } = useClients("users")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const columns: DataTableColumn<User>[] = [
    {
      key: "avatar",
      header: "Avatar",
      cell: (user) => (
        <div className="flex items-center justify-center">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={`${user.first_name} ${user.last_name}`}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <UserCircle className="h-10 w-10 text-gray-400" />
          )}
        </div>
      ),
    },
    {
      key: "name",
      header: "Name",
      cell: (user) => (
        <div className="max-w-xs">
          <div className="font-medium">
            {user.first_name} {user.last_name}
          </div>
          <div className="text-xs text-muted-foreground truncate">{user.email}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "phone",
      header: "Phone",
      cell: (user) => user.phone || "N/A",
    },
    {
      key: "role",
      header: "Role",
      cell: (user) => (
        <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
          {user.role?.name || "N/A"}
        </span>
      ),
    },
    {
      key: "email_verified",
      header: "Verified",
      cell: (user) => (
        <span
          className={`px-2 py-1 rounded text-xs ${user.email_verified
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
            }`}
        >
          {user.email_verified ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (user) => (
        <select
          value={user.status}
          onChange={(e) => handleStatusChange(user.id, e.target.value as any)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      ),
    },
    {
      key: "last_login",
      header: "Last Login",
      cell: (user) => (user.last_login ? formatDate(user.last_login) : "Never"),
      sortable: true,
    },
    {
      key: "created_at",
      header: "Joined",
      cell: (user) => formatDate(user.created_at),
      sortable: true,
    },
  ]

  const users = listData?.data?.users || []
  const pagination = listData?.data?.pagination

  return (
    <div className="container mx-auto py-2">
      <Card>
        <div className="p-4">
          <div className="flex justify-between mb-6">
            <h1 className="text-xl font-semibold">User Management</h1>

            <div className="flex gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-9 w-full font-normal"
                  value={search}
                  onChange={handleSearch}
                />
              </div>
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <CardContent className="p-0">
            <DataTable
              data={users}
              columns={columns}
              isLoading={listLoading}
              keyExtractor={(user) => user.id}
              error={listError ? "Failed to load... Please try again." : undefined}
              searchQuery={search}
              pagination={{
                pageSize: limit,
                total: pagination?.total,
                pageSizeOptions: [10, 20, 50, 100],
                showSizeChanger: true,
                serverSide: true,
                position: "bottom",
                onPageChange: setPage,
                onPageSizeChange: setLimit,
              }}
              selectable={false}
              searchable={false}
              showColumnFilters={false}
              className="shadow-sm"
              expandable={false}
            />
          </CardContent>
        </div>
      </Card>
    </div>
  )
}
