/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React from 'react';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { Phone, Send, CheckCircle2, MessageSquare } from 'lucide-react'
import { reasons } from '@/utils/static-data'
import ContactInfoCard from '@/components/public/contact-info-card'
import { useCreateContactUs } from '@/api/contact-us'
import useCustomToast from '@/hooks/use-custom-toast'
import Map from '@/components/shared/map'
import { useGetSettings } from '@/api/settings'
import PageHero from '../shared/page-hero'

export default function ContactContent() {
    const toast = useCustomToast()
    const createContactMutation = useCreateContactUs()
    const { data } = useGetSettings('contact_info')
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
    })
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            await createContactMutation.mutateAsync(formData)

            setIsSubmitted(true)
            setFormData({ name: '', email: '', phone: '', company: '', subject: '', message: '' })
            toast.success('Message sent successfully! We\'ll respond within 24 hours.')

            // Reset success message after 5 seconds
            setTimeout(() => setIsSubmitted(false), 5000)
        } catch (error: any) {
            toast.error(error?.message || 'Failed to send message. Please try again.')
        }
    }

    const isSubmitting = createContactMutation.isPending

    // Find specific contact items
    const phoneInfo = data?.data?.value.find((item: any) => item.icon === 'Phone');


    return (
        <div className="min-h-screen">

            <PageHero
                icon={MessageSquare}
                badge="We're Here to Help"
                title="Get In Touch"
                description="Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible."
            />

            {/* Contact Info Cards */}
            <ContactInfoCard />

            {/* Main Contact Section */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Left Column - Form */}
                        <div>
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold mb-4">Send Us a Message</h2>
                                <p className="text-muted-foreground">
                                    Fill out the form below and our team will get back to you within 24 hours.
                                </p>
                            </div>

                            {!isSubmitted ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="text-sm font-medium">
                                                Full Name <span className="text-destructive">*</span>
                                            </label>
                                            <Input
                                                id="name"
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="John Doe"
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-medium">
                                                Email Address <span className="text-destructive">*</span>
                                            </label>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="john@example.com"
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="phone" className="text-sm font-medium">
                                                Phone Number
                                            </label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="(555) 000-0000"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="company" className="text-sm font-medium">
                                                Company Name
                                            </label>
                                            <Input
                                                id="company"
                                                type="text"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                placeholder="Your Company"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="subject" className="text-sm font-medium">
                                            Subject <span className="text-destructive">*</span>
                                        </label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            disabled={isSubmitting}
                                            className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        >
                                            <option value="">Select a subject</option>
                                            {reasons?.map((reason) => (
                                                <option key={reason} value={reason}>
                                                    {reason}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="message" className="text-sm font-medium">
                                            Message <span className="text-destructive">*</span>
                                        </label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Tell us how we can help you..."
                                            rows={6}
                                            required
                                            disabled={isSubmitting}
                                            className="resize-none"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-12 text-base font-semibold"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2">
                                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Sending...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                Send Message
                                                <Send className="h-4 w-4" />
                                            </span>
                                        )}
                                    </Button>

                                    <p className="text-xs text-muted-foreground text-center">
                                        By submitting this form, you agree to our Privacy Policy and Terms of Service.
                                    </p>
                                </form>
                            ) : (
                                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center">
                                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 border-2 border-green-500 mb-4">
                                        <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Message Sent Successfully!</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Thank you for contacting us. We&apos;ve received your message and will respond within 24 hours.
                                    </p>
                                    <Button
                                        onClick={() => setIsSubmitted(false)}
                                        variant="outline"
                                    >
                                        Send Another Message
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Additional Info */}
                        <div className="space-y-8">
                            {/* Quick Response */}
                            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8">
                                <h3 className="text-2xl font-bold mb-4">Quick Response Guarantee</h3>
                                <p className="text-muted-foreground mb-6">
                                    We understand that time is valuable. Our team commits to responding to all inquiries within 24 hours during business days.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-primary" />
                                        <span className="text-sm">24-hour response time</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-primary" />
                                        <span className="text-sm">Free initial consultation</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-primary" />
                                        <span className="text-sm">No obligation quote</span>
                                    </div>
                                </div>
                            </div>

                            {/* Map Placeholder */}
                            <Map />

                            {/* Emergency Contact */}
                            <div className="bg-card border rounded-2xl p-6">
                                <h3 className="font-semibold text-lg mb-3">Need Immediate Assistance?</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    For urgent tax matters or time-sensitive inquiries, please call us directly.
                                </p>
                                <a
                                    href={phoneInfo?.link}
                                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                                >
                                    <Phone className="h-5 w-5" />
                                    Call {phoneInfo?.link?.split(':')?.[1]}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-4 bg-muted/30">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground mb-12">
                        Can&apos;t find what you&apos;re looking for? Check our FAQ page or give us a call.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="/faq" className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground font-semibold transition-colors">
                            View FAQs
                        </a>
                        <a href="/services" className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground font-semibold transition-colors">
                            Our Services
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}