"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Edit, Search, Plus } from "lucide-react"
import { DataTable, DataTableColumn } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import useWhyChoseUs from "./_hooks/useWhyChoseUs"
import { formatDate } from "@/utils/helper"
import ConfirmDeleteModal from "@/components/shared/confirm-modal"
import { WhyChoseUsFormModal } from "./_components/why-chose-us-form-modal"

interface WhyChoseUs {
  id: string
  title: string
  slug: string
  description: string
  icon: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export default function AdminWhyChoseUsPage() {
  const {
    listData,
    listLoading,
    listError,
    onDeleteWhyChoseUs,
    search,
    setSearch,
    limit,
    setPage,
    setLimit,
  } = useWhyChoseUs("why-chose-us")

  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<WhyChoseUs | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)

  const handleAdd = () => {
    setEditingItem(null)
    setShowModal(true)
  }

  const handleEdit = (item: WhyChoseUs) => {
    setEditingItem(item)
    setShowModal(true)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const columns: DataTableColumn<WhyChoseUs>[] = [
    {
      key: "icon",
      header: "Icon",
      cell: (item) => (
        <div className="flex items-center">
          {item.icon ? (
            <img
              src={item.icon}
              alt={item.title}
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
      key: "title",
      header: "Title",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{item.title}</span>
        </div>
      ),
      sortable: false,
    },
    {
      key: "slug",
      header: "Slug",
      cell: (item) => (
        <span className="text-sm text-gray-600">{item.slug}</span>
      ),
      sortable: false,
    },
    {
      key: "description",
      header: "Description",
      cell: (item) => (
        <div className="max-w-md truncate">
          {item.description}
        </div>
      ),
    },
    {
      key: "sort_order",
      header: "Order",
      cell: (item) => (
        <span className="text-sm">{item.sort_order}</span>
      ),
      sortable: false,
    },
    {
      key: "is_active",
      header: "Status",
      cell: (item) => (
        <span className={`px-2 py-1 rounded-full text-xs ${item.is_active
          ? 'bg-green-100 text-green-800'
          : 'bg-gray-100 text-gray-800'
          }`}>
          {item.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
      sortable: false,
    },
    {
      key: "created_at",
      header: "Created",
      cell: (item) => formatDate(item.created_at),
      sortable: false,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (item) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedItemId(item.id)
              setShowDeleteModal(true)
            }}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ]

  const items = listData?.data || []
  const pagination = listData?.pagination

  return (
    <div className="container mx-auto py-2">
      <Card>
        <div className="p-4">
          <div className="flex justify-between mb-6">
            <h1 className="text-xl font-semibold">Why Chose Us Management</h1>

            <div className="flex gap-3">
              <div className="relative w-6/12">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-9 w-full font-normal"
                  value={search}
                  onChange={handleSearch}
                />
              </div>

              <Button className="gap-2 bg-green-600 text-white" onClick={handleAdd}>
                <Plus className="h-4 w-4" />
                Add New
              </Button>
            </div>
          </div>

          <CardContent className="p-0">
            <DataTable
              data={items}
              columns={columns}
              isLoading={listLoading}
              keyExtractor={(item) => item.id}
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

      <WhyChoseUsFormModal
        isOpen={showModal}
        whyChoseUs={editingItem}
        onClose={() => {
          setShowModal(false)
          setEditingItem(null)
        }}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        isLoading={false}
        title="Delete Why Chose Us?"
        description="Are you sure you want to delete this item? This action cannot be undone."
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedItemId(null)
        }}
        onConfirm={() => {
          if (selectedItemId) {
            onDeleteWhyChoseUs(selectedItemId)
            setShowDeleteModal(false)
          }
        }}
      />
    </div>
  )
}