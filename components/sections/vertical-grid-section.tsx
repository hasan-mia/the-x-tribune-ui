import VerticalAds from "../ads/vertical-ads"
import CategoryTitle from "../category-title/category-title"
import HorizontalCard from "../content-card/horizontal-card"
import OnOverCardWithContent from "../content-card/on-over-card-content"

export default function VerticalGridSection() {
  const newsArticles = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop",
      title: "বছরের ব্যবধানে সিঙ্গারএমের জনপ্রিয়তা বেড়েছে ৪১০ শতাংশ!",
      description: "ওয়ার্ল্ড ট্রিবিউন, ঢাকা: রাষ্ট্রায়ত্ত বিনিয়োগকারী প্রতিষ্ঠান ইনভেস্টমেন্ট কর্পোরেশন অব বাংলাদেশ (আইসিবি) এর কর্মকর্তা সমিতির ১৮ তম কার্যনিবাহী পরিষদ নির্বাচন গত ২ ডিসেম্বর ২০২১, বৃহস্পতিবার আইসিবি এর প্রধান কার্যালয় এবং শাখা",
      isLarge: false,
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop",
      title: "বছরের ব্যবধানে সিঙ্গারএমের জনপ্রিয়তা বেড়েছে ৪১০ শতাংশ!",
      description: "ওয়ার্ল্ড ট্রিবিউন, ঢাকা: রাষ্ট্রায়ত্ত বিনিয়োগকারী প্রতিষ্ঠান ইনভেস্টমেন্ট কর্পোরেশন অব বাংলাদেশ (আইসিবি) এর কর্মকর্তা সমিতির ১৮ তম কার্যনিবাহী পরিষদ নির্বাচন গত ২ ডিসেম্বর ২০২১, বৃহস্পতিবার আইসিবি এর প্রধান কার্যালয় এবং শাখা",
      isLarge: false,
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop",
      title: "বছরের ব্যবধানে সিঙ্গারএমের জনপ্রিয়তা বেড়েছে ৪১০ শতাংশ!",
      description: "বছরের ব্যবধানে সিঙ্গারএমের জনপ্রিয়তা বেড়েছে ৪১০ শতাংশ!",
      isLarge: false,
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop",
      title: "বছরের ব্যবধানে সিঙ্গারএমের জনপ্রিয়তা বেড়েছে ৪১০ শতাংশ!",
      description: "বছরের ব্যবধানে সিঙ্গারএমের জনপ্রিয়তা বেড়েছে ৪১০ শতাংশ!",
      isLarge: false,
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop",
      title: "বছরের ব্যবধানে সিঙ্গারএমের জনপ্রিয়তা বেড়েছে ৪১০ শতাংশ!",
      description: "বছরের ব্যবধানে সিঙ্গারএমের জনপ্রিয়তা বেড়েছে ৪১০ শতাংশ!",
      isLarge: false,
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop",
      title: "বছরের ব্যবধানে সিঙ্গারএমের জনপ্রিয়তা বেড়েছে ৪১০ শতাংশ!",
      description: "বছরের ব্যবধানে সিঙ্গারএমের জনপ্রিয়তা বেড়েছে ৪১০ শতাংশ!",
      isLarge: false,
    },
  ]

  return (
    <section className="bg-card">
      <div className="container mx-auto p-4 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - 3x2 Grid of News Cards */}
          <div className="lg:col-span-3">
            <CategoryTitle title="জাতীয়" href="/#" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <OnOverCardWithContent article={newsArticles[0]} />

              <div className="grid grid-cols-1">
                {newsArticles.slice(1, 5).map((article) => (
                  <HorizontalCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Advertisement */}
          <div className="lg:col-span-1">
            <VerticalAds />
          </div>
        </div>
      </div>
    </section>
  )
}