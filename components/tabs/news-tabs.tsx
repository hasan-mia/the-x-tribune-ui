"use client"

import { useState } from "react"
import HorizontalCard from "../content-card/horizontal-card"

const newsData = {
    সর্বশেষ_সংবাদ: [
        {
            id: 1,
            image: "/placeholder.svg?height=80&width=120",
            title: "পেশাবাজারে সরকারের সুনজর আজ দিনের মধ্যেই বৃথা যাবে- বিএফআইসি চেয়ারম্যান",
        },
        {
            id: 2,
            image: "/placeholder.svg?height=80&width=120",
            title: "পোশাক কারখানাতে রাশিয়ার মহাযাত্রীয় চাইলো বিজিএমইএ",
        },
        {
            id: 3,
            image: "/placeholder.svg?height=80&width=120",
            title: "বাংলার ব্যবসায়ে সিঙ্গারএমের জনপ্রিয়তা বেড়েছে ৪১০ শতাংশ!",
        },
        {
            id: 4,
            image: "/placeholder.svg?height=80&width=120",
            title: "পোশাক কারখানাতে রাশিয়ার মহাযাত্রীয় চাইলো বিজিএমইএ",
        },
        {
            id: 5,
            image: "/placeholder.svg?height=80&width=120",
            title: "বাংলার ব্যবসায়ে সিঙ্গারএমের জনপ্রিয়তা বেড়েছে ৪১০ শতাংশ!",
        },
    ],
    পাঠক_প্রিয়: [
        {
            id: 1,
            image: "/placeholder.svg?height=80&width=120",
            title: "জনপ্রিয় খবর: প্রধানমন্ত্রীর নতুন ঘোষণা আগামীকাল",
        },
        {
            id: 2,
            image: "/placeholder.svg?height=80&width=120",
            title: "ক্রিকেট বিশ্বকাপে বাংলাদেশের দুর্দান্ত জয়",
        },
        {
            id: 3,
            image: "/placeholder.svg?height=80&width=120",
            title: "শেয়ারবাজারে ঊর্ধ্বমুখী ধারা অব্যাহত",
        },
        {
            id: 4,
            image: "/placeholder.svg?height=80&width=120",
            title: "নতুন শিক্ষানীতি ঘোষণা শিগগিরই",
        },
        {
            id: 5,
            image: "/placeholder.svg?height=80&width=120",
            title: "রাজধানীতে নতুন মেট্রোরেল লাইনের কাজ শুরু",
        },
    ],
}

export default function NewsTabs() {
    const [activeTab, setActiveTab] = useState<"সর্বশেষ_সংবাদ" | "পাঠক_প্রিয়">("সর্বশেষ_সংবাদ")

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-md mx-auto">
            {/* Tabs Header */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab("সর্বশেষ_সংবাদ")}
                    className={`flex-1 py-3 px-4 text-center font-bold text-base transition ${activeTab === "সর্বশেষ_সংবাদ"
                        ? "bg-red-700 text-white border-b-4 border-red-900"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    সর্বশেষ সংবাদ
                </button>
                <button
                    onClick={() => setActiveTab("পাঠক_প্রিয়")}
                    className={`flex-1 py-3 px-4 text-center font-bold text-base transition ${activeTab === "পাঠক_প্রিয়"
                        ? "bg-red-700 text-white border-b-4 border-red-900"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    পাঠক প্রিয়
                </button>
            </div>

            {/* Tabs Content */}
            <div className="max-h-96 overflow-y-auto">
                {newsData[activeTab].map((article) => (
                    <HorizontalCard key={article.id} article={article} />
                ))}
            </div>
        </div>
    )
}