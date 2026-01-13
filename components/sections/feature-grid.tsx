"use client"

import HorizontalCard from "../content-card/horizontal-card"
import VerticalCard from "../content-card/vertical-card"

const newsArticles = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=400&fit=crop",
        title: "বাংলার ব্যবসায়ে সিঙ্গারএমের জনপ্রিয়তা বেড়েছে ৪১০ শতাংশ!",
        isLarge: true,
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=300&h=200&fit=crop",
        title: "সাভারে ও ছায়া হযায়া ১৩ আসামির মুক্তলাভ",
        isSmall: true,
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=300&h=200&fit=crop",
        title: "সাভারে ও ছায়া হযায়া ১৩ আসামির মুক্তলাভ 2",
        isSmall: true,
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop",
        title: "বাংলার ব্যবসায়ে সিঙ্গারএমের জনপ্রিয়তা বেড়েছে ৪১০ শতাংশ! 1",
        isLarge: false,
    },
    {
        id: 5,
        image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop",
        title: "বাংলার ব্যবসায়ে সিঙ্গারএমের জনপ্রিয়তা বেড়েছে ৪১০ শতাংশ! 2",
        isLarge: false,
    },
]

export default function FeatureGrid() {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-4">
                    {/* Large Featured Article */}
                    <VerticalCard article={newsArticles[0]} />

                    {/* Two Small Articles */}
                    <div className="space-y-3">
                        {newsArticles.slice(1, 3).map((article) => (
                            <HorizontalCard key={article.id} article={article} />
                        ))}
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    {newsArticles.slice(3, 5).map((article) => (
                        <VerticalCard key={article.id} article={article} />
                    ))}
                </div>
            </div>
        </div>
    )
}