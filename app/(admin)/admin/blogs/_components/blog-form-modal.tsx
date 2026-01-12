"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, X } from "lucide-react"
import useBlogs from "../_hooks/useBlogs"
import RichTextEditor from "@/components/shared/RichTextEditor"

interface Category {
  id: string
  name: string
  slug: string
  color: string
}

interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image: string
  category_id?: string
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

interface BlogFormModalProps {
  isOpen: boolean
  blog: Blog | null
  categories: Category[]
  onClose: () => void
}

export function BlogFormModal({
  isOpen,
  blog,
  categories,
  onClose,
}: BlogFormModalProps) {
  const {
    formState,
    handleInputChange,
    handleContentChange,
    setFormState,
    createBlog,
    updateBlog,
    isLoading,
    uploadingImage,
    onUploadImage,
    removeFeaturedImage,
  } = useBlogs(blog ? "update" : "create", blog?.id)

  // Reset or populate form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (blog) {
        setFormState({
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt,
          content: blog.content,
          featured_image: blog.featured_image,
          category_id: blog.category_id || blog.category?.id,
          read_time: blog.read_time,
          status: blog.status as any,
          is_featured: blog.is_featured,
          meta_title: blog.meta_title,
          meta_description: blog.meta_description,
        })
      } else {
        setFormState({
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          featured_image: "",
          category_id: categories[0]?.id || "",
          read_time: "",
          status: "draft",
          is_featured: false,
          meta_title: "",
          meta_description: "",
        })
      }
    }
  }, [isOpen, blog, categories, setFormState])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await onUploadImage(file)
      e.target.value = "" // Reset input
    }
  }

  const handleSubmit = async () => {
    if (blog) {
      await updateBlog()
    } else {
      await createBlog()
    }

    if (!isLoading) {
      onClose()
    }
  }

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    handleInputChange(e)

    // Auto-generate slug if it's empty or hasn't been manually edited
    if (!formState.slug || formState.slug === generateSlug(formState.title)) {
      setFormState((prev) => ({
        ...prev,
        slug: generateSlug(newTitle),
      }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:min-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{blog ? "Edit Blog" : "Create New Blog"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* TITLE */}
          <div>
            <label className="text-sm font-medium block mb-1">Title *</label>
            <Input
              name="title"
              value={formState.title}
              onChange={handleTitleChange}
              required
              placeholder="Enter blog title"
            />
          </div>

          {/* SLUG */}
          <div>
            <label className="text-sm font-medium block mb-1">Slug *</label>
            <Input
              name="slug"
              value={formState.slug}
              onChange={handleInputChange}
              required
              placeholder="blog-post-url-slug"
            />
            <p className="text-xs text-muted-foreground mt-1">
              URL-friendly version of the title
            </p>
          </div>

          {/* EXCERPT */}
          <div>
            <label className="text-sm font-medium block mb-1">Excerpt *</label>
            <Textarea
              name="excerpt"
              rows={2}
              value={formState.excerpt}
              onChange={handleInputChange}
              required
              placeholder="Brief summary of the blog post"
            />
          </div>

          {/* FEATURED IMAGE */}
          <div>
            <label className="text-sm font-medium block mb-2">Featured Icon</label>

            {/* Upload Button or Preview */}
            {!formState.featured_image ? (
              <div>
                <label className="cursor-pointer">
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition">
                    <Upload className="mx-auto h-10 w-10 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {uploadingImage ? "Uploading..." : "Click to upload icon"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended: Square image (PNG, JPG, WebP)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={uploadingImage}
                  />
                </label>
              </div>
            ) : (
              <div className="relative inline-block">
                <img
                  src={formState.featured_image}
                  alt="Category icon"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={removeFeaturedImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* CONTENT - RICH TEXT EDITOR */}
          <div>
            <label className="text-sm font-medium block mb-2">Content *</label>
            <RichTextEditor
              value={formState.content}
              onChange={handleContentChange}
              placeholder="Write your blog content here..."
            />
          </div>

          {/* CATEGORY + READ TIME */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block mb-1">Category *</label>
              <select
                name="category_id"
                value={formState.category_id}
                onChange={handleInputChange}
                className="w-full border rounded p-2 bg-background"
                required
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Read Time</label>
              <Input
                name="read_time"
                value={formState.read_time}
                onChange={handleInputChange}
                placeholder="e.g., 5 min read"
              />
            </div>
          </div>

          {/* STATUS + FEATURED */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block mb-1">Status *</label>
              <select
                name="status"
                value={formState.status}
                onChange={handleInputChange}
                className="w-full border rounded p-2 bg-background"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="flex items-center pt-6">
              <input
                type="checkbox"
                id="is_featured"
                name="is_featured"
                checked={formState.is_featured}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor="is_featured" className="text-sm font-medium cursor-pointer">
                Featured Post
              </label>
            </div>
          </div>

          {/* SEO META FIELDS */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold mb-3">SEO Settings</h3>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium block mb-1">Meta Title</label>
                <Input
                  name="meta_title"
                  value={formState.meta_title}
                  onChange={handleInputChange}
                  placeholder="SEO title for search engines"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Meta Description</label>
                <Textarea
                  name="meta_description"
                  rows={2}
                  value={formState.meta_description}
                  onChange={handleInputChange}
                  placeholder="SEO description for search engines"
                />
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              className="bg-primary text-white"
              onClick={handleSubmit}
              disabled={isLoading || uploadingImage}
            >
              {isLoading ? "Saving..." : blog ? "Update Blog" : "Create Blog"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}