export default function FooterSkeleton() {
    return (
        <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-slate-200 mt-20">
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="h-6 bg-slate-700 rounded w-32 mb-6"></div>
                            <div className="space-y-3">
                                {[...Array(4)].map((_, j) => (
                                    <div key={j} className="h-4 bg-slate-700 rounded w-full"></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="border-t border-slate-700">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="animate-pulse">
                        <div className="h-4 bg-slate-700 rounded w-64 mx-auto"></div>
                    </div>
                </div>
            </div>
        </footer>
    );
}