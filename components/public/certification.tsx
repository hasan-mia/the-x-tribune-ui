import { CheckCircle2 } from 'lucide-react'
import React from 'react'

export default function Certification({ certifications }: { certifications: string[] }) {
    return (
        <section className="py-20 px-4 bg-muted/30">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">Certifications & Memberships</h2>
                    <p className="text-xl text-muted-foreground">
                        Maintaining the highest professional standards
                    </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {certifications.map((cert) => (
                        <div key={cert} className="bg-card p-6 rounded-xl border flex items-center gap-3">
                            <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                            <span className="font-medium">{cert}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
