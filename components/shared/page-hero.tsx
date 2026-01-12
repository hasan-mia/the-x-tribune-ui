import { LucideIcon } from "lucide-react"

interface PageHeroProps {
    icon: LucideIcon
    badge: string
    title: string
    description: string
}

export default function PageHero({ icon: Icon, badge, title, description }: PageHeroProps) {
    return (
        <section className="relative py-24 px-4 bg-gradient-to-br from-primary/10 via-background to-primary/5">
            <div className="max-w-7xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                    <Icon className="h-4 w-4" />
                    <span>{badge}</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6">{title}</h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    {description}
                </p>
            </div>
        </section>
    )
}