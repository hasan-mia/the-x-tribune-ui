import React from 'react'

export default function ValueSection({ values }: { values: { title: string; description: string; icon: React.ComponentType<any> }[] }) {
    return (
        <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
                    <p className="text-xl text-muted-foreground">
                        The principles that guide everything we do
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((value) => {
                        const Icon = value.icon
                        return (
                            <div key={value.title} className="bg-card p-6 rounded-xl border hover:shadow-lg transition-shadow">
                                <Icon className="h-10 w-10 text-primary mb-4" />
                                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
