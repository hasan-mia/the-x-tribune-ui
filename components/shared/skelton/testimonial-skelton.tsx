export default function TestimonialSkeleton() {
    return (
        <div className="bg-card p-8 rounded-xl border shadow-sm animate-pulse">
            <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-5 w-5 rounded-full bg-gray-200" />
                ))}
            </div>
            <div className="space-y-3 mb-6">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="h-4 bg-gray-200 rounded w-4/6" />
            </div>
            <div className="border-t pt-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 rounded-full bg-gray-200" />
                    <div className="space-y-2 flex-1">
                        <div className="h-5 bg-gray-200 rounded w-2/3" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                </div>
            </div>
        </div>
    )
}