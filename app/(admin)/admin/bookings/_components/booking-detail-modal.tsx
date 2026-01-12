"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

import { Separator } from "@/components/ui/separator"
import { useBookingDetails } from "@/api/booking"
import {
  Calendar, Clock, User, Mail, Phone, Building2,
  CreditCard, DollarSign, MapPin, Video, FileText,
  CheckCircle, XCircle, AlertCircle, Globe
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface ModalProps {
  isOpen: boolean
  bookingId: string | null
  onClose: () => void
}

export function BookingDetailsModal({
  isOpen,
  bookingId,
  onClose,
}: ModalProps) {
  const {
    data,
    isLoading,
    isError
  } = useBookingDetails(bookingId || "", isOpen && !!bookingId)

  const booking = data?.data

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", icon: any, label: string }> = {
      confirmed: { variant: "default", icon: CheckCircle, label: "Confirmed" },
      pending: { variant: "secondary", icon: AlertCircle, label: "Pending" },
      completed: { variant: "outline", icon: CheckCircle, label: "Completed" },
      cancelled: { variant: "destructive", icon: XCircle, label: "Cancelled" },
      in_progress: { variant: "default", icon: Clock, label: "In Progress" },
      refunded: { variant: "destructive", icon: XCircle, label: "Refunded" },
    }
    const config = configs[status] || configs.pending
    const Icon = config.icon
    return (
      <Badge variant={config.variant} className="gap-1.5">
        <Icon className="h-3.5 w-3.5" />
        {config.label}
      </Badge>
    )
  }

  const getPaymentBadge = (status: string) => {
    const configs: Record<string, { variant: "default" | "secondary" | "destructive", label: string }> = {
      paid: { variant: "default", label: "Paid" },
      pending: { variant: "secondary", label: "Pending" },
      refunded: { variant: "destructive", label: "Refunded" },
    }
    const config = configs[status] || configs.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />
      case 'phone': return <Phone className="h-4 w-4" />
      case 'in-person': return <MapPin className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Not scheduled'
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'Invalid date'
    }
  }

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return 'Not scheduled'
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

  const formatDateTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateStr
    }
  }

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="md:min-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <VisuallyHidden>
              <DialogTitle>Loading Booking Details</DialogTitle>
            </VisuallyHidden>
            <Skeleton className="h-6 w-48" />
          </DialogHeader>


          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>

            <Separator />

            {/* Info Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-full" />
                </div>
              ))}
            </div>

            <Separator />

            {/* Actions Skeleton */}
            <div className="flex justify-end gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (isError || !booking) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="md:min-w-3xl">
          <DialogHeader>
            <DialogTitle>Error Loading Booking</DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Failed to load booking details. Please try again.</p>
            <Button onClick={onClose} className="mt-4">Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:min-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{booking.service?.title || 'Service'}</h2>
              <p className="text-sm text-gray-600 font-mono mt-1">{booking.booking_number}</p>
            </div>
            <div className="flex gap-2">
              {getStatusBadge(booking.status)}
              {getPaymentBadge(booking.payment_status)}
            </div>
          </div>

          <Separator />

          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Customer Name</p>
                  <p className="font-medium text-gray-900">{booking.customer_name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <a href={`mailto:${booking.customer_email}`} className="font-medium text-blue-600 hover:underline">
                    {booking.customer_email}
                  </a>
                </div>
              </div>

              {booking.customer_phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <a href={`tel:${booking.customer_phone}`} className="font-medium text-blue-600 hover:underline">
                      {booking.customer_phone}
                    </a>
                  </div>
                </div>
              )}

              {booking.customer_company && (
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Company</p>
                    <p className="font-medium text-gray-900">{booking.customer_company}</p>
                  </div>
                </div>
              )}

              {booking.guest_email && (
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Guest Email</p>
                    <p className="font-medium text-gray-900">{booking.guest_email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Booking Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Scheduled Date</p>
                  <p className="font-medium text-gray-900">{formatDate(booking.scheduled_date)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Scheduled Time</p>
                  <p className="font-medium text-gray-900">
                    {formatTime(booking.scheduled_time)}
                    {booking.duration && <span className="text-gray-500 ml-2">({booking.duration} min)</span>}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                {getTypeIcon(booking.booking_type)}
                <div>
                  <p className="text-sm text-gray-600">Booking Type</p>
                  <p className="font-medium text-gray-900 capitalize">{booking.booking_type?.replace('_', ' ')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Timezone</p>
                  <p className="font-medium text-gray-900">{booking.timezone}</p>
                </div>
              </div>

              {booking.confirmation_code && (
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Confirmation Code</p>
                    <p className="font-medium text-gray-900 font-mono">{booking.confirmation_code}</p>
                  </div>
                </div>
              )}

              {booking.referral_source && (
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Referral Source</p>
                    <p className="font-medium text-gray-900">{booking.referral_source}</p>
                  </div>
                </div>
              )}
            </div>

            {booking.google_meet_link && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Video className="h-5 w-5 text-blue-600" />
                  <p className="font-medium text-gray-900">Google Meet Link</p>
                </div>
                <a
                  href={booking.google_meet_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {booking.google_meet_link}
                </a>
              </div>
            )}
          </div>

          <Separator />

          {/* Payment Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-medium text-gray-900">${Number(booking.amount).toFixed(2)}</p>
                </div>
              </div>

              {Number(booking.tax_amount) > 0 && (
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Tax</p>
                    <p className="font-medium text-gray-900">${Number(booking.tax_amount).toFixed(2)}</p>
                  </div>
                </div>
              )}

              {Number(booking.discount_amount) > 0 && (
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Discount</p>
                    <p className="font-medium text-green-600">-${Number(booking.discount_amount).toFixed(2)}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-bold text-gray-900 text-lg">${Number(booking.total_amount).toFixed(2)} {booking.currency}</p>
                </div>
              </div>

              {booking.paid_at && (
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Paid At</p>
                    <p className="font-medium text-gray-900">{formatDateTime(booking.paid_at)}</p>
                  </div>
                </div>
              )}

              {booking.stripe_payment_intent_id && (
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Payment Intent ID</p>
                    <p className="font-medium text-gray-900 font-mono text-xs">{booking.stripe_payment_intent_id}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description & Notes */}
          {(booking.description || booking.notes) && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                {booking.description && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Description</p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{booking.description}</p>
                  </div>
                )}
                {booking.notes && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Notes</p>
                    <p className="text-gray-900 bg-yellow-50 p-3 rounded-lg border border-yellow-200">{booking.notes}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Metadata */}
          {booking.metadata && Object.keys(booking.metadata).length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm text-gray-900 whitespace-pre-wrap">
                    {JSON.stringify(booking.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p className="font-medium">Created At</p>
              <p>{formatDateTime(booking.created_at)}</p>
            </div>
            <div>
              <p className="font-medium">Updated At</p>
              <p>{formatDateTime(booking.updated_at)}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}