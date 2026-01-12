
export default function ContactInfoSkeleton() {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, idx) => (
                <div key={idx} className="bg-card p-6 rounded-xl border shadow-sm">
                    <div className="h-12 w-12 rounded-lg bg-gray-200 animate-pulse mb-4" />
                    <div className="h-6 w-24 bg-gray-200 animate-pulse rounded mb-3" />
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
                        <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
                    </div>
                </div>
            ))}
        </div>
    )
}