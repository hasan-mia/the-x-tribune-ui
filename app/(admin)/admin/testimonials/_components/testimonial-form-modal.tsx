"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import useTestimonial from "../_hooks/useTestimonial"
import { Star, Upload, X, Loader2 } from "lucide-react"

interface Testimonial {
  id: string
  name: string
  avatar: string | null
  role: string
  text: string
  rating: number
  isActive: boolean
  displayOrder: number
}

interface TestimonialFormModalProps {
  isOpen: boolean
  testimonial: Testimonial | null
  onClose: () => void
}

export function TestimonialFormModal({
  isOpen,
  testimonial,
  onClose,
}: TestimonialFormModalProps) {
  const {
    formState,
    handleInputChange,
    setFormState,
    createTestimonial,
    updateTestimonial,
    isLoading,
    uploadingImage,
    onUploadImage,
    removeImage,
  } = useTestimonial(testimonial ? "update" : "create", testimonial?.id)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      if (testimonial) {
        setFormState({
          name: testimonial.name,
          avatar: testimonial.avatar || "",
          role: testimonial.role,
          text: testimonial.text,
          rating: testimonial.rating,
          isActive: testimonial.isActive ?? true,
          displayOrder: testimonial.displayOrder || 0,
        } as any)
      } else {
        setFormState({
          name: "",
          avatar: "",
          role: "",
          text: "",
          rating: 5,
          isActive: true,
          displayOrder: 0,
        } as any)
      }
    }
  }, [isOpen, testimonial, setFormState])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (testimonial) {
      await updateTestimonial()
    } else {
      await createTestimonial()
    }

    if (!isLoading) {
      onClose()
    }
  }

  const handleStatusChange = (checked: boolean) => {
    setFormState((prev: any) => ({
      ...prev,
      isActive: checked,
    }))
  }

  const handleRatingChange = (rating: number) => {
    setFormState((prev: any) => ({
      ...prev,
      rating,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
      if (!validTypes.includes(file.type)) {
        alert("Please upload a valid image file (JPG, PNG, or WEBP)")
        return
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        alert("File size must be less than 5MB")
        return
      }

      onUploadImage(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:min-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {testimonial ? "Edit Testimonial" : "Add Testimonial"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* NAME */}
          <div>
            <label className="text-sm font-medium block mb-1">Name *</label>
            <Input
              name="name"
              value={(formState as any).name || ""}
              onChange={handleInputChange}
              placeholder="Enter person's name"
              required
            />
          </div>

          {/* ROLE */}
          <div>
            <label className="text-sm font-medium block mb-1">Role/Position *</label>
            <Input
              name="role"
              value={(formState as any).role || ""}
              onChange={handleInputChange}
              placeholder="e.g., CEO at Company Name"
              required
            />
          </div>

          {/* AVATAR UPLOAD */}
          <div>
            <label className="text-sm font-medium block mb-2">Avatar</label>

            {(formState as any).avatar ? (
              <div className="relative inline-block">
                <img
                  src={(formState as any).avatar}
                  alt="Avatar preview"
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  disabled={uploadingImage}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={triggerFileInput}
                  disabled={uploadingImage}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span>Upload Avatar</span>
                    </>
                  )}
                </button>
                <span className="text-xs text-muted-foreground">
                  JPG, PNG or WEBP (Max 5MB)
                </span>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* TESTIMONIAL TEXT */}
          <div>
            <label className="text-sm font-medium block mb-1">Testimonial *</label>
            <Textarea
              name="text"
              rows={5}
              value={(formState as any).text || ""}
              onChange={handleInputChange}
              placeholder="Enter testimonial text"
              required
            />
          </div>

          {/* RATING */}
          <div>
            <label className="text-sm font-medium block mb-2">Rating *</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 cursor-pointer transition-colors ${star <= ((formState as any).rating || 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 hover:text-yellow-200"
                      }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground self-center">
                ({(formState as any).rating || 0}/5)
              </span>
            </div>
          </div>

          {/* DISPLAY ORDER */}
          <div>
            <label className="text-sm font-medium block mb-1">Display Order</label>
            <Input
              name="displayOrder"
              type="number"
              value={(formState as any).displayOrder || 0}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Lower numbers appear first
            </p>
          </div>

          {/* STATUS TOGGLE */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={(formState as any).isActive ?? true}
              onCheckedChange={handleStatusChange}
            />
            <Label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
              Active Status {(formState as any).isActive ? "(Active)" : "(Inactive)"}
            </Label>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-2 pt-4">
            <Button
              className="bg-primary text-white"
              type="submit"
              disabled={isLoading || uploadingImage}
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading || uploadingImage}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}