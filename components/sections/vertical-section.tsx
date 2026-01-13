import VerticalAds from "../ads/vertical-ads"
import CategoryTitle from "../category-title/category-title"
import HorizontalCard from "../content-card/horizontal-card"
import VerticalCard from "../content-card/vertical-card"

export default function VerticalSection() {
  const newsArticles = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop",
      title: "বছরের ব্যবধানে সিঙ্গারএমের জনপ্রিয়তা বেড়েছে ৪১০ শতাংশ!",
      isLarge: false,
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop",
      title: "বছরের ব্যবধানে সিঙ্গারএমের জনপ্রিয়তা বেড়েছে ৪১০ শতাংশ!",
      isLarge: false,
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop",
      title: "বছরের ব্যবধানে সিঙ্গারএমের জনপ্রিয়তা বেড়েছে ৪১০ শতাংশ!",
      isLarge: false,
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop",
      title: "বছরের ব্যবধানে সিঙ্গারএমের জনপ্রিয়তা বেড়েছে ৪১০ শতাংশ!",
      isLarge: false,
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop",
      title: "বছরের ব্যবধানে সিঙ্গারএমের জনপ্রিয়তা বেড়েছে ৪১০ শতাংশ!",
      isLarge: false,
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop",
      title: "বছরের ব্যবধানে সিঙ্গারএমের জনপ্রিয়তা বেড়েছে ৪১০ শতাংশ!",
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
            {/* Left Column */}
            <div className="space-y-4">
              {/* Large Featured Article */}
              <VerticalCard article={newsArticles[0]} />

              {/* Two Small Articles */}
              <div className="space-y-3">
                {newsArticles.slice(1, 4).map((article) => (
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
    </section >
  )
}