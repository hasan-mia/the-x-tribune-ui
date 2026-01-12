"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { useSubscribeNewsletter } from "@/api/newsletter"
import useCustomToast from "@/hooks/use-custom-toast"

export default function Subscriber() {
    const [email, setEmail] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)
    const { mutate, isPending } = useSubscribeNewsletter()
    const toast = useCustomToast()

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
        <section className="py-20 px-4 bg-muted/30">
            {!isSubmitted ? (

                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Never Miss an Update</h2>
                    <p className="text-muted-foreground mb-8">
                        Subscribe to our newsletter and get the latest articles delivered to your inbox.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <Input id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="flex-1"
                            disabled={isPending}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    handleSubmit(e as any)
                                }
                            }} />
                        <Button className="sm:w-auto" onClick={handleSubmit}
                            disabled={isPending}>
                            {isPending ? (
                                <span className="flex items-center gap-2">
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Subscribing...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Subscribe
                                    <ArrowRight className="h-5 w-5" />
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="py-8 text-center space-y-4">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-500/10 border-2 border-green-500 mb-2">
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                    </div>
                    <h4 className="text-2xl font-bold text-foreground">
                        WELCOME!
                    </h4>
                    <p className="text-muted-foreground">
                        Thank you for subscribing. Check your email for a confirmation message.
                    </p>
                </div>
            )}
        </section>
    )
}