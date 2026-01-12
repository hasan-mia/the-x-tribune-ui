"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Upload, X, Plus, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useServices from "../_hooks/useServices"

interface Service {
  id: string
  title: string
  slug: string
  icon: string
  short_description: string
  description: string
  service_type: string
  price: number
  currency: string
  requires_scheduling: boolean
  duration: number
  meeting_color: string
  featured_image: string
  is_active: boolean
  is_featured: boolean
  sort_order: number
  features?: any[]
}

interface ServiceFormModalProps {
  isOpen: boolean
  service: Service | null
  onClose: () => void
}

export function ServiceFormModal({
  isOpen,
  service,
  onClose,
}: ServiceFormModalProps) {
  const {
    formState,
    handleInputChange,
    setFormState,
    createService,
    updateService,
    isLoading,
    generateSlug,
    uploadingImage,
    onUploadImage,
    removeImage,
    addFeature,
    updateFeature,
    removeFeature,
  } = useServices(service ? "update" : "create", service?.id)

  useEffect(() => {
    if (isOpen && service) {
      setFormState({
        title: service.title,
        slug: service.slug,
        icon: service.icon || "",
        short_description: service.short_description || "",
        description: service.description || "",
        service_type: service.service_type as any,
        price: service.price || 0,
        currency: service.currency || "USD",
        plan_id: null,
        requires_scheduling: service.requires_scheduling ?? false,
        duration: service.duration || null,
        meeting_color: service.meeting_color || "",
        featured_image: service.featured_image || "",
        is_active: service.is_active ?? true,
        is_featured: service.is_featured ?? false,
        sort_order: service.sort_order || 0,
        meta_title: "",
        meta_description: "",
        features: service.features?.map((f: any) => ({
          feature_text: f.feature_text,
          is_included: f.is_included ?? true,
          sort_order: f.sort_order || 0,
        })) || [],
      })
    }
  }, [isOpen, service])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = service ? await updateService() : await createService()
    if (success) {
      onClose()
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormState((prev) => ({
      ...prev,
      title,
      slug: service ? prev.slug : generateSlug(title),
    }))
  }

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: 'icon' | 'featured_image'
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      await onUploadImage(file, fieldName)
      e.target.value = ""
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:min-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{service ? "Edit Service" : "Add Service"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* TITLE */}
          <div>
            <label className="text-sm font-medium block mb-1">Title *</label>
            <Input
              name="title"
              value={formState.title}
              onChange={handleTitleChange}
              placeholder="Enter service title"
              required
            />
          </div>

          {/* SLUG */}
          <div>
            <label className="text-sm font-medium block mb-1">
              Slug {service ? "" : "(Auto-generated)"}
            </label>
            <Input
              name="slug"
              value={formState.slug}
              onChange={handleInputChange}
              placeholder="service-slug"
              disabled={!service}
              className={!service ? "bg-gray-50" : ""}
            />
          </div>

          {/* SERVICE TYPE & PRICE */}
          <div className="flex justify-between items-center gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Price *</label>
              <Input
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formState.price}
                onChange={handleInputChange}
                placeholder="0.00"
                disabled={formState.service_type === "free_consultation"}
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Service Type *</label>
              <Select
                value={formState.service_type}
                onValueChange={(value: any) =>
                  setFormState((prev) => ({ ...prev, service_type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free_consultation">Free Consultation</SelectItem>
                  <SelectItem value="paid_service">Paid Service</SelectItem>
                  <SelectItem value="subscription">Subscription</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* SCHEDULING & DURATION */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={formState.requires_scheduling}
                onCheckedChange={(checked) =>
                  setFormState((prev) => ({ ...prev, requires_scheduling: checked }))
                }
              />
              <Label>Requires Scheduling</Label>
            </div>

            {formState.requires_scheduling && (
              <div>
                <label className="text-sm font-medium block mb-1">Duration (minutes) *</label>
                <Input
                  name="duration"
                  type="number"
                  min="1"
                  value={formState.duration || ""}
                  onChange={handleInputChange}
                  placeholder="30"
                  required={formState.requires_scheduling}
                />
              </div>
            )}
          </div>

          {/* SHORT DESCRIPTION */}
          <div>
            <label className="text-sm font-medium block mb-1">Short Description</label>
            <Textarea
              name="short_description"
              rows={2}
              value={formState.short_description}
              onChange={handleInputChange}
              placeholder="Brief description"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-medium block mb-1">Description</label>
            <Textarea
              name="description"
              rows={4}
              value={formState.description}
              onChange={handleInputChange}
              placeholder="Full description"
            />
          </div>

          {/* FEATURES */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Features</label>
              <Button type="button" size="sm" onClick={addFeature} variant="outline">
                <Plus className="h-4 w-4 mr-1" /> Add Feature
              </Button>
            </div>

            <div className="space-y-2">
              {formState.features.map((feature, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={feature.feature_text}
                    onChange={(e) => updateFeature(index, 'feature_text', e.target.value)}
                    placeholder="Feature text"
                  />
                  <Switch
                    checked={feature.is_included}
                    onCheckedChange={(checked) =>
                      updateFeature(index, 'is_included', checked)
                    }
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => removeFeature(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* IMAGES */}
          <div className="grid grid-cols-2 gap-4">
            {/* Icon */}
            <div>
              <label className="text-sm font-medium block mb-2">Icon</label>
              {!formState.icon ? (
                <label className="cursor-pointer">
                  <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition">
                    <Upload className="mx-auto h-8 w-8 mb-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Upload icon</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'icon')}
                    disabled={uploadingImage}
                  />
                </label>
              ) : (
                <div className="relative inline-block">
                  <img
                    src={formState.icon}
                    alt="Icon"
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage('icon')}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Featured Image */}
            <div>
              <label className="text-sm font-medium block mb-2">Featured Image</label>
              {!formState.featured_image ? (
                <label className="cursor-pointer">
                  <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition">
                    <Upload className="mx-auto h-8 w-8 mb-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Upload image</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'featured_image')}
                    disabled={uploadingImage}
                  />
                </label>
              ) : (
                <div className="relative inline-block">
                  <img
                    src={formState.featured_image}
                    alt="Featured"
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage('featured_image')}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* STATUS SWITCHES */}
          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                checked={formState.is_active}
                onCheckedChange={(checked) =>
                  setFormState((prev) => ({ ...prev, is_active: checked }))
                }
              />
              <Label>Active</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formState.is_featured}
                onCheckedChange={(checked) =>
                  setFormState((prev) => ({ ...prev, is_featured: checked }))
                }
              />
              <Label>Featured</Label>
            </div>
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
