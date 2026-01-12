"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import useCategories from "../_hooks/useCategories"

interface Category {
  id: string
  name: string
  description: string
  color: string
  is_active: boolean
  slug: string
}

interface CategoryFormModalProps {
  isOpen: boolean
  category: Category | null
  onClose: () => void
}

export function CategoryFormModal({
  isOpen,
  category,
  onClose,
}: CategoryFormModalProps) {
  const {
    formState,
    handleInputChange,
    setFormState,
    createCategory,
    updateCategory,
    isLoading,
  } = useCategories(category ? "update" : "create", category?.id)

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setFormState({
          name: category.name,
          description: category.description,
          color: category.color || "#3B82F6",
          is_active: category.is_active ?? true,
        } as any)
      } else {
        setFormState({
          name: "",
          description: "",
          color: "#3B82F6",
          is_active: true,
        } as any)
      }
    }
  }, [isOpen, category, setFormState])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (category) {
      await updateCategory()
    } else {
      await createCategory()
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

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev: any) => ({
      ...prev,
      color: e.target.value,
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:min-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "Add Category"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* NAME */}
          <div>
            <label className="text-sm font-medium block mb-1">Name *</label>
            <Input
              name="name"
              value={(formState as any).name || ""}
              onChange={handleInputChange}
              placeholder="Enter category name"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-medium block mb-1">Description *</label>
            <Textarea
              name="description"
              rows={3}
              value={(formState as any).description || ""}
              onChange={handleInputChange}
              placeholder="Enter category description"
              required
            />
          </div>

          {/* COLOR */}
          <div>
            <label className="text-sm font-medium block mb-1">Color</label>
            <Input
              type="color"
              name="color"
              value={(formState as any).color || "#3B82F6"}
              onChange={handleColorChange}
              className="h-10 w-20"
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
              disabled={isLoading}
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