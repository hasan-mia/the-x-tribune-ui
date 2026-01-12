import React from 'react'

export default function CalendarSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column Skeleton */}
                    <div className="bg-white rounded-xl border-2 border-gray-200 p-6 animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/6 mb-6"></div>
                        <div className="h-10 bg-gray-200 rounded w-32"></div>
                    </div>

                    {/* Right Column Skeleton */}
                    <div className="bg-white rounded-xl border-2 border-gray-200 p-6 animate-pulse">
                        {/* Info Section */}
                        <div className="mb-4">
                            <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-40 mb-6"></div>
                        </div>

                        {/* Calendar Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-6 bg-gray-200 rounded w-32"></div>
                            <div className="flex gap-2">
                                <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                                <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-2 mb-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="h-4 bg-gray-200 rounded"></div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                            {Array.from({ length: 35 }).map((_, idx) => (
                                <div key={idx} className="aspect-square bg-gray-200 rounded-lg"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
