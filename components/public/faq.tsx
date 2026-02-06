import { ArrowRight, HelpCircle } from 'lucide-react'
import FaqSkeleton from '../shared/skelton/faq-skelton'


export default function Faq({
    title = "Pricing FAQs",
    description = "Common questions about our pricing and packages",
    faqs = [],
    isLoading = false
}: any) {

    if (isLoading) {
        return <FaqSkeleton />
    }

    // Show empty state
    if (!faqs || faqs.length === 0) {
        return (
            <section className="py-20 px-4 bg-muted/30">
                <div className="max-w-4xl mx-auto text-center">
                    <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold mb-2">No FAQs Available</h3>
                    <p className="text-muted-foreground">Check back later for frequently asked questions.</p>
                </div>
            </section>
        )
    }

    return (
        <section className="py-20 px-4 bg-muted/30">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">{title}</h2>
                    <p className="text-xl text-muted-foreground">
                        {description}
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq: any) => (
                        <details
                            key={faq.id}
                            className="bg-card border rounded-xl p-6 group hover:shadow-md transition-shadow"
                        >
                            <summary className="font-semibold text-lg cursor-pointer list-none flex items-center justify-between">
                                <span className="flex items-center gap-3">
                                    <HelpCircle className="h-5 w-5 text-primary flex-shrink-0" />
                                    {faq.question}
                                </span>
                                <ArrowRight className="h-5 w-5 text-primary group-open:rotate-90 transition-transform flex-shrink-0" />
                            </summary>
                            <p className="mt-4 text-muted-foreground leading-relaxed pl-8">
                                {faq.answer}
                            </p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    )
}