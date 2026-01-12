"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { ArrowRight, CheckCircle2, Mail, TrendingUp, FileText, Bell } from "lucide-react"
import { useSubscribeNewsletter } from "@/api/newsletter"
import useCustomToast from "@/hooks/use-custom-toast"

export default function Newsletter() {
    const [email, setEmail] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)
    const { mutate, isPending } = useSubscribeNewsletter()
    const toast = useCustomToast()

    const benefits = [
        { icon: TrendingUp, text: "Tax-saving strategies" },
        { icon: FileText, text: "Financial planning tips" },
        { icon: Bell, text: "Industry updates" }
    ]

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const payload = { email } as any

        mutate(
            payload,
            {
                onSuccess: (data) => {
                    if (data.success) {
                        setIsSubmitted(true)
                        setEmail("")
                        toast.success(data.message || "Successfully subscribed!")

                        // Reset success message after 5 seconds
                        setTimeout(() => setIsSubmitted(false), 5000)
                    } else {
                        toast.info(data.message || "Subscription failed")
                    }
                },
                onError: (error: any) => {
                    const errorMessage = error?.message || "Failed to subscribe. Please try again."
                    if (error?.status == 400) {
                        toast.info(errorMessage || "Subscription failed")
                    } else {
                        toast.error(errorMessage || "Subscription failed")
                    }

                }
            }
        )
    }

    return (
        <section className="relative border-y bg-muted/50 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-4 py-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">

                    {/* Text Section */}
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                            <Mail className="h-4 w-4" />
                            <span>Join 5,000+ Subscribers</span>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                                Stay Ahead of the Financial Curve
                            </h3>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Get expert tax tips, financial insights, and important regulatory updates delivered directly to your inbox every week.
                            </p>
                        </div>

                        {/* Benefits List */}
                        <div className="space-y-3 pt-4">
                            {benefits.map((benefit) => {
                                const Icon = benefit.icon
                                return (
                                    <div key={benefit.text} className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                            <Icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <span className="text-foreground">{benefit.text}</span>
                                    </div>
                                )
                            })}
                        </div>

                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            No spam. Unsubscribe anytime.
                        </p>
                    </div>

                    {/* Form Section */}
                    <div className="relative">
                        <div className="bg-card border rounded-2xl p-8 shadow-lg">
                            {!isSubmitted ? (
                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-3">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="your.email@example.com"
                                                className="pl-12 h-14 text-base"
                                                disabled={isPending}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault()
                                                        handleSubmit(e as any)
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={isPending}
                                        className="w-full h-14 bg-primary hover:bg-primary/90 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                                    >
                                        {isPending ? (
                                            <span className="flex items-center gap-2">
                                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Subscribing...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                Subscribe Now
                                                <ArrowRight className="h-5 w-5" />
                                            </span>
                                        )}
                                    </Button>

                                    <p className="text-xs text-muted-foreground text-center">
                                        By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
                                    </p>
                                </div>
                            ) : (
                                <div className="py-8 text-center space-y-4">
                                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-500/10 border-2 border-green-500 mb-2">
                                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                                    </div>
                                    <h4 className="text-2xl font-bold text-foreground">
                                        WELCOME TO BTC!
                                    </h4>
                                    <p className="text-muted-foreground">
                                        Thank you for subscribing. Check your email for a confirmation message.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Trust Indicators */}
                        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                <span>GDPR Compliant</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                <span>Secure & Encrypted</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}