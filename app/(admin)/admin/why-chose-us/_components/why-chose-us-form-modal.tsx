"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Upload, X } from "lucide-react"
import useWhyChoseUs from "../_hooks/useWhyChoseUs"

interface WhyChoseUs {
  id: string
  title: string
  slug: string
  description: string
  icon: string
  is_active: boolean
  sort_order: number
}

interface WhyChoseUsFormModalProps {
  isOpen: boolean
  whyChoseUs: WhyChoseUs | null
  onClose: () => void
}

export function WhyChoseUsFormModal({
  isOpen,
  whyChoseUs,
  onClose,
}: WhyChoseUsFormModalProps) {
  const {
    formState,
    handleInputChange,
    setFormState,
    createWhyChoseUs,
    updateWhyChoseUs,
    isLoading,
    generateSlug,
    uploadingIcon,
    onUploadIcon,
    removeIcon,
  } = useWhyChoseUs(whyChoseUs ? "update" : "create", whyChoseUs?.id)

  useEffect(() => {
    if (isOpen) {
      if (whyChoseUs) {
        setFormState({
          title: whyChoseUs.title,
          slug: whyChoseUs.slug,
          description: whyChoseUs.description,
          icon: whyChoseUs.icon || "",
          is_active: whyChoseUs.is_active ?? true,
          sort_order: whyChoseUs.sort_order || 1,
        } as any)
      } else {
        setFormState({
          title: "",
          slug: "",
          description: "",
          icon: "",
          is_active: true,
          sort_order: 1,
        } as any)
      }
    }
  }, [isOpen, whyChoseUs, setFormState])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (whyChoseUs) {
      await updateWhyChoseUs()
    } else {
      await createWhyChoseUs()
    }

    if (!isLoading) {
      onClose()
    }
  }

  const handleStatusChange = (checked: boolean) => {
    setFormState((prev: any) => ({
      ...prev,
      is_active: checked,
    }))
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormState((prev: any) => ({
      ...prev,
      title: title,
      // Auto-generate slug only when creating new item
      slug: whyChoseUs ? prev.slug : generateSlug(title),
    }))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await onUploadIcon(file)
      e.target.value = "" // Reset input
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:min-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{whyChoseUs ? "Edit Why Chose Us" : "Add Why Chose Us"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* TITLE */}
          <div>
            <label className="text-sm font-medium block mb-1">Title *</label>
            <Input
              name="title"
              value={(formState as any).title || ""}
              onChange={handleTitleChange}
              placeholder="Enter title"
              required
            />
          </div>

          {/* SLUG */}
          <div>
            <label className="text-sm font-medium block mb-1">
              Slug {whyChoseUs ? "" : "(Auto-generated)"}
            </label>
            <Input
              name="slug"
              value={(formState as any).slug || ""}
              onChange={handleInputChange}
              placeholder="why-chose-us-slug"
              disabled={!whyChoseUs}
              className={!whyChoseUs ? "bg-gray-50" : ""}
            />
            <p className="text-xs text-gray-500 mt-1">
              {whyChoseUs
                ? "Slug cannot be changed after creation"
                : "Automatically generated from title"}
            </p>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-medium block mb-1">Description *</label>
            <Textarea
              name="description"
              rows={3}
              value={(formState as any).description || ""}
              onChange={handleInputChange}
              placeholder="Enter description"
              required
            />
          </div>

          {/* ICON IMAGE UPLOAD */}
          <div>
            <label className="text-sm font-medium block mb-2">Icon Image *</label>

            {/* Upload Button or Preview */}
            {!(formState as any).icon ? (
              <div>
                <label className="cursor-pointer">
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition">
                    <Upload className="mx-auto h-10 w-10 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {uploadingIcon ? "Uploading..." : "Click to upload icon"}
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
                    disabled={uploadingIcon}
                  />
                </label>
              </div>
            ) : (
              <div className="relative inline-block">
                <img
                  src={(formState as any).icon}
                  alt="Icon"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={removeIcon}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* SORT ORDER */}
          <div>
            <label className="text-sm font-medium block mb-1">Sort Order *</label>
            <Input
              name="sort_order"
              type="number"
              min="1"
              value={(formState as any).sort_order || 1}
              onChange={handleInputChange}
              placeholder="Enter sort order"
              required
            />
          </div>

          {/* STATUS TOGGLE */}
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={(formState as any).is_active ?? true}
              onCheckedChange={handleStatusChange}
            />
            <Label htmlFor="is_active" className="text-sm font-medium cursor-pointer">
              Active Status {(formState as any).is_active ? "(Active)" : "(Inactive)"}
            </Label>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-2 pt-4">
            <Button
              className="bg-primary text-white"
              type="submit"
              disabled={isLoading || uploadingIcon}
            >
              {isLoading ? "Saving..." : "Save"}
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
        </form>
      </DialogContent>
    </Dialog>
  )
}