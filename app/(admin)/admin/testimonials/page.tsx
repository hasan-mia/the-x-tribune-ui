"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Search, Plus, Edit, Star } from "lucide-react"
import { DataTable, DataTableColumn } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import useTestimonial from "./_hooks/useTestimonial"
import { formatDate } from "@/utils/helper"
import ConfirmDeleteModal from "@/components/shared/confirm-modal"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TestimonialFormModal } from "./_components/testimonial-form-modal"
import { Badge } from "@/components/ui/badge"

interface Testimonial {
  id: string
  name: string
  avatar: string | null
  role: string
  text: string
  rating: number
  isActive: boolean
  displayOrder: number
  created_at: string
  updated_at: string
}

export default function AdminTestimonialPage() {
  const {
    listData,
    listLoading,
    listError,
    onDeleteTestimonial,
    handleStatusChange,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    limit,
    setPage,
    setLimit,
  } = useTestimonial("testimonials")

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedTestimonialId, setSelectedTestimonialId] = useState<string | null>(null)
  const [showFormModal, setShowFormModal] = useState(false)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial)
    setShowFormModal(true)
  }

  const handleAdd = () => {
    setSelectedTestimonial(null)
    setShowFormModal(true)
  }

  const handleCloseModal = () => {
    setShowFormModal(false)
    setSelectedTestimonial(null)
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
              }`}
          />
        ))}
      </div>
    )
  }

  const columns: DataTableColumn<Testimonial>[] = [
    {
      key: "displayOrder",
      header: "Order",
      cell: (testimonial) => (
        <span className="font-medium text-gray-700">
          {testimonial.displayOrder}
        </span>
      ),
      sortable: true,
    },
    {
      key: "name",
      header: "Person",
      cell: (testimonial) => (
        <div className="flex items-center gap-3">
          {testimonial.avatar ? (
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {testimonial.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <div className="font-medium">{testimonial.name}</div>
            <div className="text-xs text-muted-foreground">{testimonial.role}</div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "rating",
      header: "Rating",
      cell: (testimonial) => (
        <div className="flex items-center gap-2">
          {renderStars(testimonial.rating)}
          <span className="text-sm text-muted-foreground">
            ({testimonial.rating})
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "text",
      header: "Testimonial",
      cell: (testimonial) => (
        <div className="max-w-md truncate" title={testimonial.text}>
          {testimonial.text}
        </div>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      cell: (testimonial) => (
        <select
          value={testimonial.isActive ? "true" : "false"}
          onChange={(e) =>
            handleStatusChange(testimonial.id, e.target.value === "true")
          }
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      ),
    },
    {
      key: "created_at",
      header: "Created",
      cell: (testimonial) => formatDate(testimonial.created_at),
      sortable: true,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (testimonial) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(testimonial)}
            title="Edit"
          >
            <Edit className="h-4 w-4 text-blue-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedTestimonialId(testimonial.id)
              setShowDeleteModal(true)
            }}
            title="Delete"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ]

  const testimonials = listData?.testimonials || []
  const pagination = listData?.pagination

  return (
    <div className="container mx-auto py-2">
      <Card>
        <div className="p-4">
          <div className="flex justify-between mb-6">
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              Testimonials
            </h1>

            <div className="flex gap-3">
              <Button
                className="bg-primary text-white"
                onClick={handleAdd}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Testimonial
              </Button>

              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search testimonials..."
                  className="pl-9 w-full font-normal"
                  value={search}
                  onChange={handleSearch}
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <CardContent className="p-0">
            <DataTable
              data={testimonials}
              columns={columns}
              isLoading={listLoading}
              keyExtractor={(testimonial) => testimonial.id}
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

      {/* Form Modal */}
      <TestimonialFormModal
        isOpen={showFormModal}
        testimonial={selectedTestimonial}
        onClose={handleCloseModal}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        isLoading={false}
        title="Delete Testimonial?"
        description="Are you sure you want to delete this testimonial? This action cannot be undone."
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedTestimonialId(null)
        }}
        onConfirm={() => {
          if (selectedTestimonialId) {
            onDeleteTestimonial(selectedTestimonialId)
            setShowDeleteModal(false)
          }
        }}
      />
    </div>
  )
}