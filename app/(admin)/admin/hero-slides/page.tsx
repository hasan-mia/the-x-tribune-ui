"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Edit, Search, Plus } from "lucide-react"
import { DataTable, DataTableColumn } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { formatDate } from "@/utils/helper"
import ConfirmDeleteModal from "@/components/shared/confirm-modal"
import useHeroSlides from "./_hooks/useHeroSlides"
import { HeroSlideFormModal } from "./_components/hero-form-modal"

interface HeroSlide {
  id: string
  title: string
  description: string
  image_url: string
  image_alt: string
  primary_btn_text: string
  primary_btn_link: string
  secondary_btn_text: string
  secondary_btn_link: string
  badge_text: string
  is_active: boolean
  sort_order: number
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
}

export default function AdminHeroSlidesPage() {
  const {
    listData,
    listLoading,
    listError,
    onDeleteHeroSlide,
    handleActiveChange,
    search,
    setSearch,
    limit,
    setPage,
    setLimit,
  } = useHeroSlides("hero-slides")

  const [showModal, setShowModal] = useState(false)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(null)

  const handleAdd = () => {
    setEditingSlide(null)
    setShowModal(true)
  }

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide)
    setShowModal(true)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const columns: DataTableColumn<HeroSlide>[] = [
    {
      key: "sort_order",
      header: "Order",
      cell: (s) => (
        <span className="font-semibold text-gray-700">{s.sort_order}</span>
      ),
      sortable: true,
    },
    {
      key: "image_url",
      header: "Image",
      cell: (s) => (
        <img
          src={s.image_url || "/placeholder.png"}
          alt={s.image_alt || s.title}
          className="h-16 w-24 rounded-md object-cover"
        />
      ),
    },
    {
      key: "title",
      header: "Title",
      cell: (s) => (
        <div className="max-w-xs">
          <div className="font-medium truncate">{s.title}</div>
          <div className="text-xs text-muted-foreground truncate">{s.description}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "badge_text",
      header: "Badge",
      cell: (s) => (
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {s.badge_text || "N/A"}
        </span>
      ),
    },
    {
      key: "primary_btn_text",
      header: "Primary CTA",
      cell: (s) => (
        <div className="text-sm">
          <div className="font-medium">{s.primary_btn_text || "N/A"}</div>
          <div className="text-xs text-muted-foreground truncate max-w-[150px]">
            {s.primary_btn_link || ""}
          </div>
        </div>
      ),
    },
    {
      key: "is_active",
      header: "Active",
      cell: (s) => (
        <select
          value={s.is_active ? "true" : "false"}
          onChange={(e) => handleActiveChange(s.id, e.target.value === "true")}
          className={`border rounded px-2 py-1 text-sm ${s.is_active ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"
            }`}
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      ),
    },
    {
      key: "start_date",
      header: "Schedule",
      cell: (s) => (
        <div className="text-xs">
          {s.start_date && <div>From: {formatDate(s.start_date)}</div>}
          {s.end_date && <div>To: {formatDate(s.end_date)}</div>}
          {!s.start_date && !s.end_date && <span className="text-muted-foreground">Always</span>}
        </div>
      ),
    },
    {
      key: "updated_at",
      header: "Updated",
      cell: (s) => formatDate(s.updated_at),
      sortable: true,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (s) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(s)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedSlideId(s.id)
              setShowDeleteModal(true)
            }}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ]

  const slides = listData?.data || []

  return (
    <div className="container mx-auto py-2">
      <Card>
        <div className="p-4">
          <div className="flex justify-between mb-6">
            <h1 className="text-xl font-semibold">Hero Slides Management</h1>

            <div className="flex gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search slides..."
                  className="pl-9 w-full font-normal"
                  value={search}
                  onChange={handleSearch}
                />
              </div>

              <Button className="gap-2 bg-green-600 text-white" onClick={handleAdd}>
                <Plus className="h-4 w-4" />
                Add Slide
              </Button>
            </div>
          </div>

          <CardContent className="p-0">
            <DataTable
              data={slides}
              columns={columns}
              isLoading={listLoading}
              keyExtractor={(s) => s.id}
              error={listError ? "Failed to load... Please try again." : undefined}
              searchQuery={search}
              pagination={{
                pageSize: limit,
                total: slides.length,
                pageSizeOptions: [10, 20, 50, 100],
                showSizeChanger: true,
                serverSide: false,
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

      <HeroSlideFormModal
        isOpen={showModal}
        slide={editingSlide}
        onClose={() => {
          setShowModal(false)
          setEditingSlide(null)
        }}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        isLoading={false}
        title="Delete Hero Slide?"
        description="Are you sure you want to delete this hero slide? This action cannot be undone."
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedSlideId(null)
        }}
        onConfirm={() => {
          if (selectedSlideId) {
            onDeleteHeroSlide(selectedSlideId)
            setShowDeleteModal(false)
          }
        }}
      />
    </div>
  )
}