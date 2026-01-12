import React, { useState } from 'react'
import { X, CreditCard, Building, Calendar, FileText, Upload, DollarSign, Receipt } from 'lucide-react'
import { type Booking } from '../_hooks/useBookings'

interface CreateInvoiceModalProps {
    isOpen: boolean
    booking: Booking | null
    onClose: () => void
    onSubmit: (invoiceData: any) => Promise<void>
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
    isOpen,
    booking,
    onClose,
    onSubmit
}) => {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        dueDays: 14,
        admin_notes: '',
        metadata: {
            payment_terms: 'Net 14',
            discount_applied: false,
            special_instructions: '',
            internal_reference: '',
            tax_exemption: false
        }
    })

    if (!isOpen || !booking) return null

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target

        if (name.startsWith('metadata.')) {
            const metadataKey = name.split('.')[1]
            setFormData(prev => ({
                ...prev,
                metadata: {
                    ...prev.metadata,
                    [metadataKey]: value
                }
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: name === 'dueDays' ? parseInt(value) || 0 : value
            }))
        }
    }

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target
        const metadataKey = name.split('.')[1]
        setFormData(prev => ({
            ...prev,
            metadata: {
                ...prev.metadata,
                [metadataKey]: checked
            }
        }))
    }

    const handleSubmit = async () => {
        if (!formData.admin_notes) {
            alert('Please add admin notes for the invoice')
            return
        }

        setLoading(true)
        try {
            await onSubmit({
                dueDays: formData.dueDays,
                customer_email: booking.customer_email,
                admin_notes: formData.admin_notes,
                metadata: formData.metadata
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                            <Receipt className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Create Invoice</h2>
                            <p className="text-blue-100 text-sm">Booking #{booking.booking_number}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                    {/* Booking Summary */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Invoice Amount</p>
                                <p className="text-3xl font-bold text-gray-900">${Number(booking.total_amount).toFixed(2)}</p>
                                <p className="text-xs text-gray-500 mt-1">{booking.currency}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600 mb-1">Customer</p>
                                <p className="font-medium text-gray-900">{booking.customer_name}</p>
                                <p className="text-xs text-gray-500 mt-1">{booking.customer_email}</p>
                            </div>
                        </div>
                        {booking.service && (
                            <div className="border-t border-blue-200 pt-3">
                                <p className="text-sm text-gray-600">Service</p>
                                <p className="font-medium text-gray-900">{booking.service.title}</p>
                            </div>
                        )}
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-5">
                        {/* Due Days */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Payment Due (Days) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="number"
                                    name="dueDays"
                                    value={formData.dueDays}
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="14"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Number of days from invoice creation until payment is due</p>
                        </div>

                        {/* Payment Terms */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Payment Terms
                            </label>
                            <input
                                type="text"
                                name="metadata.payment_terms"
                                value={formData.metadata.payment_terms}
                                onChange={handleChange}
                                placeholder="Net 14"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Admin Notes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Admin Notes <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <textarea
                                    name="admin_notes"
                                    value={formData.admin_notes}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Please make payment via bank transfer. Contact us for payment instructions."
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>
                        </div>

                        {/* Special Instructions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Special Instructions
                            </label>
                            <input
                                type="text"
                                name="metadata.special_instructions"
                                value={formData.metadata.special_instructions}
                                onChange={handleChange}
                                placeholder="Include booking reference in payment description"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Internal Reference */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Internal Reference
                            </label>
                            <input
                                type="text"
                                name="metadata.internal_reference"
                                value={formData.metadata.internal_reference}
                                onChange={handleChange}
                                placeholder="ADMIN-2024-001"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Checkboxes */}
                        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    name="metadata.discount_applied"
                                    checked={formData.metadata.discount_applied}
                                    onChange={handleCheckboxChange}
                                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Discount Applied</label>
                                    <p className="text-xs text-gray-500">Check if a discount has been applied to this invoice</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    name="metadata.tax_exemption"
                                    checked={formData.metadata.tax_exemption}
                                    onChange={handleCheckboxChange}
                                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Tax Exemption</label>
                                    <p className="text-xs text-gray-500">Check if this invoice is tax-exempt</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Creating...
                            </>
                        ) : (
                            <>
                                <Receipt className="h-4 w-4" />
                                Create Invoice
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}