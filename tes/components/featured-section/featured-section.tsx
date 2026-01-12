import NewsCard from "@/components/news-card/news-card"
import NewsCardSmall from "@/components/news-card/news-card-small"

export default function FeaturedSection() {
  return (
    <section className="bg-background py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Featured Articles */}
          <div className="md:col-span-2 space-y-4">
            {/* Large Featured Card */}
            <NewsCard
              image="/featured-breaking-news.jpg"
              title="বছরের ব্যবধানে সিআরএমের জনপ্রিয়তা বেড়েছে ৪৭০ শতাংশ!"
              href="#"
              large
            />

            {/* Two Small News Cards */}
            <div className="grid grid-cols-1 gap-3">
              <NewsCardSmall image="/news-thumbnail.png" title="সাভারে ৬ ছাত্র হত্যায় ১৩ আসামির মৃত্যুদণ্ড" href="#" />
              <NewsCardSmall
                image="/national-news.png"
                title="রাষ্ট্রায়ত্ত প্রতিষ্ঠানে নতুন নেতৃত্ব নির্বাচন সম্পন্ন"
                href="#"
              />
            </div>
          </div>

          {/* Right Sidebar - Tabs */}
          <div className="md:col-span-1">
            <div className="bg-card border border-border">
              <div className="flex border-b border-border">
                <button className="flex-1 py-3 px-4 border-b-2 border-primary text-primary font-bold text-center text-sm">
                  সর্বশেষ
                </button>
                <button className="flex-1 py-3 px-4 text-foreground font-bold text-center hover:text-primary transition text-sm">
                  পাঠক প্রিয়
                </button>
              </div>

              <div className="divide-y divide-border max-h-96 overflow-y-auto">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-3 hover:bg-secondary transition cursor-pointer border-l-4 border-transparent hover:border-primary"
                  >
                    <h4 className="text-xs font-semibold text-foreground hover:text-primary line-clamp-2">
                      শেয়ারবাজারে সরকারের সুনজর অল্প দিনের মধ্যেই বুঝা যাবে- {i + 1}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
