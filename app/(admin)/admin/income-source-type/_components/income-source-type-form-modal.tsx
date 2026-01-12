"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import useIncomeSourceTypes from "../_hooks/useIncomeSourceTypes"

interface IncomeSourceType {
  id: string
  name: string
}

interface IncomeSourceTypeFormModalProps {
  isOpen: boolean
  incomeSourceType: IncomeSourceType | null
  onClose: () => void
}

export function IncomeSourceTypeFormModal({
  isOpen,
  incomeSourceType,
  onClose,
}: IncomeSourceTypeFormModalProps) {
  const {
    formState,
    handleInputChange,
    setFormState,
    createIncomeSourceType,
    updateIncomeSourceType,
    isLoading,
  } = useIncomeSourceTypes(incomeSourceType ? "update" : "create", incomeSourceType?.id)

  useEffect(() => {
    if (isOpen) {
      if (incomeSourceType) {
        setFormState({
          name: incomeSourceType.name,
        } as any)
      } else {
        setFormState({
          name: "",
        } as any)
      }
    }
  }, [isOpen, incomeSourceType, setFormState])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (incomeSourceType) {
      await updateIncomeSourceType()
    } else {
      await createIncomeSourceType()
    }

    if (!isLoading) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:min-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{incomeSourceType ? "Edit Income Source Type" : "Add Income Source Type"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* NAME */}
          <div>
            <label className="text-sm font-medium block mb-1">Name *</label>
            <Input
              name="name"
              value={(formState as any).name || ""}
              onChange={handleInputChange}
              placeholder="e.g., W-2 Wages, 1099-NEC, Self-Employment"
              required
            />
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