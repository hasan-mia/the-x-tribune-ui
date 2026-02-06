import React from 'react'

export default function AboutCta() {
    return (
        <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-6">Ready to Work Together?</h2>
                <p className="text-xl text-muted-foreground mb-8">
                    Let's discuss how we can help you achieve your financial goals
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="/contact" className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
                        Contact Us Today
                    </a>
                    <a href="/services" className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground font-semibold transition-colors">
                        View Our Services
                    </a>
                </div>
            </div>
        </section>
    )
}
