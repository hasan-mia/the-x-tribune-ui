import { Target, TrendingUp } from 'lucide-react'
import React from 'react'

interface MissionVisionProps {
    mission?: {
        title: string;
        description: string;
    };
    vision?: {
        title: string;
        description: string;
    };
}

export default function MissionVision({ mission, vision }: MissionVisionProps) {
    // Fallback to default content if no data provided
    const missionTitle = mission?.title || "Our Mission";
    const missionDescription = mission?.description || "To provide comprehensive, personalized accounting and tax services that empower our clients to make informed financial decisions, achieve their business goals, and build lasting financial success. We are committed to delivering exceptional value through expertise, innovation, and unwavering dedication to client service.";

    const visionTitle = vision?.title || "Our Vision";
    const visionDescription = vision?.description || "To be the most trusted and respected CPA firm in the region, recognized for our professional excellence, innovative solutions, and commitment to client success. We envision a future where every client feels confident in their financial decisions and empowered to achieve their goals.";

    return (
        <section className="py-10 px-4 bg-muted/30">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-card p-8 rounded-2xl border shadow-sm">
                        <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                            <Target className="h-7 w-7 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">{missionTitle}</h3>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {missionDescription}
                        </p>
                    </div>
                    <div className="bg-card p-8 rounded-2xl border shadow-sm">
                        <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                            <TrendingUp className="h-7 w-7 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">{visionTitle}</h3>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {visionDescription}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}