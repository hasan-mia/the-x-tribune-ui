import React from 'react'

export default function Comparison() {
    return (
        <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">Compare Plans</h2>
                    <p className="text-xl text-muted-foreground">
                        See what's included in each package
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-card rounded-2xl overflow-hidden">
                        <thead>
                            <tr className="bg-muted">
                                <th className="p-4 text-left font-semibold">Feature</th>
                                <th className="p-4 text-center font-semibold">Starter</th>
                                <th className="p-4 text-center font-semibold">Professional</th>
                                <th className="p-4 text-center font-semibold">Enterprise</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {[
                                { feature: 'Monthly Bookkeeping', starter: 'Up to 50', pro: 'Up to 200', ent: 'Unlimited' },
                                { feature: 'Financial Statements', starter: 'Basic', pro: 'Comprehensive', ent: 'Full + Analysis' },
                                { feature: 'Tax Preparation', starter: '✓', pro: '✓', ent: '✓' },
                                { feature: 'Tax Planning', starter: 'Annual', pro: 'Quarterly', ent: 'Advanced' },
                                { feature: 'Payroll Services', starter: '—', pro: 'Up to 10', ent: 'Unlimited' },
                                { feature: 'Financial Reviews', starter: 'Quarterly', pro: 'Monthly', ent: 'Weekly' },
                                { feature: 'CFO Advisory', starter: '—', pro: '—', ent: '✓' },
                                { feature: 'Support', starter: 'Email', pro: 'Phone + Email', ent: 'Priority' },
                            ].map((row) => (
                                <tr key={row.feature} className="hover:bg-muted/30">
                                    <td className="p-4 font-medium">{row.feature}</td>
                                    <td className="p-4 text-center text-muted-foreground">{row.starter}</td>
                                    <td className="p-4 text-center text-muted-foreground">{row.pro}</td>
                                    <td className="p-4 text-center text-muted-foreground">{row.ent}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}
