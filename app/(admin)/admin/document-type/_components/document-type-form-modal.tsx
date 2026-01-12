"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import useDocumentTypes from "../_hooks/useDocumentTypes"

interface DocumentType {
  id: string
  name: string
  description: string
}

interface DocumentTypeFormModalProps {
  isOpen: boolean
  documentType: DocumentType | null
  onClose: () => void
}

export function DocumentTypeFormModal({
  isOpen,
  documentType,
  onClose,
}: DocumentTypeFormModalProps) {
  const {
    formState,
    handleInputChange,
    setFormState,
    createDocumentType,
    updateDocumentType,
    isLoading,
  } = useDocumentTypes(documentType ? "update" : "create", documentType?.id)

  useEffect(() => {
    if (isOpen) {
      if (documentType) {
        setFormState({
          name: documentType.name,
          description: documentType.description || "",
        } as any)
      } else {
        setFormState({
          name: "",
          description: "",
        } as any)
      }
    }
  }, [isOpen, documentType, setFormState])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (documentType) {
      await updateDocumentType()
    } else {
      await createDocumentType()
    }

    if (!isLoading) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:min-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{documentType ? "Edit Document Type" : "Add Document Type"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* NAME */}
          <div>
            <label className="text-sm font-medium block mb-1">Name *</label>
            <Input
              name="name"
              value={(formState as any).name || ""}
              onChange={handleInputChange}
              placeholder="e.g., W-2 Wage Statement, 1099-NEC"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-medium block mb-1">Description</label>
            <Textarea
              name="description"
              rows={3}
              value={(formState as any).description || ""}
              onChange={handleInputChange}
              placeholder="Detailed description for users"
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