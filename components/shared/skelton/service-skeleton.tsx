
export default function ServiceSkeleton() {
    return (
        <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="h-10 w-64 bg-muted rounded-lg mx-auto mb-4 animate-pulse" />
                    <div className="h-6 w-96 bg-muted rounded-lg mx-auto animate-pulse" />
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {[1, 2, 3, 4].map((index) => (
                        <div
                            key={index}
                            className="bg-card border rounded-2xl p-8"
                        >
                            {/* Icon and Title */}
                            <div className="flex items-start gap-6 mb-6">
                                <div className="h-16 w-16 rounded-xl bg-muted animate-pulse shrink-0" />
                                <div className="flex-grow space-y-3">
                                    <div className="h-7 w-3/4 bg-muted rounded-lg animate-pulse" />
                                    <div className="h-4 w-full bg-muted rounded-lg animate-pulse" />
                                    <div className="h-4 w-5/6 bg-muted rounded-lg animate-pulse" />
                                </div>
                            </div>

                            {/* Features */}
                            <div className="mb-6">
                                <div className="h-5 w-40 bg-muted rounded-lg mb-3 animate-pulse" />
                                <ul className="space-y-2">
                                    {[1, 2, 3, 4].map((feat) => (
                                        <li key={feat} className="flex items-start gap-2">
                                            <div className="h-4 w-4 bg-muted rounded-full mt-0.5 shrink-0 animate-pulse" />
                                            <div className="h-4 flex-grow bg-muted rounded-lg animate-pulse" />
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Benefits Box */}
                            <div className="p-4 bg-muted/50 rounded-lg border mb-6">
                                <div className="h-4 w-full bg-muted rounded-lg animate-pulse" />
                            </div>

                            {/* Button */}
                            <div className="h-10 w-full bg-muted rounded-lg animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}