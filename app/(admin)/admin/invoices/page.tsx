"use client";

import React, { useState } from 'react'
import { DollarSign, Eye, Download, CreditCard, Clock, CheckCircle, AlertCircle, XCircle, Search, Filter, Calendar, FileText, TrendingUp, TrendingDown } from 'lucide-react'
import { formatDate } from '@/utils/helper';
import useInvoices from '@/app/(client)/invoices/_hooks/useInvoices';
import { PaymentModal } from '@/app/(client)/invoices/_components/PaymentModal';
import { InvoiceDetailsModal } from '@/app/(client)/invoices/_components/InvoiceDetailsModal';

const InvoicesPage = () => {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<any>(null)

  const {
    invoices,
    stats,
    invoicesLoading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    selectedView,
    setSelectedView,
    page,
    setPage,
    pagination,
    handleInvoicePayment,
    handleInvoiceUpdate,
  } = useInvoices('invoices')

  const handleViewInvoice = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedInvoiceId(null)
  }

  const handlePayNow = (invoice: any) => {
    setSelectedInvoiceForPayment(invoice)
    setIsPaymentModalOpen(true)
  }

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false)
    setSelectedInvoiceForPayment(null)
  }

  const handlePaymentSubmit = async (paymentData: any) => {
    if (selectedInvoiceForPayment) {
      await handleInvoicePayment(selectedInvoiceForPayment.id, paymentData)
      handleClosePaymentModal()
    }
  }

  const handleStatusUpdate = async (invoiceId: string, newStatus: string) => {
    await handleInvoiceUpdate(invoiceId, {
      invoice_status: newStatus
    })
  }

  const statsConfig = [
    {
      label: 'Outstanding Balance',
      value: `$${stats.pendingAmount.toFixed(2)}`,
      icon: AlertCircle,
      color: 'red',
      change: stats.pendingInvoices > 0 ? `${stats.pendingInvoices} pending` : 'No pending',
      changeType: stats.pendingInvoices > 0 ? 'increase' : 'neutral'
    },
    {
      label: 'Paid This Year',
      value: `$${stats.paidAmount.toFixed(2)}`,
      icon: CheckCircle,
      color: 'green',
      change: `${stats.paidInvoices} paid`,
      changeType: 'increase'
    },
    {
      label: 'Total Invoices',
      value: stats.totalInvoices,
      icon: FileText,
      color: 'amber',
      change: stats.overdueInvoices > 0 ? `${stats.overdueInvoices} overdue` : 'All current',
      changeType: stats.overdueInvoices > 0 ? 'decrease' : 'neutral'
    },
  ]

  const getStatusConfig = (status: string) => {
    const configs = {
      paid: {
        color: 'bg-green-100 text-green-700',
        icon: CheckCircle,
        label: 'Paid',
        dotColor: 'bg-green-500'
      },
      pending: {
        color: 'bg-amber-100 text-amber-700',
        icon: Clock,
        label: 'Pending',
        dotColor: 'bg-amber-500'
      },
      overdue: {
        color: 'bg-red-100 text-red-700',
        icon: AlertCircle,
        label: 'Overdue',
        dotColor: 'bg-red-500'
      },
      viewed: {
        color: 'bg-blue-100 text-blue-700',
        icon: Eye,
        label: 'Viewed',
        dotColor: 'bg-blue-500'
      },
      cancelled: {
        color: 'bg-gray-100 text-gray-700',
        icon: XCircle,
        label: 'Cancelled',
        dotColor: 'bg-gray-500'
      },
    }
    return configs[status as keyof typeof configs] || configs.pending
  }


  const calculateDaysOverdue = (dueDate: string, status: string) => {
    if (status === 'paid') return 0
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = today.getTime() - due.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Invoices Management</h1>
            <p className="text-sm text-gray-600 mt-1">Manage and track your billing statements</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statsConfig.map((stat, i) => {
            const Icon = stat.icon
            const colorClasses: Record<string, string> = {
              red: 'bg-red-50 text-red-600',
              green: 'bg-green-50 text-green-600',
              amber: 'bg-amber-50 text-amber-600'
            }

            return (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-lg ${colorClasses[stat.color]} flex items-center justify-center`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  {stat.changeType === 'increase' ? (
                    <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {stat.change}
                    </span>
                  ) : stat.changeType === 'decrease' ? (
                    <span className="text-xs font-medium text-red-600 flex items-center gap-1">
                      <TrendingDown className="h-3 w-3" />
                      {stat.change}
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-gray-600">{stat.change}</span>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by invoice number or customer email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* View Tabs */}
            <div className="flex items-center gap-2">
              {['all', 'sent', 'paid'].map(view => (
                <button
                  key={view}
                  onClick={() => { setSelectedView(view as any); setStatusFilter(view) }}
                  className={`px-4 py-3 rounded-lg text-sm font-medium capitalize transition-colors ${selectedView === view
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {view}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="viewed">Viewed</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {invoicesLoading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading invoices...</p>
          </div>
        )}

        {/* Invoices List */}
        {!invoicesLoading && invoices.length > 0 && (
          <div className="space-y-3">
            {invoices.map((invoice) => {
              const statusConfig = getStatusConfig(invoice.invoice_status)
              const StatusIcon = statusConfig.icon
              const daysOverdue = calculateDaysOverdue(invoice.due_date, invoice.invoice_status)

              return (
                <div key={invoice.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Invoice Icon & Number */}
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg ${invoice.invoice_status === 'paid' ? 'bg-green-50' :
                          invoice.invoice_status === 'overdue' ? 'bg-red-50' : 'bg-amber-50'
                          } flex items-center justify-center flex-shrink-0`}>
                          <FileText className={`h-6 w-6 ${invoice.invoice_status === 'paid' ? 'text-green-600' :
                            invoice.invoice_status === 'overdue' ? 'text-red-600' : 'text-amber-600'
                            }`} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg">{invoice.invoice_number}</p>
                          <p className="text-sm text-gray-600">{invoice.booking?.service?.title || 'Service'}</p>
                        </div>
                      </div>

                      {/* Invoice Details */}
                      <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 mb-1">Customer</p>
                          <p className="font-medium text-gray-900">{invoice.booking?.customer_name || invoice.customer_email}</p>
                        </div>

                        <div>
                          <p className="text-gray-500 mb-1">Invoice Date</p>
                          <p className="font-medium text-gray-900">{formatDate(invoice.created_at)}</p>
                        </div>

                        <div>
                          <p className="text-gray-500 mb-1">Due Date</p>
                          <p className={`font-medium ${invoice.invoice_status === 'overdue' ? 'text-red-600' : 'text-gray-900'
                            }`}>
                            {formatDate(invoice.due_date)}
                          </p>
                        </div>
                      </div>

                      {/* Amount & Status */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-500 mb-1">Amount</p>
                          <p className="text-2xl font-bold text-gray-900">${Number(invoice.amount).toFixed(2)}</p>
                        </div>

                        <div className="h-12 w-px bg-gray-200"></div>

                        <div className="flex flex-col gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${statusConfig.color}`}>
                            <StatusIcon className="h-3.5 w-3.5" />
                            {statusConfig.label}
                          </span>
                          {daysOverdue > 0 && (
                            <span className="text-xs text-red-600 font-medium">
                              {daysOverdue} days overdue
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className={`w-2 h-2 rounded-full ${statusConfig.dotColor}`}></span>
                      <span className="font-medium capitalize">{invoice.payment_mode}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* {invoice.invoice_status !== 'paid' && invoice.invoice_status !== 'cancelled' && invoice.invoice_status !== 'sent' && (
                        <button
                          onClick={() => handlePayNow(invoice)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm inline-flex items-center gap-2"
                        >
                          <CreditCard className="h-4 w-4" />
                          Pay Now
                        </button>
                      )} */}

                      <button
                        onClick={() => handleViewInvoice(invoice.id)}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm inline-flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>

                      {/* <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm inline-flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        PDF
                      </button> */}
                      {/* In the Action Bar section, add before the View button */}
                      {invoice.invoice_status !== 'paid' && invoice.invoice_status !== 'cancelled' && (
                        <select
                          value={invoice.invoice_status}
                          onChange={(e) => handleStatusUpdate(invoice.id, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                        >
                          <option value="draft">Draft</option>
                          <option value="sent">Sent</option>
                          <option value="viewed">Viewed</option>
                          <option value="overdue">Overdue</option>
                          <option value="paid">Paid</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      )}

                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Empty State */}
        {!invoicesLoading && invoices.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No invoices found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearch('')
                setStatusFilter('all')
                setSelectedView('all')
              }}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {!invoicesLoading && pagination.pages > 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {((page - 1) * pagination.limit) + 1} to {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} invoices
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700">
                  Page {page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.pages}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invoice Details Modal */}
      <InvoiceDetailsModal
        isOpen={isModalOpen}
        invoiceId={selectedInvoiceId}
        onClose={handleCloseModal}
      />

      {/* payment modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        invoice={selectedInvoiceForPayment}
        onClose={handleClosePaymentModal}
        onSubmit={handlePaymentSubmit}
      />
    </div>
  )
}

export default InvoicesPage