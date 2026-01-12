"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Edit, Search, Plus } from "lucide-react"
import { DataTable, DataTableColumn } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { formatDate } from "@/utils/helper"
import ConfirmDeleteModal from "@/components/shared/confirm-modal"
import useDocumentTypes from "./_hooks/useDocumentTypes"
import { DocumentTypeFormModal } from "./_components/document-type-form-modal"

interface DocumentType {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
}

export default function AdminDocumentTypesPage() {
  const {
    listData,
    listLoading,
    listError,
    onDeleteDocumentType,
    search,
    setSearch,
    limit,
    setPage,
    setLimit,
  } = useDocumentTypes("document-types")

  const [showModal, setShowModal] = useState(false)
  const [editingDocumentType, setEditingDocumentType] = useState<DocumentType | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedDocumentTypeId, setSelectedDocumentTypeId] = useState<string | null>(null)

  const handleAdd = () => {
    setEditingDocumentType(null)
    setShowModal(true)
  }

  const handleEdit = (documentType: DocumentType) => {
    setEditingDocumentType(documentType)
    setShowModal(true)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const columns: DataTableColumn<DocumentType>[] = [
    {
      key: "name",
      header: "Name",
      cell: (dt) => dt.name,
      sortable: false,
    },
    {
      key: "description",
      header: "Description",
      cell: (dt) => (
        <div className="max-w-md truncate">
          {dt.description || "-"}
        </div>
      ),
    },
    {
      key: "created_at",
      header: "Created",
      cell: (dt) => formatDate(dt.created_at),
      sortable: false,
    },
    {
      key: "updated_at",
      header: "Updated",
      cell: (dt) => formatDate(dt.updated_at),
      sortable: false,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (dt) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(dt)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedDocumentTypeId(dt.id)
              setShowDeleteModal(true)
            }}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ]

  const documentTypes = listData?.data || []
  const pagination = listData?.pagination

  return (
    <div className="container mx-auto py-2">
      <Card>
        <div className="p-4">
          <div className="flex justify-between mb-6">
            <h1 className="text-xl font-semibold">Document Type Management</h1>

            <div className="flex gap-3">
              <div className="relative w-6/12">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search document types..."
                  className="pl-9 w-full font-normal"
                  value={search}
                  onChange={handleSearch}
                />
              </div>

              <Button className="gap-2 bg-green-600 text-white" onClick={handleAdd}>
                <Plus className="h-4 w-4" />
                Add Document Type
              </Button>
            </div>
          </div>

          <CardContent className="p-0">
            <DataTable
              data={documentTypes}
              columns={columns}
              isLoading={listLoading}
              keyExtractor={(dt) => dt.id}
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

      <DocumentTypeFormModal
        isOpen={showModal}
        documentType={editingDocumentType}
        onClose={() => {
          setShowModal(false)
          setEditingDocumentType(null)
        }}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        isLoading={false}
        title="Delete Document Type?"
        description="Are you sure you want to delete this document type? This action cannot be undone."
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedDocumentTypeId(null)
        }}
        onConfirm={() => {
          if (selectedDocumentTypeId) {
            onDeleteDocumentType(selectedDocumentTypeId)
            setShowDeleteModal(false)
          }
        }}
      />
    </div>
  )
}