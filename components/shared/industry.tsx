"use client";

import { Building2, Briefcase, Calculator, TrendingUp, Users, DollarSign, Hospital, ShoppingCart, Factory, LaptopIcon } from 'lucide-react';
import Image from 'next/image';

// Map icon names to Lucide components
const iconMap: Record<string, any> = {
    FaHospital: Hospital,
    FaBuilding: Building2,
    FaLaptopCode: LaptopIcon,
    FaShoppingCart: ShoppingCart,
    FaIndustry: Factory,
    FaBriefcase: Briefcase,
};

// Fallback icons for random selection
const fallbackIcons = [Building2, Briefcase, Calculator, TrendingUp, Users, DollarSign];


export default function Industry({ industry, index }: any) {

    const getRandomIcon = (index: number) => {
        return fallbackIcons[index % fallbackIcons.length];
    };

    const renderIcon = (iconName: string | null, name: string, index: number) => {
        // Check if icon is an image URL
        if (iconName && (iconName.startsWith('http://') || iconName.startsWith('https://') || iconName.startsWith('/'))) {
            return (
                <div className="relative h-10 w-10 mb-3">
                    <Image
                        src={iconName}
                        alt={name}
                        fill
                        className="object-contain"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                </div>
            );
        }

        // Check if it's a mapped icon name
        const IconComponent = iconName ? iconMap[iconName] : null;
        const FallbackIcon = IconComponent || getRandomIcon(index);

        return <FallbackIcon className="h-10 w-10 text-primary mb-3" />;
    };


    return (
        <div
            key={industry.id}
            className="flex flex-col items-center p-6 rounded-xl bg-card border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
        >
            <div className="transition-transform group-hover:scale-110">
                {renderIcon(industry.icon, industry.name, index)}
            </div>
            <span className="text-sm font-medium text-center">
                {industry.name}
            </span>
        </div>
    )
}
