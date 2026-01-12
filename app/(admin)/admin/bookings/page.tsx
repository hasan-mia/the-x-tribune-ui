"use client";

import React, { useState } from 'react'
import { Calendar, Clock, User, Video, Search, Phone, Mail, CheckCircle, XCircle, AlertCircle, MapPin, Plus, DollarSign, CreditCard } from 'lucide-react'
import useBookings, { type Booking, type BookingStatus } from './_hooks/useBookings';
import { BookingDetailsModal } from './_components/booking-detail-modal';
import { CreateInvoiceModal } from './_components/create-invoice-modal';

const AdminBookingPage = () => {
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState<Booking | null>(null)

  const handleViewDetails = (bookingId: string) => {
    setSelectedBookingId(bookingId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedBookingId(null)
  }

  const handleOpenInvoiceModal = (booking: Booking) => {
    setSelectedBookingForInvoice(booking)
    setIsInvoiceModalOpen(true)
  }

  const handleCloseInvoiceModal = () => {
    setIsInvoiceModalOpen(false)
    setSelectedBookingForInvoice(null)
  }

  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    selectedView,
    setSelectedView,
    bookings,
    stats,
    pagination,
    bookingsLoading,
    handleStatusChange,
    page,
    setPage,
    handleInvoiceCreate,
  } = useBookings('bookings')

  const handleInvoiceSubmit = async (invoiceData: any) => {
    if (!selectedBookingForInvoice) return

    await handleInvoiceCreate(selectedBookingForInvoice.id, invoiceData)
    handleCloseInvoiceModal()
  }

  const statsCards = [
    { label: 'Total Bookings', value: stats.total_bookings || 0, color: 'blue' as const, icon: Calendar },
    { label: 'Upcoming', value: stats.upcoming_bookings || 0, color: 'purple' as const, icon: Clock },
    { label: 'Completed', value: stats.completed_bookings || 0, color: 'green' as const, icon: CheckCircle },
    { label: 'Total Revenue', value: `$${Number(stats.total_revenue || 0).toFixed(2)}`, color: 'indigo' as const, icon: DollarSign },
  ]

  const getStatusBadge = (status: BookingStatus) => {
    const configs = {
      confirmed: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle, label: 'Confirmed' },
      pending: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: AlertCircle, label: 'Pending' },
      completed: { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: CheckCircle, label: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle, label: 'Cancelled' },
      in_progress: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock, label: 'In Progress' },
      refunded: { color: 'bg-orange-100 text-orange-700 border-orange-200', icon: XCircle, label: 'Refunded' },
    }
    const config = configs[status] || configs.pending
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon className="h-3.5 w-3.5" />
        {config.label}
      </span>
    )
  }

  const getPaymentBadge = (paymentStatus: string) => {
    const configs = {
      paid: { color: 'bg-green-100 text-green-700 border-green-200', label: 'Paid' },
      pending: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: 'Pending' },
      refunded: { color: 'bg-red-100 text-red-700 border-red-200', label: 'Refunded' },
    }
    const config = configs[paymentStatus as keyof typeof configs] || configs.pending
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4 text-blue-600" />
      case 'phone': return <Phone className="h-4 w-4 text-green-600" />
      case 'in-person': return <MapPin className="h-4 w-4 text-purple-600" />
      case 'service': return <Calendar className="h-4 w-4 text-gray-600" />
      default: return <Calendar className="h-4 w-4 text-gray-600" />
    }
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Not scheduled'
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch {
      return 'Invalid date'
    }
  }

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return ''
    try {
      const [hours, minutes] = timeStr.split(':')
      const hour = parseInt(hours)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour % 12 || 12
      return `${displayHour}:${minutes} ${ampm}`
    } catch {
      return 'Invalid time'
    }
  }

  const handleStatusChangeWrapper = async (bookingId: string, newStatus: string) => {
    await handleStatusChange(bookingId, newStatus as BookingStatus)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bookings Management</h1>
            <p className="text-sm text-gray-600 mt-1">Manage and track all appointments</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, i) => {
            const colorClasses = {
              blue: 'bg-blue-50 text-blue-600',
              green: 'bg-green-50 text-green-600',
              purple: 'bg-purple-50 text-purple-600',
              indigo: 'bg-indigo-50 text-indigo-600'
            }

            const Icon = stat.icon

            return (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${colorClasses[stat.color]} flex items-center justify-center`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
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
                placeholder="Search by name, email, booking number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* View Tabs */}
            <div className="flex items-center gap-2">
              {(['all', 'upcoming', 'past'] as const).map(view => (
                <button
                  key={view}
                  onClick={() => setSelectedView(view)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${selectedView === view
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
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {bookingsLoading && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Loading bookings...</p>
          </div>
        )}

        {/* Bookings List */}
        {!bookingsLoading && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((booking: Booking) => (
              <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${booking.status === 'completed' || booking.status === 'cancelled'
                      ? 'bg-gray-100'
                      : 'bg-blue-50'
                      }`}>
                      <Calendar className={`h-7 w-7 ${booking.status === 'completed' || booking.status === 'cancelled'
                        ? 'text-green-600'
                        : 'text-blue-600'
                        }`} />
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{booking.service?.title || 'Service'}</h3>
                          <p className="text-sm text-gray-600">{booking.customer_name}</p>
                          <p className="text-xs text-gray-500 font-mono mt-1">{booking.booking_number}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(booking.status)}
                          {getPaymentBadge(booking.payment_status)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{formatDate(booking.scheduled_date)}</span>
                          {booking.scheduled_time && (
                            <>
                              <span>at {formatTime(booking.scheduled_time)}</span>
                              {booking.duration && <span className="text-gray-400">({booking.duration} min)</span>}
                            </>
                          )}
                        </div>

                        {booking.user && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span>{booking.user.first_name} {booking.user.last_name}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          {getTypeIcon(booking.booking_type)}
                          <span className="capitalize">{booking.booking_type?.replace('_', ' ')}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span className="font-semibold text-gray-900">${Number(booking.total_amount).toFixed(2)}</span>
                          <span className="text-gray-400">({booking.currency})</span>
                        </div>

                        {booking.notes && (
                          <div className="sm:col-span-2 text-gray-500 italic text-xs">
                            Note: {booking.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2 flex-shrink-0">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChangeWrapper(booking.id, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refunded">Refunded</option>
                      </select>

                      <button
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm whitespace-nowrap"
                        onClick={() => handleViewDetails(booking?.id)}
                      >
                        View Details
                      </button>

                      {
                        booking.status === "pending" &&
                        !["succeeded", "processing"].includes(booking.payment_status) && (
                          <button
                            onClick={() => handleOpenInvoiceModal(booking)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm inline-flex items-center gap-2"
                          >
                            <CreditCard className="h-4 w-4" />
                            Create Invoice
                          </button>
                        )
                      }


                    </div>
                  </div>
                </div>

                {/* Contact Info Footer */}
                {(booking.status === 'confirmed' || booking.status === 'pending') && (
                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className="text-gray-600 font-medium">Customer Contact:</span>
                      <a href={`mailto:${booking.customer_email}`} className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700">
                        <Mail className="h-4 w-4" />
                        {booking.customer_email}
                      </a>
                      {booking.customer_phone && (
                        <a href={`tel:${booking.customer_phone}`} className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700">
                          <Phone className="h-4 w-4" />
                          {booking.customer_phone}
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!bookingsLoading && bookings.length > 0 && pagination.pages > 1 && (
          <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-600">
              Showing {((page - 1) * pagination.limit) + 1} to {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                disabled={page === pagination.pages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!bookingsLoading && bookings.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">
              {search || statusFilter !== 'all' || selectedView !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first booking'}
            </p>
            <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Create First Booking
            </button>
          </div>
        )}
      </div>

      <BookingDetailsModal
        isOpen={isModalOpen}
        bookingId={selectedBookingId}
        onClose={handleCloseModal}
      />

      <CreateInvoiceModal
        isOpen={isInvoiceModalOpen}
        booking={selectedBookingForInvoice}
        onClose={handleCloseInvoiceModal}
        onSubmit={handleInvoiceSubmit}
      />
    </div>
  )
}

export default AdminBookingPage