
export default function TrustIndicator({ trustIndicators }: any) {
    return (
        <section className="py-12 px-4 border-y bg-card">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {trustIndicators?.map((item: any, index: number) => {
                        const Icon = item.icon
                        return (
                            <div key={index} className="flex items-center justify-center gap-2">
                                <Icon className="h-5 w-5 text-primary" />
                                <span className="font-medium text-sm">{item.text}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
