"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import useReturnTypes from "../_hooks/useReturnTypes"

interface ReturnType {
  id: string
  name: string
}

interface ReturnTypeFormModalProps {
  isOpen: boolean
  returnType: ReturnType | null
  onClose: () => void
}

export function ReturnTypeFormModal({
  isOpen,
  returnType,
  onClose,
}: ReturnTypeFormModalProps) {
  const {
    formState,
    handleInputChange,
    setFormState,
    createDocumentType,
    updateDocumentType,
    isLoading,
  } = useReturnTypes(returnType ? "update" : "create", returnType?.id)

  useEffect(() => {
    if (isOpen) {
      if (returnType) {
        setFormState({
          name: returnType.name,
        })
      } else {
        setFormState({
          name: "",
        })
      }
    }
  }, [isOpen, returnType, setFormState])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (returnType) {
      await updateDocumentType()
      onClose()
    } else {
      await createDocumentType()
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:min-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{returnType ? "Edit Return Type" : "Add Return Type"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* NAME */}
          <div>
            <label className="text-sm font-medium block mb-1">Name *</label>
            <Input
              name="name"
              value={formState.name}
              onChange={handleInputChange}
              placeholder="e.g., Standard Return, Exchange"
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