export default function FaqSkeleton() {
    return (
        <section className="py-20 px-4 bg-muted/30">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div className="h-10 bg-muted rounded-lg w-64 mx-auto mb-4 animate-pulse" />
                    <div className="h-6 bg-muted rounded-lg w-96 mx-auto animate-pulse" />
                </div>

                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="bg-card border rounded-xl p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="h-5 w-5 bg-muted rounded animate-pulse" />
                                    <div className="h-6 bg-muted rounded-lg w-3/4 animate-pulse" />
                                </div>
                                <div className="h-5 w-5 bg-muted rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
