"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Upload, X } from "lucide-react"
import useIndustries from "../_hooks/useIndustries"

interface Industry {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  is_active: boolean
  sort_order: number
}

interface IndustryFormModalProps {
  isOpen: boolean
  industry: Industry | null
  onClose: () => void
}

export function IndustryFormModal({
  isOpen,
  industry,
  onClose,
}: IndustryFormModalProps) {
  const {
    formState,
    handleInputChange,
    setFormState,
    createIndustry,
    updateIndustry,
    isLoading,
    generateSlug,
    uploadingIcon,
    onUploadIcon,
    removeIcon,
  } = useIndustries(industry ? "update" : "create", industry?.id)

  useEffect(() => {
    if (isOpen) {
      if (industry) {
        setFormState({
          name: industry.name,
          slug: industry.slug,
          description: industry.description,
          icon: industry.icon || "",
          is_active: industry.is_active ?? true,
          sort_order: industry.sort_order || 1,
        } as any)
      } else {
        setFormState({
          name: "",
          slug: "",
          description: "",
          icon: "",
          is_active: true,
          sort_order: 1,
        } as any)
      }
    }
  }, [isOpen, industry, setFormState])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (industry) {
      await updateIndustry()
    } else {
      await createIndustry()
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormState((prev: any) => ({
      ...prev,
      name: name,
      // Auto-generate slug only when creating new industry
      slug: industry ? prev.slug : generateSlug(name),
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
          <DialogTitle>{industry ? "Edit Industry" : "Add Industry"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* NAME */}
          <div>
            <label className="text-sm font-medium block mb-1">Name *</label>
            <Input
              name="name"
              value={(formState as any).name || ""}
              onChange={handleNameChange}
              placeholder="Enter industry name"
              required
            />
          </div>

          {/* SLUG */}
          <div>
            <label className="text-sm font-medium block mb-1">
              Slug {industry ? "" : "(Auto-generated)"}
            </label>
            <Input
              name="slug"
              value={(formState as any).slug || ""}
              onChange={handleInputChange}
              placeholder="industry-slug"
              disabled={!industry}
              className={!industry ? "bg-gray-50" : ""}
            />
            <p className="text-xs text-gray-500 mt-1">
              {industry
                ? "Slug cannot be changed after creation"
                : "Automatically generated from name"}
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
              placeholder="Enter industry description"
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
                  alt="Industry icon"
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