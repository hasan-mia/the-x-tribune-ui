import React from "react"
import Link from 'next/link'
import { FileText, Scale, AlertTriangle, CheckCircle, XCircle, DollarSign } from 'lucide-react'

export default function TermsAndConditions() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Hero Section */}
            <div className="relative py-20 px-4 bg-gradient-to-br from-primary via-primary to-blue-700 text-primary-foreground overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Scale className="h-12 w-12 text-blue-400" />
                        <h1 className="text-4xl md:text-5xl font-bold">Terms of Service</h1>
                    </div>
                    <p className="text-slate-300 text-lg">
                        Last Updated: December 22, 2025
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">

                    {/* Introduction */}
                    <section className="mb-12">
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Welcome to Beyond Tax Consultants. These Terms of Service (Terms&quot;) govern your use of our website and services. By accessing our website or engaging our services, you agree to be bound by these Terms. Please read them carefully.
                        </p>
                        <p className="text-slate-700 leading-relaxed">
                            If you do not agree with any part of these Terms, you should not use our website or services. These Terms constitute a legally binding agreement between you and Beyond Tax Consultants.
                        </p>
                    </section>

                    {/* Acceptance of Terms */}
                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <CheckCircle className="h-8 w-8 text-blue-600" />
                            <h2 className="text-3xl font-bold text-slate-900">Acceptance of Terms</h2>
                        </div>
                        <p className="text-slate-700 mb-4">
                            By using our services, you acknowledge that:
                        </p>
                        <ul className="space-y-3 text-slate-700">
                            <li className="flex items-start gap-3">
                                <span className="text-blue-600 font-bold mt-1">•</span>
                                <span>You are at least 18 years old and have the legal capacity to enter into this agreement</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-600 font-bold mt-1">•</span>
                                <span>You have read, understood, and agree to be bound by these Terms</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-600 font-bold mt-1">•</span>
                                <span>You will comply with all applicable laws and regulations</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-600 font-bold mt-1">•</span>
                                <span>All information you provide is accurate, current, and complete</span>
                            </li>
                        </ul>
                    </section>

                    {/* Services Description */}
                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <FileText className="h-8 w-8 text-blue-600" />
                            <h2 className="text-3xl font-bold text-slate-900">Services Provided</h2>
                        </div>
                        <p className="text-slate-700 mb-4">
                            Beyond Tax Consultants provides professional accounting, tax preparation, and financial advisory services including but not limited to:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="font-semibold text-slate-900 mb-2">Tax Services</h4>
                                <p className="text-sm text-slate-700">Individual and business tax return preparation, tax planning, and IRS representation</p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="font-semibold text-slate-900 mb-2">Accounting Services</h4>
                                <p className="text-sm text-slate-700">Bookkeeping, financial statements, and payroll processing</p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="font-semibold text-slate-900 mb-2">Advisory Services</h4>
                                <p className="text-sm text-slate-700">Business consulting, financial planning, and strategic advice</p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="font-semibold text-slate-900 mb-2">Compliance Services</h4>
                                <p className="text-sm text-slate-700">Audit support, compliance reviews, and regulatory assistance</p>
                            </div>
                        </div>
                    </section>

                    {/* Client Responsibilities */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Client Responsibilities</h2>
                        <div className="bg-slate-50 rounded-lg p-6 border-l-4 border-blue-600">
                            <p className="text-slate-700 mb-4">As our client, you agree to:</p>
                            <ul className="space-y-3 text-slate-700">
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-600 font-bold">1.</span>
                                    <span><strong>Provide Accurate Information:</strong> Supply complete, accurate, and timely information and documentation necessary for service delivery</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-600 font-bold">2.</span>
                                    <span><strong>Timely Response:</strong> Respond promptly to our requests for additional information or clarification</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-600 font-bold">3.</span>
                                    <span><strong>Document Retention:</strong> Maintain proper records and documentation as required by law and for our services</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-600 font-bold">4.</span>
                                    <span><strong>Review and Approval:</strong> Review all documents, returns, and reports before approval and submission</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-600 font-bold">5.</span>
                                    <span><strong>Payment Obligations:</strong> Pay all fees and charges in accordance with the agreed payment terms</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-600 font-bold">6.</span>
                                    <span><strong>Confidentiality:</strong> Maintain the confidentiality of access credentials to client portals and systems</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Fees and Payment */}
                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <DollarSign className="h-8 w-8 text-blue-600" />
                            <h2 className="text-3xl font-bold text-slate-900">Fees and Payment Terms</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-slate-900 mb-3">Service Fees</h3>
                                <p className="text-slate-700 mb-3">
                                    Fees for our services are determined based on the complexity, time required, and scope of work. All fees will be communicated to you before services begin.
                                </p>
                                <ul className="space-y-2 text-slate-700">
                                    <li className="flex items-center gap-2">
                                        <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                                        <span>Flat fees for standard services (e.g., basic tax returns)</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                                        <span>Hourly rates for consulting and advisory services</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                                        <span>Retainer arrangements for ongoing services</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-slate-900 mb-3">Payment Terms</h3>
                                <ul className="space-y-2 text-slate-700">
                                    <li className="flex items-start gap-3">
                                        <span className="text-blue-600 font-bold mt-1">•</span>
                                        <span>Payment is due within 30 days of invoice date unless otherwise agreed</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-blue-600 font-bold mt-1">•</span>
                                        <span>Late payments may incur interest charges at 1.5% per month</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-blue-600 font-bold mt-1">•</span>
                                        <span>We reserve the right to suspend services for non-payment</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-blue-600 font-bold mt-1">•</span>
                                        <span>Additional fees may apply for rush services or out-of-scope work</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Professional Standards */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Professional Standards</h2>
                        <p className="text-slate-700 mb-4">
                            Our services are provided in accordance with:
                        </p>
                        <div className="space-y-3">
                            <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-blue-600">
                                <p className="text-slate-700"><strong>AICPA Standards:</strong> American Institute of Certified Public Accountants professional standards and code of conduct</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-blue-600">
                                <p className="text-slate-700"><strong>IRS Circular 230:</strong> Regulations governing practice before the Internal Revenue Service</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-blue-600">
                                <p className="text-slate-700"><strong>State Requirements:</strong> All applicable state board of accountancy regulations</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-blue-600">
                                <p className="text-slate-700"><strong>Professional Ethics:</strong> Highest standards of integrity, objectivity, and professional behavior</p>
                            </div>
                        </div>
                    </section>

                    {/* Limitations of Liability */}
                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <AlertTriangle className="h-8 w-8 text-amber-600" />
                            <h2 className="text-3xl font-bold text-slate-900">Limitations of Liability</h2>
                        </div>
                        <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
                            <p className="text-slate-700 mb-4">
                                While we strive to provide accurate and professional services, you acknowledge and agree that:
                            </p>
                            <ul className="space-y-3 text-slate-700">
                                <li className="flex items-start gap-3">
                                    <span className="text-amber-600 font-bold mt-1">•</span>
                                    <span>Our liability is limited to the amount of fees paid for the specific service in question</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-amber-600 font-bold mt-1">•</span>
                                    <span>We are not liable for indirect, consequential, or punitive damages</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-amber-600 font-bold mt-1">•</span>
                                    <span>We are not responsible for errors resulting from incomplete or inaccurate information provided by you</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-amber-600 font-bold mt-1">•</span>
                                    <span>Tax laws and regulations are subject to change, and interpretations may vary</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-amber-600 font-bold mt-1">•</span>
                                    <span>Final responsibility for tax return accuracy rests with the taxpayer</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Confidentiality */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Confidentiality</h2>
                        <p className="text-slate-700 mb-4">
                            We maintain strict confidentiality of all client information in accordance with professional standards and legal requirements. All information shared with us is protected under:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <p className="text-slate-700"><strong>Professional Privilege:</strong> CPA-client privilege where applicable by law</p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4">
                                <p className="text-slate-700"><strong>Ethical Standards:</strong> AICPA Code of Professional Conduct</p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4">
                                <p className="text-slate-700"><strong>Security Measures:</strong> Industry-standard data protection protocols</p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4">
                                <p className="text-slate-700"><strong>Limited Disclosure:</strong> Information shared only when legally required or authorized</p>
                            </div>
                        </div>
                    </section>

                    {/* Termination */}
                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <XCircle className="h-8 w-8 text-red-600" />
                            <h2 className="text-3xl font-bold text-slate-900">Termination</h2>
                        </div>
                        <div className="space-y-4 text-slate-700">
                            <p>
                                Either party may terminate our engagement with written notice. Upon termination:
                            </p>
                            <ul className="space-y-2 ml-4">
                                <li className="flex items-start gap-3">
                                    <span className="text-red-600 font-bold mt-1">•</span>
                                    <span>You remain responsible for payment of all services rendered up to the termination date</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-600 font-bold mt-1">•</span>
                                    <span>We will provide you with all original documents and records</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-600 font-bold mt-1">•</span>
                                    <span>Work product completed up to termination remains our property until payment is received</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-600 font-bold mt-1">•</span>
                                    <span>We may retain copies of documents for our records as required by professional standards</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Intellectual Property */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Intellectual Property</h2>
                        <p className="text-slate-700 mb-4">
                            All content on our website, including text, graphics, logos, images, and software, is the property of Beyond Tax Consultants and protected by copyright and trademark laws. You may not:
                        </p>
                        <ul className="space-y-2 text-slate-700 ml-4">
                            <li className="flex items-start gap-3">
                                <span className="text-blue-600 font-bold mt-1">•</span>
                                <span>Reproduce, distribute, or display our content without written permission</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-600 font-bold mt-1">•</span>
                                <span>Use our trademarks or branding without authorization</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-600 font-bold mt-1">•</span>
                                <span>Modify, reverse engineer, or create derivative works from our materials</span>
                            </li>
                        </ul>
                    </section>

                    {/* Dispute Resolution */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Dispute Resolution</h2>
                        <div className="bg-slate-50 rounded-lg p-6">
                            <p className="text-slate-700 mb-4">
                                In the event of any dispute arising from these Terms or our services:
                            </p>
                            <ol className="space-y-3 text-slate-700">
                                <li className="flex items-start gap-3">
                                    <span className="font-bold text-blue-600">1.</span>
                                    <span><strong>Good Faith Negotiation:</strong> Both parties agree to first attempt resolution through good faith negotiation</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="font-bold text-blue-600">2.</span>
                                    <span><strong>Mediation:</strong> If negotiation fails, disputes will be submitted to mediation</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="font-bold text-blue-600">3.</span>
                                    <span><strong>Arbitration:</strong> Unresolved disputes will be settled by binding arbitration in New York</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="font-bold text-blue-600">4.</span>
                                    <span><strong>Governing Law:</strong> These Terms are governed by the laws of the State of New York</span>
                                </li>
                            </ol>
                        </div>
                    </section>

                    {/* Changes to Terms */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Changes to Terms</h2>
                        <p className="text-slate-700">
                            We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services after changes constitutes acceptance of the modified Terms. We encourage you to review these Terms periodically.
                        </p>
                    </section>

                    {/* Contact Information */}
                    <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white">
                        <h2 className="text-3xl font-bold mb-4">Questions About These Terms?</h2>
                        <p className="mb-6">
                            If you have any questions or concerns about these Terms and Conditions, please contact us:
                        </p>
                        <div className="space-y-2">
                            <p><strong>Beyond Tax Consultants</strong></p>
                            <p>123 Business Avenue, Suite 100</p>
                            <p>New York, NY 10001</p>
                            <p>Email: legal@beyondtaxconsultants.com</p>
                            <p>Phone: (555) 123-4567</p>
                        </div>
                    </section>

                    {/* Back to Home */}
                    <div className="mt-8 text-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}