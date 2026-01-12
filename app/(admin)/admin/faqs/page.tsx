"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Edit, Search, Plus } from "lucide-react"
import { DataTable, DataTableColumn } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import useFaqs from "./_hooks/useFaqs"
import { formatDate } from "@/utils/helper"
import ConfirmDeleteModal from "@/components/shared/confirm-modal"
import { FaqFormModal } from "./_components/faqs-form-modal"

interface Faq {
  id: string
  question: string
  answer: string
  category: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export default function AdminFaqsPage() {
  const {
    listData,
    listLoading,
    listError,
    onDeleteFaq,
    search,
    setSearch,
    limit,
    setPage,
    setLimit,
  } = useFaqs("faqs")

  const [showModal, setShowModal] = useState(false)
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedFaqId, setSelectedFaqId] = useState<string | null>(null)

  const handleAdd = () => {
    setEditingFaq(null)
    setShowModal(true)
  }

  const handleEdit = (faq: Faq) => {
    setEditingFaq(faq)
    setShowModal(true)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const columns: DataTableColumn<Faq>[] = [
    {
      key: "question",
      header: "Question",
      cell: (faq) => (
        <div className="max-w-md">
          {faq.question}
        </div>
      ),
      sortable: false,
    },
    {
      key: "answer",
      header: "Answer",
      cell: (faq) => (
        <div className="max-w-md truncate">
          {faq.answer}
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (faq) => (
        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 capitalize">
          {faq.category}
        </span>
      ),
      sortable: false,
    },
    {
      key: "sort_order",
      header: "Order",
      cell: (faq) => faq.sort_order,
      sortable: false,
    },
    {
      key: "is_active",
      header: "Status",
      cell: (faq) => (
        <span className={`px-2 py-1 rounded-full text-xs ${faq.is_active
          ? 'bg-green-100 text-green-800'
          : 'bg-gray-100 text-gray-800'
          }`}>
          {faq.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
      sortable: false,
    },
    {
      key: "created_at",
      header: "Created",
      cell: (faq) => formatDate(faq.created_at),
      sortable: false,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (faq) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(faq)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedFaqId(faq.id)
              setShowDeleteModal(true)
            }}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ]

  const faqs = listData?.data || []
  const pagination = listData?.pagination

  return (
    <div className="container mx-auto py-2">
      <Card>
        <div className="p-4">
          <div className="flex justify-between mb-6">
            <h1 className="text-xl font-semibold">FAQ Management</h1>

            <div className="flex gap-3">
              <div className="relative w-6/12">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search FAQs..."
                  className="pl-9 w-full font-normal"
                  value={search}
                  onChange={handleSearch}
                />
              </div>

              <Button className="gap-2 bg-green-600 text-white" onClick={handleAdd}>
                <Plus className="h-4 w-4" />
                Add FAQ
              </Button>
            </div>
          </div>

          <CardContent className="p-0">
            <DataTable
              data={faqs}
              columns={columns}
              isLoading={listLoading}
              keyExtractor={(faq) => faq.id}
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

      <FaqFormModal
        isOpen={showModal}
        faq={editingFaq}
        onClose={() => {
          setShowModal(false)
          setEditingFaq(null)
        }}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        isLoading={false}
        title="Delete FAQ?"
        description="Are you sure you want to delete this FAQ? This action cannot be undone."
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedFaqId(null)
        }}
        onConfirm={() => {
          if (selectedFaqId) {
            onDeleteFaq(selectedFaqId)
            setShowDeleteModal(false)
          }
        }}
      />
    </div>
  )
}