import Link from 'next/link'
import { Shield, Lock, Eye, UserCheck, Database, Mail } from 'lucide-react'

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Hero Section */}
            <div className="relative py-20 px-4 bg-gradient-to-br from-primary via-primary to-blue-700 text-primary-foreground overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Shield className="h-12 w-12 text-blue-400" />
                        <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
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
                            At Beyond Tax Consultants ("we," "our," or "us"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                        </p>
                        <p className="text-slate-700 leading-relaxed">
                            By using our services, you agree to the collection and use of information in accordance with this policy. We handle sensitive financial information with the highest standards of confidentiality and security.
                        </p>
                    </section>

                    {/* Information We Collect */}
                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <Database className="h-8 w-8 text-blue-600" />
                            <h2 className="text-3xl font-bold text-slate-900">Information We Collect</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-50 rounded-lg p-6 border-l-4 border-blue-600">
                                <h3 className="text-xl font-semibold text-slate-900 mb-3">Personal Information</h3>
                                <p className="text-slate-700 mb-3">We may collect the following personal information:</p>
                                <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                                    <li>Full name, email address, and phone number</li>
                                    <li>Mailing address and billing information</li>
                                    <li>Social Security Number or Tax ID Number</li>
                                    <li>Financial information including income, expenses, and account details</li>
                                    <li>Employment information and business details</li>
                                    <li>Tax returns and related documents</li>
                                </ul>
                            </div>

                            <div className="bg-slate-50 rounded-lg p-6 border-l-4 border-blue-600">
                                <h3 className="text-xl font-semibold text-slate-900 mb-3">Automatically Collected Information</h3>
                                <p className="text-slate-700 mb-3">When you visit our website, we automatically collect:</p>
                                <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                                    <li>IP address and browser type</li>
                                    <li>Device information and operating system</li>
                                    <li>Pages visited and time spent on our site</li>
                                    <li>Referral sources and exit pages</li>
                                    <li>Cookies and similar tracking technologies</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* How We Use Your Information */}
                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <UserCheck className="h-8 w-8 text-blue-600" />
                            <h2 className="text-3xl font-bold text-slate-900">How We Use Your Information</h2>
                        </div>

                        <p className="text-slate-700 mb-4">We use your information for the following purposes:</p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="font-semibold text-slate-900 mb-2">Service Delivery</h4>
                                <p className="text-sm text-slate-700">Prepare tax returns, provide accounting services, and deliver professional advice</p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="font-semibold text-slate-900 mb-2">Communication</h4>
                                <p className="text-sm text-slate-700">Respond to inquiries, send updates, and provide customer support</p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="font-semibold text-slate-900 mb-2">Compliance</h4>
                                <p className="text-sm text-slate-700">Meet legal obligations and regulatory requirements</p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="font-semibold text-slate-900 mb-2">Improvement</h4>
                                <p className="text-sm text-slate-700">Enhance our website, services, and user experience</p>
                            </div>
                        </div>
                    </section>

                    {/* Information Sharing */}
                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <Eye className="h-8 w-8 text-blue-600" />
                            <h2 className="text-3xl font-bold text-slate-900">Information Sharing and Disclosure</h2>
                        </div>

                        <p className="text-slate-700 mb-4">
                            We do not sell, trade, or rent your personal information. We may share your information only in the following circumstances:
                        </p>
                        <ul className="space-y-3 text-slate-700">
                            <li className="flex items-start gap-3">
                                <span className="text-blue-600 font-bold mt-1">•</span>
                                <span><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-600 font-bold mt-1">•</span>
                                <span><strong>Service Providers:</strong> With trusted third-party service providers who assist in our operations (e.g., tax software providers, payment processors)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-600 font-bold mt-1">•</span>
                                <span><strong>Legal Requirements:</strong> When required by law, court order, or government regulation</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-600 font-bold mt-1">•</span>
                                <span><strong>Tax Authorities:</strong> With the IRS and state tax agencies as necessary to file returns and fulfill our professional obligations</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-600 font-bold mt-1">•</span>
                                <span><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</span>
                            </li>
                        </ul>
                    </section>

                    {/* Data Security */}
                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <Lock className="h-8 w-8 text-blue-600" />
                            <h2 className="text-3xl font-bold text-slate-900">Data Security</h2>
                        </div>

                        <p className="text-slate-700 mb-4">
                            We implement robust security measures to protect your information:
                        </p>
                        <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg p-6 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                                <p className="text-slate-700">256-bit SSL encryption for data transmission</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                                <p className="text-slate-700">Secure, encrypted storage systems</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                                <p className="text-slate-700">Regular security audits and updates</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                                <p className="text-slate-700">Limited access to authorized personnel only</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                                <p className="text-slate-700">Multi-factor authentication for client portals</p>
                            </div>
                        </div>
                        <p className="text-slate-600 text-sm mt-4 italic">
                            While we strive to protect your information, no method of transmission over the internet is 100% secure. We continuously work to maintain the highest security standards.
                        </p>
                    </section>

                    {/* Your Rights */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Your Privacy Rights</h2>

                        <p className="text-slate-700 mb-4">You have the right to:</p>
                        <div className="space-y-3">
                            <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-blue-600">
                                <h4 className="font-semibold text-slate-900">Access Your Information</h4>
                                <p className="text-slate-700 text-sm">Request a copy of the personal information we hold about you</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-blue-600">
                                <h4 className="font-semibold text-slate-900">Correct Your Information</h4>
                                <p className="text-slate-700 text-sm">Update or correct inaccurate information</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-blue-600">
                                <h4 className="font-semibold text-slate-900">Delete Your Information</h4>
                                <p className="text-slate-700 text-sm">Request deletion of your information (subject to legal retention requirements)</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-blue-600">
                                <h4 className="font-semibold text-slate-900">Opt-Out of Marketing</h4>
                                <p className="text-slate-700 text-sm">Unsubscribe from promotional emails at any time</p>
                            </div>
                        </div>
                    </section>

                    {/* Cookies */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Cookies and Tracking</h2>
                        <p className="text-slate-700 mb-4">
                            We use cookies and similar technologies to enhance your experience. Cookies are small files stored on your device that help us:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                            <li>Remember your preferences and settings</li>
                            <li>Understand how you use our website</li>
                            <li>Improve website functionality and performance</li>
                            <li>Provide personalized content</li>
                        </ul>
                        <p className="text-slate-700 mt-4">
                            You can control cookie settings through your browser. However, disabling cookies may affect your ability to use certain features of our website.
                        </p>
                    </section>

                    {/* Children's Privacy */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Children's Privacy</h2>
                        <p className="text-slate-700">
                            Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                        </p>
                    </section>

                    {/* Changes to Policy */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Changes to This Policy</h2>
                        <p className="text-slate-700">
                            We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the new policy on our website and updating the "Last Updated" date. Your continued use of our services after changes constitutes acceptance of the updated policy.
                        </p>
                    </section>

                    {/* Contact Information */}
                    <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <Mail className="h-8 w-8" />
                            <h2 className="text-3xl font-bold">Contact Us</h2>
                        </div>
                        <p className="mb-6">
                            If you have questions about this Privacy Policy or wish to exercise your privacy rights, please contact us:
                        </p>
                        <div className="space-y-2">
                            <p><strong>Beyond Tax Consultants</strong></p>
                            <p>123 Business Avenue, Suite 100</p>
                            <p>New York, NY 10001</p>
                            <p>Email: privacy@beyondtaxconsultants.com</p>
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