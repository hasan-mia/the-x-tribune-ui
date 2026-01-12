"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Edit, Search, Plus } from "lucide-react"
import { DataTable, DataTableColumn } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import useIndustries from "./_hooks/useIndustries"
import { IndustryFormModal } from "./_components/industry-form-modal"
import { formatDate } from "@/utils/helper"
import ConfirmDeleteModal from "@/components/shared/confirm-modal"

interface Industry {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export default function AdminIndustriesPage() {
  const {
    listData,
    listLoading,
    listError,
    onDeleteIndustry,
    search,
    setSearch,
    limit,
    setPage,
    setLimit,
  } = useIndustries("industries")

  const [showModal, setShowModal] = useState(false)
  const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedIndustryId, setSelectedIndustryId] = useState<string | null>(null)

  const handleAdd = () => {
    setEditingIndustry(null)
    setShowModal(true)
  }

  const handleEdit = (industry: Industry) => {
    setEditingIndustry(industry)
    setShowModal(true)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const columns: DataTableColumn<Industry>[] = [
    {
      key: "icon",
      header: "Icon",
      cell: (industry) => (
        <div className="flex items-center">
          {industry.icon ? (
            <img
              src={industry.icon}
              alt={industry.name}
              className="w-10 h-10 object-cover rounded"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
              No Icon
            </div>
          )}
        </div>
      ),
      sortable: false,
    },
    {
      key: "name",
      header: "Name",
      cell: (industry) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{industry.name}</span>
        </div>
      ),
      sortable: false,
    },
    {
      key: "slug",
      header: "Slug",
      cell: (industry) => (
        <span className="text-sm text-gray-600">{industry.slug}</span>
      ),
      sortable: false,
    },
    {
      key: "description",
      header: "Description",
      cell: (industry) => (
        <div className="max-w-md truncate">
          {industry.description}
        </div>
      ),
    },
    {
      key: "sort_order",
      header: "Order",
      cell: (industry) => (
        <span className="text-sm">{industry.sort_order}</span>
      ),
      sortable: false,
    },
    {
      key: "is_active",
      header: "Status",
      cell: (industry) => (
        <span className={`px-2 py-1 rounded-full text-xs ${industry.is_active
          ? 'bg-green-100 text-green-800'
          : 'bg-gray-100 text-gray-800'
          }`}>
          {industry.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
      sortable: false,
    },
    {
      key: "created_at",
      header: "Created",
      cell: (industry) => formatDate(industry.created_at),
      sortable: false,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (industry) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(industry)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedIndustryId(industry.id)
              setShowDeleteModal(true)
            }}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ]

  const industries = listData?.data || []
  const pagination = listData?.pagination

  return (
    <div className="container mx-auto py-2">
      <Card>
        <div className="p-4">
          <div className="flex justify-between mb-6">
            <h1 className="text-xl font-semibold">Industry Management</h1>

            <div className="flex gap-3">
              <div className="relative w-6/12">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search industries..."
                  className="pl-9 w-full font-normal"
                  value={search}
                  onChange={handleSearch}
                />
              </div>

              <Button className="gap-2 bg-green-600 text-white" onClick={handleAdd}>
                <Plus className="h-4 w-4" />
                Add Industry
              </Button>
            </div>
          </div>

          <CardContent className="p-0">
            <DataTable
              data={industries}
              columns={columns}
              isLoading={listLoading}
              keyExtractor={(industry) => industry.id}
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

      <IndustryFormModal
        isOpen={showModal}
        industry={editingIndustry}
        onClose={() => {
          setShowModal(false)
          setEditingIndustry(null)
        }}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        isLoading={false}
        title="Delete Industry?"
        description="Are you sure you want to delete this industry? This action cannot be undone."
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedIndustryId(null)
        }}
        onConfirm={() => {
          if (selectedIndustryId) {
            onDeleteIndustry(selectedIndustryId)
            setShowDeleteModal(false)
          }
        }}
      />
    </div>
  )
}