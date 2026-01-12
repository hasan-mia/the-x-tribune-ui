"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Mail } from "lucide-react"
import { DataTable, DataTableColumn } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { formatDate } from "@/utils/helper"
import { Badge } from "@/components/ui/badge"
import useNewsletterSubscribers from "./_hooks/useNewsletterSubscribers"

interface NewsletterSubscriber {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  status: string
  source: string | null
  confirmation_token: string
  confirmed_at: string | null
  unsubscribed_at: string | null
  ip_address: string
  user_agent: string
  created_at: string
  updated_at: string
}

export default function AdminNewsletterSubscribersPage() {
  const {
    listData,
    listLoading,
    listError,
    search,
    setSearch,
    limit,
    setPage,
    setLimit,
  } = useNewsletterSubscribers("newsletter-subscribers")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { label: "Confirmed", className: "bg-green-100 text-green-800" },
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
      unsubscribed: { label: "Unsubscribed", className: "bg-red-100 text-red-800" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      className: "bg-gray-100 text-gray-800"
    }

    return (
      <Badge variant="secondary" className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const columns: DataTableColumn<NewsletterSubscriber>[] = [
    {
      key: "email",
      header: "Email",
      cell: (subscriber) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{subscriber.email}</span>
        </div>
      ),
      sortable: false,
    },
    {
      key: "name",
      header: "Name",
      cell: (subscriber) => {
        const name = [subscriber.first_name, subscriber.last_name]
          .filter(Boolean)
          .join(" ")
        return name || <span className="text-muted-foreground">—</span>
      },
      sortable: false,
    },
    {
      key: "status",
      header: "Status",
      cell: (subscriber) => getStatusBadge(subscriber.status),
      sortable: false,
    },
    {
      key: "source",
      header: "Source",
      cell: (subscriber) => subscriber.source || <span className="text-muted-foreground">—</span>,
      sortable: false,
    },
    {
      key: "ip_address",
      header: "IP Address",
      cell: (subscriber) => (
        <span className="text-sm text-muted-foreground">{subscriber.ip_address}</span>
      ),
      sortable: false,
    },
    {
      key: "created_at",
      header: "Subscribed On",
      cell: (subscriber) => formatDate(subscriber.created_at),
      sortable: false,
    },
  ]

  const subscribers = listData?.data?.subscribers || []
  const pagination = listData?.data?.pagination

  return (
    <div className="container mx-auto py-2">
      <Card>
        <div className="p-4">
          <div className="flex justify-between mb-6">
            <h1 className="text-xl font-semibold">Newsletter Subscribers</h1>

            <div className="flex gap-3">
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email, first name, or last name..."
                  className="pl-9 w-full font-normal"
                  value={search}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>

          <CardContent className="p-0">
            <DataTable
              data={subscribers}
              columns={columns}
              isLoading={listLoading}
              keyExtractor={(subscriber) => subscriber.id}
              error={listError ? "Failed to load subscribers. Please try again." : undefined}
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