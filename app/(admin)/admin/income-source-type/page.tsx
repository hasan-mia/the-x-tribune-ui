"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Edit, Search, Plus } from "lucide-react"
import { DataTable, DataTableColumn } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import useIncomeSourceTypes from "./_hooks/useIncomeSourceTypes"
import { IncomeSourceTypeFormModal } from "./_components/income-source-type-form-modal"
import { formatDate } from "@/utils/helper"
import ConfirmDeleteModal from "@/components/shared/confirm-modal"

interface IncomeSourceType {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export default function AdminIncomeSourceTypesPage() {
  const {
    listData,
    listLoading,
    listError,
    onDeleteIncomeSourceType,
    search,
    setSearch,
    limit,
    setPage,
    setLimit,
  } = useIncomeSourceTypes("income-source-types")

  const [showModal, setShowModal] = useState(false)
  const [editingIncomeSourceType, setEditingIncomeSourceType] = useState<IncomeSourceType | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedIncomeSourceTypeId, setSelectedIncomeSourceTypeId] = useState<string | null>(null)

  const handleAdd = () => {
    setEditingIncomeSourceType(null)
    setShowModal(true)
  }

  const handleEdit = (incomeSourceType: IncomeSourceType) => {
    setEditingIncomeSourceType(incomeSourceType)
    setShowModal(true)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const columns: DataTableColumn<IncomeSourceType>[] = [
    {
      key: "name",
      header: "Name",
      cell: (ist) => ist.name,
      sortable: false,
    },
    {
      key: "created_at",
      header: "Created",
      cell: (ist) => formatDate(ist.created_at),
      sortable: false,
    },
    {
      key: "updated_at",
      header: "Updated",
      cell: (ist) => formatDate(ist.updated_at),
      sortable: false,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (ist) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(ist)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedIncomeSourceTypeId(ist.id)
              setShowDeleteModal(true)
            }}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ]

  const incomeSourceTypes = listData?.data || []
  const pagination = listData?.pagination

  return (
    <div className="container mx-auto py-2">
      <Card>
        <div className="p-4">
          <div className="flex justify-between mb-6">
            <h1 className="text-xl font-semibold">Income Source Type Management</h1>

            <div className="flex gap-3">
              <div className="relative w-6/12">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search income source types..."
                  className="pl-9 w-full font-normal"
                  value={search}
                  onChange={handleSearch}
                />
              </div>

              <Button className="gap-2 bg-green-600 text-white" onClick={handleAdd}>
                <Plus className="h-4 w-4" />
                Add Income Source Type
              </Button>
            </div>
          </div>

          <CardContent className="p-0">
            <DataTable
              data={incomeSourceTypes}
              columns={columns}
              isLoading={listLoading}
              keyExtractor={(ist) => ist.id}
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

      <IncomeSourceTypeFormModal
        isOpen={showModal}
        incomeSourceType={editingIncomeSourceType}
        onClose={() => {
          setShowModal(false)
          setEditingIncomeSourceType(null)
        }}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        isLoading={false}
        title="Delete Income Source Type?"
        description="Are you sure you want to delete this income source type? This action cannot be undone."
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedIncomeSourceTypeId(null)
        }}
        onConfirm={() => {
          if (selectedIncomeSourceTypeId) {
            onDeleteIncomeSourceType(selectedIncomeSourceTypeId)
            setShowDeleteModal(false)
          }
        }}
      />
    </div>
  )
}