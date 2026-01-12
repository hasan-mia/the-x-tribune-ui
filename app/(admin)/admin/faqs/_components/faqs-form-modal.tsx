"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useFaqs from "../_hooks/useFaqs"

interface Faq {
  id: string
  question: string
  answer: string
  category: string
  is_active: boolean
  sort_order: number
}

interface FaqFormModalProps {
  isOpen: boolean
  faq: Faq | null
  onClose: () => void
}

export function FaqFormModal({
  isOpen,
  faq,
  onClose,
}: FaqFormModalProps) {
  const {
    formState,
    handleInputChange,
    setFormState,
    createFaq,
    updateFaq,
    isLoading,
  } = useFaqs(faq ? "update" : "create", faq?.id)

  useEffect(() => {
    if (isOpen) {
      if (faq) {
        setFormState({
          question: faq.question,
          answer: faq.answer,
          category: faq.category || "services",
          is_active: faq.is_active ?? true,
          sort_order: faq.sort_order || 1,
        } as any)
      } else {
        setFormState({
          question: "",
          answer: "",
          category: "services",
          is_active: true,
          sort_order: 1,
        } as any)
      }
    }
  }, [isOpen, faq, setFormState])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (faq) {
      await updateFaq()
    } else {
      await createFaq()
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

  const handleCategoryChange = (value: string) => {
    setFormState((prev: any) => ({
      ...prev,
      category: value,
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:min-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{faq ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* QUESTION */}
          <div>
            <label className="text-sm font-medium block mb-1">Question *</label>
            <Input
              name="question"
              value={(formState as any).question || ""}
              onChange={handleInputChange}
              placeholder="Enter FAQ question"
              required
            />
          </div>

          {/* ANSWER */}
          <div>
            <label className="text-sm font-medium block mb-1">Answer *</label>
            <Textarea
              name="answer"
              rows={4}
              value={(formState as any).answer || ""}
              onChange={handleInputChange}
              placeholder="Enter FAQ answer"
              required
            />
          </div>

          <div className="flex justify-between">
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


            {/* CATEGORY */}
            <div className="bg-white">
              <label className="text-sm font-medium block mb-1">Category *</label>
              <Select
                value={(formState as any).category || "services"}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="pricing">Pricing</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

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