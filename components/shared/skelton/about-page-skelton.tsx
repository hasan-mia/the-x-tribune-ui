import { Skeleton } from '@/components/ui/skeleton'

export default function AboutPageSkeleton() {
    return (
        <div className="min-h-screen">
            {/* Hero Section Skeleton */}
            <section className="relative py-24 px-4 bg-gradient-to-br from-primary/10 via-background to-primary/5">
                <div className="max-w-7xl mx-auto text-center space-y-6">
                    <Skeleton className="h-8 w-48 mx-auto rounded-full" />
                    <Skeleton className="h-16 w-full max-w-2xl mx-auto" />
                    <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
                </div>
            </section>

            {/* Stats Section Skeleton */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="text-center space-y-2">
                                <Skeleton className="h-12 w-24 mx-auto" />
                                <Skeleton className="h-4 w-32 mx-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Section Skeleton */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <Skeleton className="h-10 w-48" />
                            <div className="space-y-4">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                        </div>
                        <Skeleton className="aspect-[4/3] rounded-2xl" />
                    </div>
                </div>
            </section>

            {/* Mission & Vision Skeleton */}
            <section className="py-20 px-4 bg-muted/30">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-card p-8 rounded-2xl border shadow-sm space-y-6">
                                <Skeleton className="h-14 w-14 rounded-lg" />
                                <Skeleton className="h-8 w-40" />
                                <div className="space-y-3">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section Skeleton */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <Skeleton className="h-10 w-48 mx-auto" />
                        <Skeleton className="h-6 w-96 mx-auto" />
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="space-y-4">
                                <Skeleton className="h-12 w-12 rounded-lg" />
                                <Skeleton className="h-6 w-32" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline Section Skeleton */}
            <section className="py-20 px-4 bg-muted/30">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <Skeleton className="h-10 w-48 mx-auto" />
                        <Skeleton className="h-6 w-80 mx-auto" />
                    </div>
                    <div className="relative">
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 -translate-x-1/2" />
                        <div className="space-y-12">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className={`relative grid md:grid-cols-2 gap-8`}>
                                    {i % 2 === 0 ? (
                                        <>
                                            <div className="md:text-right space-y-2">
                                                <Skeleton className="h-8 w-20 ml-auto" />
                                                <Skeleton className="h-6 w-48 ml-auto" />
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-4 w-3/4 ml-auto" />
                                            </div>
                                            <div className="hidden md:flex items-center justify-center">
                                                <Skeleton className="h-4 w-4 rounded-full" />
                                            </div>
                                            <div />
                                        </>
                                    ) : (
                                        <>
                                            <div />
                                            <div className="hidden md:flex items-center justify-center">
                                                <Skeleton className="h-4 w-4 rounded-full" />
                                            </div>
                                            <div className="space-y-2">
                                                <Skeleton className="h-8 w-20" />
                                                <Skeleton className="h-6 w-48" />
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-4 w-3/4" />
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section Skeleton */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <Skeleton className="h-10 w-48 mx-auto" />
                        <Skeleton className="h-6 w-96 mx-auto" />
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="space-y-4">
                                <Skeleton className="aspect-square rounded-2xl" />
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Certifications Section Skeleton */}
            <section className="py-20 px-4 bg-muted/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <Skeleton className="h-10 w-64 mx-auto" />
                        <Skeleton className="h-6 w-96 mx-auto" />
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-card p-6 rounded-2xl border space-y-4">
                                <Skeleton className="h-16 w-16 rounded-lg mx-auto" />
                                <Skeleton className="h-6 w-32 mx-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section Skeleton */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-96 mx-auto" />
                        <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
                    </div>
                    <Skeleton className="h-12 w-48 mx-auto rounded-lg" />
                </div>
            </section>
        </div>
    )
}