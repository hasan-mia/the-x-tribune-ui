"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Edit, Search, Plus } from "lucide-react"
import { DataTable, DataTableColumn } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import usePricing from "./_hooks/usePricing"
import { PricingFormModal } from "./_components/pricing-form-modal"
import { formatDate } from "@/utils/helper"
import ConfirmDeleteModal from "@/components/shared/confirm-modal"

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
  created_at: string
  features?: any[]
}

export default function AdminPricingPage() {
  const {
    listData,
    listLoading,
    listError,
    onDeletePricingPlan,
    search,
    setSearch,
    limit,
    setPage,
    setLimit,
  } = usePricing("pricing")

  const [showModal, setShowModal] = useState(false)
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)

  const handleAdd = () => {
    setEditingPlan(null)
    setShowModal(true)
  }

  const handleEdit = (plan: PricingPlan) => {
    setEditingPlan(plan)
    setShowModal(true)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const columns: DataTableColumn<PricingPlan>[] = [
    {
      key: "icon",
      header: "Icon",
      cell: (plan) => (
        <div className="flex items-center">
          {plan.icon ? (
            <img
              src={plan.icon}
              alt={plan.name}
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
      key: "name",
      header: "Plan Name",
      cell: (plan) => (
        <div>
          <div className="font-medium">{plan.name}</div>
          <div className="text-xs text-gray-500 truncate max-w-xs">{plan.slug}</div>
        </div>
      ),
      sortable: false,
    },
    {
      key: "monthly_price",
      header: "Monthly",
      cell: (plan) => (
        <span className="font-medium">
          ${plan.monthly_price}
        </span>
      ),
      sortable: false,
    },
    {
      key: "annual_price",
      header: "Annual",
      cell: (plan) => (
        <span className="font-medium">
          ${plan.annual_price}
        </span>
      ),
      sortable: false,
    },
    {
      key: "trial_days",
      header: "Trial",
      cell: (plan) => (
        plan.trial_days > 0 ? (
          <span className="text-sm text-green-600">{plan.trial_days} days</span>
        ) : (
          <span className="text-gray-400">—</span>
        )
      ),
      sortable: false,
    },
    {
      key: "features",
      header: "Features",
      cell: (plan) => (
        <span className="text-sm text-gray-600">
          {plan.features?.length || 0} features
        </span>
      ),
      sortable: false,
    },
    {
      key: "is_active",
      header: "Status",
      cell: (plan) => (
        <span className={`px-2 py-1 rounded-full text-xs ${plan.is_active
          ? 'bg-green-100 text-green-800'
          : 'bg-gray-100 text-gray-800'
          }`}>
          {plan.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
      sortable: false,
    },
    {
      key: "is_popular",
      header: "Popular",
      cell: (plan) => (
        plan.is_popular ? (
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
      cell: (plan) => (
        <span className="text-sm">{plan.sort_order}</span>
      ),
      sortable: false,
    },
    {
      key: "created_at",
      header: "Created",
      cell: (plan) => (
        <span className="text-sm">{formatDate(plan.created_at)}</span>
      ),
      sortable: false,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (plan) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(plan)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedPlanId(plan.id)
              setShowDeleteModal(true)
            }}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ]

  const plans = listData?.data || []
  const pagination = listData?.pagination

  return (
    <div className="container mx-auto py-2">
      <Card>
        <div className="p-4">
          <div className="flex justify-between mb-6">
            <h1 className="text-xl font-semibold">Pricing Plans Management</h1>

            <div className="flex gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search plans..."
                  className="pl-9 w-full font-normal"
                  value={search}
                  onChange={handleSearch}
                />
              </div>

              <Button className="gap-2 bg-green-600 text-white" onClick={handleAdd}>
                <Plus className="h-4 w-4" />
                Add Plan
              </Button>
            </div>
          </div>

          <CardContent className="p-0">
            <DataTable
              data={plans}
              columns={columns}
              isLoading={listLoading}
              keyExtractor={(plan) => plan.id}
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

      <PricingFormModal
        isOpen={showModal}
        plan={editingPlan}
        onClose={() => {
          setShowModal(false)
          setEditingPlan(null)
        }}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        isLoading={false}
        title="Delete Pricing Plan?"
        description="Are you sure you want to delete this pricing plan? This action cannot be undone."
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedPlanId(null)
        }}
        onConfirm={() => {
          if (selectedPlanId) {
            onDeletePricingPlan(selectedPlanId)
            setShowDeleteModal(false)
          }
        }}
      />
    </div>
  )
}