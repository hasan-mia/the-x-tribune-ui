"use client"

import React from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Edit, Search, Plus } from "lucide-react"
import { DataTable, DataTableColumn } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import useCategories from "./_hooks/useCategories"
import { CategoryFormModal } from "./_components/category-form-modal"
import { formatDate } from "@/utils/helper"
import ConfirmDeleteModal from "@/components/shared/confirm-modal"

interface Category {
  id: string
  name: string
  description: string
  color: string
  is_active: boolean
  slug: string
  icon: string
  created_at: string
  updated_at: string
}

export default function AdminCategoriesPage() {
  const {
    listData,
    listLoading,
    listError,
    onDeleteCategory,
    search,
    setSearch,
    limit,
    setPage,
    setLimit,
  } = useCategories("categories")

  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

  const handleAdd = () => {
    setEditingCategory(null)
    setShowModal(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setShowModal(true)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const columns: DataTableColumn<Category>[] = [
    {
      key: "name",
      header: "Name",
      cell: (c) => c.name,
      sortable: false,
    },
    {
      key: "description",
      header: "Description",
      cell: (c) => (
        <div className="max-w-md truncate">
          {c.description}
        </div>
      ),
    },
    {
      key: "is_active",
      header: "Status",
      cell: (c) => (
        <span className={`px-2 py-1 rounded-full text-xs ${c.is_active
          ? 'bg-green-100 text-green-800'
          : 'bg-gray-100 text-gray-800'
          }`}>
          {c.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
      sortable: false,
    },
    {
      key: "created_at",
      header: "Created",
      cell: (c) => formatDate(c.created_at),
      sortable: false,
    },
    {
      key: "updated_at",
      header: "Updated",
      cell: (c) => formatDate(c.updated_at),
      sortable: false,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (c) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(c)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedCategoryId(c.id)
              setShowDeleteModal(true)
            }}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ]

  const categories = listData?.data || []
  const pagination = listData?.pagination

  return (
    <div className="container mx-auto py-2">
      <Card>
        <div className="p-4">
          <div className="flex justify-between mb-6">
            <h1 className="text-xl font-semibold">Category Management</h1>

            <div className="flex gap-3">
              <div className="relative w-6/12">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search categories..."
                  className="pl-9 w-full font-normal"
                  value={search}
                  onChange={handleSearch}
                />
              </div>

              <Button className="gap-2 bg-green-600 text-white" onClick={handleAdd}>
                <Plus className="h-4 w-4" />
                Add Category
              </Button>
            </div>
          </div>

          <CardContent className="p-0">
            <DataTable
              data={categories}
              columns={columns}
              isLoading={listLoading}
              keyExtractor={(c) => c.id}
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

      <CategoryFormModal
        isOpen={showModal}
        category={editingCategory}
        onClose={() => {
          setShowModal(false)
          setEditingCategory(null)
        }}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        isLoading={false}
        title="Delete Category?"
        description="Are you sure you want to delete this category? This action cannot be undone."
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedCategoryId(null)
        }}
        onConfirm={() => {
          if (selectedCategoryId) {
            onDeleteCategory(selectedCategoryId)
            setShowDeleteModal(false)
          }
        }}
      />
    </div>
  )
}