"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, X } from "lucide-react"
import useHeroSlides from "../_hooks/useHeroSlides"

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

interface HeroSlideFormModalProps {
  isOpen: boolean
  slide: HeroSlide | null
  onClose: () => void
}

export function HeroSlideFormModal({
  isOpen,
  slide,
  onClose,
}: HeroSlideFormModalProps) {
  const {
    formState,
    handleInputChange,
    setFormState,
    createHeroSlide,
    updateHeroSlide,
    isLoading,
    uploadingImage,
    onUploadImage,
    removeImage,
  } = useHeroSlides(slide ? "update" : "create", slide?.id)

  // Reset or populate form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (slide) {
        setFormState({
          title: slide.title,
          description: slide.description,
          image_url: slide.image_url,
          image_alt: slide.image_alt,
          primary_btn_text: slide.primary_btn_text,
          primary_btn_link: slide.primary_btn_link,
          secondary_btn_text: slide.secondary_btn_text,
          secondary_btn_link: slide.secondary_btn_link,
          badge_text: slide.badge_text,
          is_active: slide.is_active,
          sort_order: slide.sort_order,
          start_date: slide.start_date,
          end_date: slide.end_date,
        })
      } else {
        setFormState({
          title: "",
          description: "",
          image_url: "",
          image_alt: "",
          primary_btn_text: "",
          primary_btn_link: "",
          secondary_btn_text: "",
          secondary_btn_link: "",
          badge_text: "",
          is_active: true,
          sort_order: 1,
          start_date: null,
          end_date: null,
        })
      }
    }
  }, [isOpen, slide, setFormState])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await onUploadImage(file)
      e.target.value = "" // Reset input
    }
  }

  const handleSubmit = async () => {
    if (slide) {
      await updateHeroSlide()
    } else {
      await createHeroSlide()
    }

    if (!isLoading) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:min-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{slide ? "Edit Hero Slide" : "Create New Hero Slide"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* TITLE */}
          <div>
            <label className="text-sm font-medium block mb-1">Title *</label>
            <Input
              name="title"
              value={formState.title}
              onChange={handleInputChange}
              required
              placeholder="Expert Accounting Services for Your Business"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-medium block mb-1">Description *</label>
            <Textarea
              name="description"
              rows={3}
              value={formState.description}
              onChange={handleInputChange}
              required
              placeholder="Trusted by businesses nationwide for over 25 years..."
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="text-sm font-medium block mb-2">Hero Image *</label>

            {!formState.image_url ? (
              <div>
                <label className="cursor-pointer">
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition">
                    <Upload className="mx-auto h-10 w-10 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {uploadingImage ? "Uploading..." : "Click to upload hero image"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended: 1920x1080px or 16:9 ratio (JPG, PNG, WebP)
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
                  src={formState.image_url}
                  alt="Hero slide preview"
                  className="w-full max-w-md h-48 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* IMAGE ALT TEXT */}
          <div>
            <label className="text-sm font-medium block mb-1">Image Alt Text</label>
            <Input
              name="image_alt"
              value={formState.image_alt}
              onChange={handleInputChange}
              placeholder="Professional accounting team working"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Describe the image for accessibility and SEO
            </p>
          </div>

          {/* BADGE TEXT */}
          <div>
            <label className="text-sm font-medium block mb-1">Badge Text</label>
            <Input
              name="badge_text"
              value={formState.badge_text}
              onChange={handleInputChange}
              placeholder="Award-Winning CPA Firm Since 1998"
            />
          </div>

          {/* PRIMARY BUTTON */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-sm font-semibold mb-3">Primary Button (CTA)</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium block mb-1">Button Text</label>
                <Input
                  name="primary_btn_text"
                  value={formState.primary_btn_text}
                  onChange={handleInputChange}
                  placeholder="Get Started"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Button Link</label>
                <Input
                  name="primary_btn_link"
                  value={formState.primary_btn_link}
                  onChange={handleInputChange}
                  placeholder="/contact"
                />
              </div>
            </div>
          </div>

          {/* SECONDARY BUTTON */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-sm font-semibold mb-3">Secondary Button (Optional)</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium block mb-1">Button Text</label>
                <Input
                  name="secondary_btn_text"
                  value={formState.secondary_btn_text}
                  onChange={handleInputChange}
                  placeholder="Our Services"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Button Link</label>
                <Input
                  name="secondary_btn_link"
                  value={formState.secondary_btn_link}
                  onChange={handleInputChange}
                  placeholder="/services"
                />
              </div>
            </div>
          </div>

          {/* SORT ORDER & ACTIVE STATUS */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block mb-1">Sort Order *</label>
              <Input
                type="number"
                name="sort_order"
                value={formState.sort_order}
                onChange={handleInputChange}
                required
                min="1"
                placeholder="1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Lower numbers appear first
              </p>
            </div>

            <div className="flex items-center pt-6">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formState.is_active}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor="is_active" className="text-sm font-medium cursor-pointer">
                Active (visible on site)
              </label>
            </div>
          </div>

          {/* SCHEDULE (OPTIONAL) */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold mb-3">Schedule (Optional)</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium block mb-1">Start Date</label>
                <Input
                  type="datetime-local"
                  name="start_date"
                  value={formState.start_date || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">End Date</label>
                <Input
                  type="datetime-local"
                  name="end_date"
                  value={formState.end_date || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Leave empty to display always. Set dates to schedule visibility.
            </p>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              className="bg-primary text-white"
              onClick={handleSubmit}
              disabled={isLoading || uploadingImage}
            >
              {isLoading ? "Saving..." : slide ? "Update Slide" : "Create Slide"}
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