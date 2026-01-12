"use client";
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Eye } from "lucide-react"
import { DataTable, DataTableColumn } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import useTaxOrganizers, { OrganizerStatus, TaxOrganizer } from "./_hooks/useOrgaziner"
import { taxYears } from "@/utils/static-data"
import { formatDate } from "@/utils/helper"

// Main Component
export default function TaxOrganizerForm() {
    const router = useRouter()
    const {
        organizers,
        pagination,
        organizersLoading,
        organizersError,
        setPage,
        limit,
        setLimit,
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        taxYearFilter,
        setTaxYearFilter,
        handleStatusChange,
    } = useTaxOrganizers("tax-organizers")

    const handleView = (organizer: TaxOrganizer) => {
        router.push(`/admin/organizer/${organizer.id}`)
    }

    const handleStatusUpdate = async (id: string, status: OrganizerStatus) => {
        try {
            await handleStatusChange(id, status)
        } catch (error) {
            console.error("Failed to update status:", error)
        }
    }

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            draft: "#6B7280",
            submitted: "#3B82F6",
            in_progress: "#F59E0B",
            completed: "#10B981",
            rejected: "#EF4444"
        }
        return colors[status] || "#6B7280"
    }


    const columns: DataTableColumn<TaxOrganizer>[] = [
        {
            key: "client_name",
            header: "Client Name",
            cell: (organizer) => (
                <div>
                    <div className="font-medium text-gray-900">{organizer.client_name}</div>
                    <div className="text-xs text-gray-500 capitalize">{organizer.return_type}</div>
                </div>
            ),
            sortable: false,
        },
        {
            key: "tax_year",
            header: "Tax Year",
            cell: (organizer) => organizer.tax_year,
            sortable: false,
        },
        {
            key: "Taxpayers",
            header: "Taxpayers",
            cell: (organizer) => (
                <div className="text-sm">
                    {organizer.Taxpayers?.map((tp) => (
                        <div key={tp.id} className="mb-1">
                            <div className="font-medium text-gray-900">
                                {tp.first_name} {tp.last_name}
                            </div>
                            <div className="text-xs text-gray-400">
                                {tp.taxpayer_type} • {tp.email}
                            </div>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            key: "status",
            header: "Status",
            cell: (organizer) => (
                <select
                    value={organizer.status}
                    onChange={(e) => handleStatusUpdate(organizer.id, e.target.value as OrganizerStatus)}
                    className="border rounded px-2 py-1 text-sm"
                    style={{
                        backgroundColor: getStatusColor(organizer.status) + "20",
                        borderColor: getStatusColor(organizer.status),
                        color: getStatusColor(organizer.status)
                    }}
                >
                    <option value="draft">Draft</option>
                    <option value="submitted">Submitted</option>
                    <option value="in_review">In Review</option>
                    <option value="completed">Completed</option>
                </select>
            ),
        },
        {
            key: "created_at",
            header: "Created",
            cell: (organizer) => formatDate(organizer.created_at),
            sortable: false,
        },
        {
            key: "submitted_at",
            header: "Submitted",
            cell: (organizer) => organizer.submitted_at ? formatDate(organizer.submitted_at) : "-",
            sortable: false,
        },
        {
            key: "actions",
            header: "Actions",
            cell: (organizer) => (
                <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleView(organizer)}>
                        <Eye className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ]

    return (
        <div className="container mx-auto py-2">
            <Card>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6  px-2">
                    <h1 className="text-xl font-semibold">Tax Organizers Management</h1>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or email..."
                                className="pl-9 w-full font-normal"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-3">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="flex-1 sm:flex-none py-1 px-2 border rounded"
                            >
                                <option value="all">All Status</option>
                                <option value="draft">Draft</option>
                                <option value="submitted">Submitted</option>
                                <option value="in_review">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>

                            <select
                                value={taxYearFilter}
                                onChange={(e) => setTaxYearFilter(e.target.value)}
                                className="flex-1 sm:flex-none py-1 px-2 border rounded"
                            >
                                <option key="all" value="all">All Years</option>
                                {
                                    taxYears.map((year) => (
                                        <option key={year.value} value={year.value}>{year.label}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                </div>

                <CardContent className="p-0">
                    <DataTable
                        data={organizers}
                        columns={columns}
                        isLoading={organizersLoading}
                        keyExtractor={(organizer) => organizer.id}
                        error={organizersError ? "Failed to load organizers. Please try again." : undefined}
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
            </Card>

        </div>
    )
}