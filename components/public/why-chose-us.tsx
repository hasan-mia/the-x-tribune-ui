"use client";

import { useGetWhyChoseUs } from '@/api/why-chose-us';
import IndustrySkelton from '../shared/skelton/industry-skelton';
import { Award, Target, CheckCircle, Star, BadgeCheck, Shield, ThumbsUp, Heart, Sparkles, Gem, Medal, Crown } from 'lucide-react';

// Random icon pool
const iconPool = [
    Award, Target, CheckCircle, Star, BadgeCheck, Shield,
    ThumbsUp, Heart, Sparkles, Gem, Medal, Crown
];

// Get a consistent random icon based on index
const getRandomIcon = (index: number) => {
    return iconPool[index % iconPool.length];
};

interface WhyChoseUsItem {
    id: string;
    title: string;
    description: string;
    icon: string | null;
    is_active: boolean;
    sort_order: number;
}

export default function WhyChooseUs() {
    const { data, isLoading, error } = useGetWhyChoseUs();

    if (isLoading) {
        return <IndustrySkelton />;
    }

    if (error) {
        return (
            <section className="py-20 px-4 bg-muted/30">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-muted-foreground">Failed to load Why Choose Us section</p>
                </div>
            </section>
        );
    }

    const whyChoseUses: WhyChoseUsItem[] = data?.data || [];

    // Don't render if no items
    if (whyChoseUses.length === 0) {
        return null;
    }

    // Determine grid columns based on item count
    const gridCols = whyChoseUses.length === 1
        ? 'grid-cols-1'
        : whyChoseUses.length === 2
            ? 'md:grid-cols-2'
            : 'md:grid-cols-3';

    return (
        <section className="py-20 px-4 bg-muted/30">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Us</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Partnering with a CPA firm that puts your success first
                    </p>
                </div>

                <div className={`grid ${gridCols} gap-8`}>
                    {whyChoseUses.map((item, index) => {
                        // If icon exists, use image; otherwise use random Lucide icon
                        const IconComponent = !item.icon ? getRandomIcon(index) : null;

                        return (
                            <div
                                key={item.id}
                                className="bg-card p-8 rounded-xl border shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6 overflow-hidden">
                                    {item.icon ? (
                                        <img
                                            src={item.icon}
                                            alt={item.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : IconComponent ? (
                                        <IconComponent className="h-7 w-7 text-primary" />
                                    ) : (
                                        <Award className="h-7 w-7 text-primary" />
                                    )}
                                </div>
                                <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}