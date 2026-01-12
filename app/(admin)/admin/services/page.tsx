"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Edit, Search, Plus } from "lucide-react"
import { DataTable, DataTableColumn } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import useServices from "./_hooks/useServices"
import { ServiceFormModal } from "./_components/service-form-modal"
import { formatDate } from "@/utils/helper"
import ConfirmDeleteModal from "@/components/shared/confirm-modal"

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
  created_at: string
  updated_at: string
  features?: any[]
}

export default function AdminServicesPage() {
  const {
    listData,
    listLoading,
    listError,
    onDeleteService,
    search,
    setSearch,
    limit,
    setPage,
    setLimit,
    serviceTypeFilter,
    handleTypeFilter,
  } = useServices("services")

  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)

  const handleAdd = () => {
    setEditingService(null)
    setShowModal(true)
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setShowModal(true)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const columns: DataTableColumn<Service>[] = [
    {
      key: "icon",
      header: "Icon",
      cell: (service) => (
        <div className="flex items-center">
          {service.icon ? (
            <img
              src={service.icon}
              alt={service.title}
              className="w-10 h-10 object-cover rounded"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
              No Icon
            </div>
          )}
        </div>
      ),
      sortable: false,
    },
    {
      key: "title",
      header: "Service",
      cell: (service) => (
        <div>
          <div className="font-medium">{service.title}</div>
          <div className="text-xs text-gray-500 truncate max-w-xs">{service.slug}</div>
        </div>
      ),
      sortable: false,
    },
    {
      key: "service_type",
      header: "Type",
      cell: (service) => (
        <span className="text-sm capitalize px-2 py-1 rounded-full bg-blue-100 text-blue-800">
          {service.service_type.replace(/_/g, ' ')}
        </span>
      ),
      sortable: false,
    },
    {
      key: "price",
      header: "Price",
      cell: (service) => (
        <span className="font-medium">
          {service?.currency} {service?.price}
        </span>
      ),
      sortable: false,
    },
    {
      key: "scheduling",
      header: "Scheduling",
      cell: (service) => (
        service.requires_scheduling ? (
          <div className="text-sm">
            <span className="text-green-600">✓</span> {service.duration} min
          </div>
        ) : (
          <span className="text-gray-400">—</span>
        )
      ),
      sortable: false,
    },
    {
      key: "features",
      header: "Features",
      cell: (service) => (
        <span className="text-sm text-gray-600">
          {service.features?.length || 0} features
        </span>
      ),
      sortable: false,
    },
    {
      key: "is_active",
      header: "Status",
      cell: (service) => (
        <span className={`px-2 py-1 rounded-full text-xs ${service.is_active
          ? 'bg-green-100 text-green-800'
          : 'bg-gray-100 text-gray-800'
          }`}>
          {service.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
      sortable: false,
    },
    {
      key: "is_featured",
      header: "Featured",
      cell: (service) => (
        service.is_featured ? (
          <span className="text-yellow-600 text-lg">★</span>
        ) : (
          <span className="text-gray-300 text-lg">☆</span>
        )
      ),
      sortable: false,
    },
    {
      key: "sort_order",
      header: "Order",
      cell: (service) => (
        <span className="text-sm">{service.sort_order}</span>
      ),
      sortable: false,
    },
    {
      key: "created_at",
      header: "Created",
      cell: (service) => (
        <span className="text-sm">{formatDate(service.created_at)}</span>
      ),
      sortable: false,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (service) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(service)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedServiceId(service.id)
              setShowDeleteModal(true)
            }}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ]

  const services = listData?.data?.services || []
  const pagination = listData?.data?.pagination

  console.log(listData?.data)

  return (
    <div className="container mx-auto py-2">
      <Card>
        <div className="p-4">
          <div className="flex justify-between mb-6">
            <h1 className="text-xl font-semibold">Service Management</h1>

            <div className="flex gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search services..."
                  className="pl-9 w-full font-normal"
                  value={search}
                  onChange={handleSearch}
                />
              </div>

              <Select value={serviceTypeFilter} onValueChange={handleTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Service</SelectItem>
                  <SelectItem value="free_consultation">Free Consultation</SelectItem>
                  <SelectItem value="paid_service">Paid Service</SelectItem>
                  <SelectItem value="subscription">Subscription</SelectItem>
                </SelectContent>
              </Select>


              <Button className="gap-2 bg-green-600 text-white" onClick={handleAdd}>
                <Plus className="h-4 w-4" />
                Add Service
              </Button>
            </div>
          </div>

          <CardContent className="p-0">
            <DataTable
              data={services}
              columns={columns}
              isLoading={listLoading}
              keyExtractor={(service) => service.id}
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

      <ServiceFormModal
        isOpen={showModal}
        service={editingService}
        onClose={() => {
          setShowModal(false)
          setEditingService(null)
        }}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        isLoading={false}
        title="Delete Service?"
        description="Are you sure you want to delete this service? This action cannot be undone."
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedServiceId(null)
        }}
        onConfirm={() => {
          if (selectedServiceId) {
            onDeleteService(selectedServiceId)
            setShowDeleteModal(false)
          }
        }}
      />
    </div>
  )
}