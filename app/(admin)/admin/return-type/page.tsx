"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Edit, Search, Plus } from "lucide-react"
import { DataTable, DataTableColumn } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { formatDate } from "@/utils/helper"
import ConfirmDeleteModal from "@/components/shared/confirm-modal"
import useReturnTypes from "./_hooks/useReturnTypes"
import { ReturnTypeFormModal } from "./_components/return-type-form-modal"

interface ReturnType {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export default function AdminReturnTypesPage() {
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
  } = useReturnTypes("return-types")

  const [showModal, setShowModal] = useState(false)
  const [editingReturnType, setEditingReturnType] = useState<ReturnType | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedReturnTypeId, setSelectedReturnTypeId] = useState<string | null>(null)

  const handleAdd = () => {
    setEditingReturnType(null)
    setShowModal(true)
  }

  const handleEdit = (returnType: ReturnType) => {
    setEditingReturnType(returnType)
    setShowModal(true)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const columns: DataTableColumn<ReturnType>[] = [
    {
      key: "name",
      header: "Name",
      cell: (rt) => rt.name,
      sortable: false,
    },
    {
      key: "created_at",
      header: "Created",
      cell: (rt) => formatDate(rt.created_at),
      sortable: false,
    },
    {
      key: "updated_at",
      header: "Updated",
      cell: (rt) => formatDate(rt.updated_at),
      sortable: false,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (rt) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(rt)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedReturnTypeId(rt.id)
              setShowDeleteModal(true)
            }}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ]

  const returnTypes = listData?.data || []
  const pagination = listData?.pagination

  return (
    <div className="container mx-auto py-2">
      <Card>
        <div className="p-4">
          <div className="flex justify-between mb-6">
            <h1 className="text-xl font-semibold">Return Type Management</h1>

            <div className="flex gap-3">
              <div className="relative w-6/12">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search return types..."
                  className="pl-9 w-full font-normal"
                  value={search}
                  onChange={handleSearch}
                />
              </div>

              <Button className="gap-2 bg-green-600 text-white" onClick={handleAdd}>
                <Plus className="h-4 w-4" />
                Add Return Type
              </Button>
            </div>
          </div>

          <CardContent className="p-0">
            <DataTable
              data={returnTypes}
              columns={columns}
              isLoading={listLoading}
              keyExtractor={(rt) => rt.id}
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

      <ReturnTypeFormModal
        isOpen={showModal}
        returnType={editingReturnType}
        onClose={() => {
          setShowModal(false)
          setEditingReturnType(null)
        }}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        isLoading={false}
        title="Delete Return Type?"
        description="Are you sure you want to delete this return type? This action cannot be undone."
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedReturnTypeId(null)
        }}
        onConfirm={() => {
          if (selectedReturnTypeId) {
            onDeleteDocumentType(selectedReturnTypeId)
            setShowDeleteModal(false)
          }
        }}
      />
    </div>
  )
}