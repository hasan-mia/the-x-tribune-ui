import { Briefcase, TrendingUp, Users } from 'lucide-react'
import React from 'react'

export default function TeamMember() {
    return (
        <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Our Expert Team</h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Our team of certified public accountants brings decades of combined experience across diverse specializations
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-4 border-primary/20 mx-auto mb-4 flex items-center justify-center">
                            <Users className="h-16 w-16 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Tax Specialists</h3>
                        <p className="text-muted-foreground">
                            Expert tax planners and preparers with deep knowledge of federal, state, and local tax codes
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-4 border-primary/20 mx-auto mb-4 flex items-center justify-center">
                            <Briefcase className="h-16 w-16 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Audit Professionals</h3>
                        <p className="text-muted-foreground">
                            Certified auditors providing independent reviews and financial statement assurance
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-4 border-primary/20 mx-auto mb-4 flex items-center justify-center">
                            <TrendingUp className="h-16 w-16 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Financial Advisors</h3>
                        <p className="text-muted-foreground">
                            Strategic financial planners helping clients build and preserve wealth
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
