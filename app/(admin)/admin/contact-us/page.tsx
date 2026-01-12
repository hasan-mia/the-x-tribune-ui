"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Search, Mail, Eye, MessageSquare } from "lucide-react"
import { DataTable, DataTableColumn } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import useContactUs from "./_hooks/useContactUs"
import { formatDate } from "@/utils/helper"
import ConfirmDeleteModal from "@/components/shared/confirm-modal"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ContactUs {
  id: string
  name: string
  email: string
  phone: string
  company: string | null
  subject: string
  message: string
  status: "new" | "read" | "replied" | "archived"
  replied_at: string | null
  replied_by: string | null
  ip_address: string
  created_at: string
  updated_at: string
  repliedByUser: {
    id: string
    first_name: string
    last_name: string
    email: string
  } | null
}

export default function AdminContactPage() {
  const {
    listData,
    listLoading,
    listError,
    onDeleteContact,
    handleStatusChange,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    limit,
    setPage,
    setLimit,
  } = useContactUs("contact-us")

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState<ContactUs | null>(null)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleViewDetails = (contact: ContactUs) => {
    setSelectedContact(contact)
    setShowDetailModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-700"
      case "in_progress":
        return "bg-yellow-100 text-yellow-700"
      case "resolved":
        return "bg-green-100 text-green-700"
      case "archived":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const columns: DataTableColumn<ContactUs>[] = [
    {
      key: "name",
      header: "Contact Info",
      cell: (contact) => (
        <div className="max-w-xs">
          <div className="font-medium">{contact.name}</div>
          <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
            <Mail className="h-3 w-3" />
            {contact.email}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "phone",
      header: "Phone",
      cell: (contact) => contact.phone || "N/A",
    },
    {
      key: "company",
      header: "Company",
      cell: (contact) => contact.company || "N/A",
    },
    {
      key: "subject",
      header: "Subject",
      cell: (contact) => (
        <div className="max-w-xs truncate" title={contact.subject}>
          {contact.subject}
        </div>
      ),
    },
    {
      key: "message",
      header: "Message",
      cell: (contact) => (
        <div className="max-w-xs truncate" title={contact.message}>
          {contact.message}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (contact) => (
        <select
          value={contact.status}
          onChange={(e) => handleStatusChange(contact.id, e.target.value as any)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>
      ),
    },
    {
      key: "replied_by",
      header: "Replied By",
      cell: (contact) => (
        contact.repliedByUser ? (
          <div className="text-xs">
            <div className="font-medium">
              {contact.repliedByUser.first_name} {contact.repliedByUser.last_name}
            </div>
            <div className="text-muted-foreground">
              {formatDate(contact.replied_at!)}
            </div>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Not replied</span>
        )
      ),
    },
    {
      key: "created_at",
      header: "Received",
      cell: (contact) => formatDate(contact.created_at),
      sortable: true,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (contact) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleViewDetails(contact)}
            title="View Details"
          >
            <Eye className="h-4 w-4 text-blue-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedContactId(contact.id)
              setShowDeleteModal(true)
            }}
            title="Delete"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ]

  const contactMessages = listData?.contactUs || []
  const pagination = listData?.pagination

  return (
    <div className="container mx-auto py-2">
      <Card>
        <div className="p-4">
          <div className="flex justify-between mb-6">
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Contact Messages
            </h1>

            <div className="flex gap-3">

              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  className="pl-9 w-full font-normal"
                  value={search}
                  onChange={handleSearch}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>

            </div>
          </div>

          <CardContent className="p-0">
            <DataTable
              data={contactMessages}
              columns={columns}
              isLoading={listLoading}
              keyExtractor={(contact) => contact.id}
              error={listError ? "Failed to load... Please try again." : undefined}
              searchQuery={search}
              pagination={{
                pageSize: limit,
                total: pagination?.total,
                pageSizeOptions: [10, 20, 50, 100],
                showSizeChanger: true,
                serverSide: true,
                position: "bottom",
                onPageChange: setPage,
                onPageSizeChange: setLimit,
              }}
              selectable={false}
              searchable={false}
              showColumnFilters={false}
              className="shadow-sm"
              expandable={false}
            />
          </CardContent>
        </div>
      </Card>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Message Details</DialogTitle>
            <DialogDescription>
              Received on {selectedContact && formatDate(selectedContact.created_at)}
            </DialogDescription>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-sm text-gray-900">{selectedContact.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedContact.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-sm text-gray-900">{selectedContact.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Company</label>
                  <p className="text-sm text-gray-900">{selectedContact.company || "N/A"}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Subject</label>
                <p className="text-sm text-gray-900">{selectedContact.subject}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Message</label>
                <p className="text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-3 rounded-md">
                  {selectedContact.message}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <p className={`text-sm inline-block px-2 py-1 rounded ${getStatusColor(selectedContact.status)}`}>
                    {selectedContact.status.replace("_", " ").toUpperCase()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">IP Address</label>
                  <p className="text-sm text-gray-900">{selectedContact.ip_address}</p>
                </div>
              </div>

              {selectedContact.repliedByUser && (
                <div className="bg-green-50 p-3 rounded-md">
                  <label className="text-sm font-medium text-gray-700">Replied By</label>
                  <p className="text-sm text-gray-900">
                    {selectedContact.repliedByUser.first_name} {selectedContact.repliedByUser.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedContact.repliedByUser.email} • {formatDate(selectedContact.replied_at!)}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        isLoading={false}
        title="Delete Contact Message?"
        description="Are you sure you want to delete this contact message? This action cannot be undone."
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedContactId(null)
        }}
        onConfirm={() => {
          if (selectedContactId) {
            onDeleteContact(selectedContactId)
            setShowDeleteModal(false)
          }
        }}
      />
    </div>
  )
}