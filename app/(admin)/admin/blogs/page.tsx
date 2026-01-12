"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Edit, Search, Plus } from "lucide-react"
import { DataTable, DataTableColumn } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import useBlogs from "./_hooks/useBlogs"
import { BlogFormModal } from "./_components/blog-form-modal"
import { formatDate } from "@/utils/helper"
import ConfirmDeleteModal from "@/components/shared/confirm-modal"

interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image: string
  read_time: string
  status: "draft" | "published"
  is_featured: boolean
  meta_title: string
  meta_description: string
  view_count: number
  published_at: string
  created_at: string
  updated_at: string
  author: {
    id: string
    first_name: string
    last_name: string
    avatar: string | null
  }
  category: {
    id: string
    name: string
    slug: string
    color: string
  }
  tags: any[]
}

export default function AdminBlogPage() {
  const {
    listData,
    listLoading,
    listError,
    categories,
    onDeleteBlog,
    handleStatusChange,
    search,
    setSearch,
    limit,
    setPage,
    setLimit,
  } = useBlogs("blogs")

  const [showModal, setShowModal] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null)

  const handleAdd = () => {
    setEditingBlog(null)
    setShowModal(true)
  }

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog)
    setShowModal(true)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const columns: DataTableColumn<Blog>[] = [
    {
      key: "featured_image",
      header: "Image",
      cell: (b) => (
        <img
          src={b.featured_image || "/placeholder.png"}
          alt={b.title}
          className="h-10 w-10 rounded-md object-cover"
        />
      ),
    },
    {
      key: "title",
      header: "Title",
      cell: (b) => (
        <div className="max-w-xs">
          <div className="font-medium truncate">{b.title}</div>
          <div className="text-xs text-muted-foreground truncate">{b.excerpt}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "category",
      header: "Category",
      cell: (b) => (
        <span
          className="px-2 py-1 rounded text-xs text-white"
          style={{ backgroundColor: b.category?.color || "#666" }}
        >
          {b.category?.name || "N/A"}
        </span>
      ),
    },
    {
      key: "author",
      header: "Author",
      cell: (b) => `${b.author?.first_name} ${b.author?.last_name}`,
    },
    {
      key: "view_count",
      header: "Views",
      cell: (b) => b.view_count.toLocaleString(),
      sortable: true,
    },
    {
      key: "is_featured",
      header: "Featured",
      cell: (b) => (
        <span className={b.is_featured ? "text-yellow-500" : "text-gray-400"}>
          {b.is_featured ? "⭐" : "☆"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (b) => (
        <select
          value={b.status}
          onChange={(e) => handleStatusChange(b.id, e.target.value as any)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      ),
    },
    {
      key: "published_at",
      header: "Published",
      cell: (b) => formatDate(b.published_at),
      sortable: true,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (b) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(b)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedBlogId(b.id)
              setShowDeleteModal(true)
            }}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ]


  const blogs = listData?.data?.blogs || []
  const pagination = listData?.data?.pagination

  return (
    <div className="container mx-auto py-2">
      <Card>
        <div className="p-4">
          <div className="flex justify-between mb-6">
            <h1 className="text-xl font-semibold">Blog Management</h1>

            <div className="flex gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search blogs..."
                  className="pl-9 w-full font-normal"
                  value={search}
                  onChange={handleSearch}
                />
              </div>

              <Button className="gap-2 bg-green-600 text-white" onClick={handleAdd}>
                <Plus className="h-4 w-4" />
                Add Blog
              </Button>
            </div>
          </div>

          <CardContent className="p-0">
            <DataTable
              data={blogs}
              columns={columns}
              isLoading={listLoading}
              keyExtractor={(b) => b.id}
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

      <BlogFormModal
        isOpen={showModal}
        blog={editingBlog}
        onClose={() => {
          setShowModal(false)
          setEditingBlog(null)
        }}
        categories={categories}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        isLoading={false}
        title="Delete Blog?"
        description="Are you sure you want to delete this blog? This action cannot be undone."
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedBlogId(null)
        }}
        onConfirm={() => {
          if (selectedBlogId) {
            onDeleteBlog(selectedBlogId)
            setShowDeleteModal(false)
          }
        }}
      />
    </div>
  )
}