"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Upload, X, Plus, Trash2 } from "lucide-react"
import usePricing from "../_hooks/usePricing"

interface PricingPlan {
  id: string
  name: string
  slug: string
  icon: string
  description: string
  monthly_price: number
  annual_price: number
  is_popular: boolean
  is_active: boolean
  sort_order: number
  trial_days: number
  features?: any[]
}

interface PricingFormModalProps {
  isOpen: boolean
  plan: PricingPlan | null
  onClose: () => void
}

export function PricingFormModal({
  isOpen,
  plan,
  onClose,
}: PricingFormModalProps) {
  const {
    formState,
    handleInputChange,
    setFormState,
    createPricingPlan,
    updatePricingPlan,
    isLoading,
    generateSlug,
    uploadingImage,
    onUploadIcon,
    removeIcon,
    addFeature,
    updateFeature,
    removeFeature,
  } = usePricing(plan ? "update" : "create", plan?.id)

  useEffect(() => {
    if (isOpen && plan) {
      setFormState({
        name: plan.name,
        slug: plan.slug,
        icon: plan.icon || "",
        description: plan.description || "",
        monthly_price: plan.monthly_price || 0,
        annual_price: plan.annual_price || 0,
        stripe_monthly_price_id: "",
        stripe_annual_price_id: "",
        stripe_product_id: "",
        is_popular: plan.is_popular ?? false,
        is_active: plan.is_active ?? true,
        sort_order: plan.sort_order || 0,
        trial_days: plan.trial_days || 0,
        features: plan.features?.map((f: any) => ({
          feature: f.feature,
          is_included: f.is_included ?? true,
          sort_order: f.sort_order || 0,
        })) || [],
      })
    }
  }, [isOpen, plan])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = plan ? await updatePricingPlan() : await createPricingPlan()
    if (success) {
      onClose()
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormState((prev) => ({
      ...prev,
      name,
      slug: plan ? prev.slug : generateSlug(name),
    }))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await onUploadIcon(file)
      e.target.value = ""
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:min-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{plan ? "Edit Pricing Plan" : "Add Pricing Plan"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* NAME */}
          <div>
            <label className="text-sm font-medium block mb-1">Plan Name *</label>
            <Input
              name="name"
              value={formState.name}
              onChange={handleNameChange}
              placeholder="Enter plan name"
              required
            />
          </div>

          {/* SLUG */}
          <div>
            <label className="text-sm font-medium block mb-1">
              Slug {plan ? "" : "(Auto-generated)"}
            </label>
            <Input
              name="slug"
              value={formState.slug}
              onChange={handleInputChange}
              placeholder="plan-slug"
              disabled={!plan}
              className={!plan ? "bg-gray-50" : ""}
            />
          </div>

          {/* PRICING */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Monthly Price *</label>
              <Input
                name="monthly_price"
                type="number"
                step="0.01"
                min="0"
                value={formState.monthly_price}
                onChange={handleInputChange}
                placeholder="29.99"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Annual Price *</label>
              <Input
                name="annual_price"
                type="number"
                step="0.01"
                min="0"
                value={formState.annual_price}
                onChange={handleInputChange}
                placeholder="299.99"
                required
              />
            </div>
          </div>

          {/* TRIAL DAYS & SORT ORDER */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Trial Days</label>
              <Input
                name="trial_days"
                type="number"
                min="0"
                value={formState.trial_days}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Sort Order</label>
              <Input
                name="sort_order"
                type="number"
                min="0"
                value={formState.sort_order}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-medium block mb-1">Description</label>
            <Textarea
              name="description"
              rows={3}
              value={formState.description}
              onChange={handleInputChange}
              placeholder="Plan description"
            />
          </div>

          {/* STRIPE IDs (Optional) */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Stripe Product ID</label>
              <Input
                name="stripe_product_id"
                value={formState.stripe_product_id}
                onChange={handleInputChange}
                placeholder="prod_..."
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Monthly Price ID</label>
              <Input
                name="stripe_monthly_price_id"
                value={formState.stripe_monthly_price_id}
                onChange={handleInputChange}
                placeholder="price_..."
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Annual Price ID</label>
              <Input
                name="stripe_annual_price_id"
                value={formState.stripe_annual_price_id}
                onChange={handleInputChange}
                placeholder="price_..."
              />
            </div>
          </div>

          {/* ICON */}
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
                  onChange={handleFileChange}
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
                  onClick={removeIcon}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
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
                    value={feature.feature}
                    onChange={(e) => updateFeature(index, 'feature', e.target.value)}
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
                checked={formState.is_popular}
                onCheckedChange={(checked) =>
                  setFormState((prev) => ({ ...prev, is_popular: checked }))
                }
              />
              <Label>Popular</Label>
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