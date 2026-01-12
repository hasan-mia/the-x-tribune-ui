
export default function IndustrySkelton() {
    return (
        <section className="py-20 px-4 bg-muted/30">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Industries We Serve</h2>
                    <p className="text-xl text-muted-foreground">
                        Specialized expertise across diverse sectors
                    </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center p-6 rounded-xl bg-card border animate-pulse"
                        >
                            <div className="h-10 w-10 bg-muted rounded mb-3" />
                            <div className="h-4 w-20 bg-muted rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
