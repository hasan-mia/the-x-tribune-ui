"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Search, UserCircle, Shield } from "lucide-react"
import { DataTable, DataTableColumn } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import useAdmins from "./_hooks/useAdmins"
import { formatDate } from "@/utils/helper"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Admin {
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

export default function AdminAdminsPage() {
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
  } = useAdmins("admins")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const columns: DataTableColumn<Admin>[] = [
    {
      key: "avatar",
      header: "Avatar",
      cell: (admin) => (
        <div className="flex items-center justify-center">
          {admin.avatar ? (
            <img
              src={admin.avatar}
              alt={`${admin.first_name} ${admin.last_name}`}
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
      cell: (admin) => (
        <div className="max-w-xs">
          <div className="font-medium flex items-center gap-2">
            <Shield className="h-4 w-4 text-purple-600" />
            {admin.first_name} {admin.last_name}
          </div>
          <div className="text-xs text-muted-foreground truncate">{admin.email}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "phone",
      header: "Phone",
      cell: (admin) => admin.phone || "N/A",
    },
    {
      key: "role",
      header: "Role",
      cell: (admin) => (
        <div className="flex flex-col gap-1">
          <span className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-700">
            {admin.role?.name || "N/A"}
          </span>
          <span className="text-xs text-muted-foreground">
            Score: {admin.role?.score}
          </span>
        </div>
      ),
    },
    {
      key: "email_verified",
      header: "Verified",
      cell: (admin) => (
        <span
          className={`px-2 py-1 rounded text-xs ${admin.email_verified
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
            }`}
        >
          {admin.email_verified ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (admin) => (
        <select
          value={admin.status}
          onChange={(e) => handleStatusChange(admin.id, e.target.value as any)}
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
      cell: (admin) => (admin.last_login ? formatDate(admin.last_login) : "Never"),
      sortable: true,
    },
    {
      key: "created_at",
      header: "Joined",
      cell: (admin) => formatDate(admin.created_at),
      sortable: true,
    },
  ]

  const admins = listData?.data?.admins || []
  const pagination = listData?.data?.pagination

  return (
    <div className="container mx-auto py-2">
      <Card>
        <div className="p-4">
          <div className="flex justify-between mb-6">
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              Admin Management
            </h1>

            <div className="flex gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search admins..."
                  className="pl-9 w-full font-normal"
                  value={search}
                  onChange={handleSearch}
                />
              </div>

              <div className="blok bg-white z-99">
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
              data={admins}
              columns={columns}
              isLoading={listLoading}
              keyExtractor={(admin) => admin.id}
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