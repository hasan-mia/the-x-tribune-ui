import NewsCard from "@/components/news-card/news-card"
import NewsCardSmall from "@/components/news-card/news-card-small"

export default function LeadNews() {
  return (
    <section className="bg-background py-6">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Lead News */}
          <div className="md:col-span-2 space-y-4">
            <NewsCard
              image="/featured-news-article.jpg"
              title="বছরের ব্যবধানে সিআরএমের জনপ্রিয়তা বেড়েছে ৪৭০ শতাংশ!"
              href="#"
              large
            />

            <div className="grid grid-cols-1 gap-3">
              <NewsCardSmall image="/news-thumbnail.png" title="সাভারে ৬ ছাত্র হত্যায় ১৩ আসামির মৃত্যুদণ্ড" href="#" />
              <NewsCardSmall
                image="/news-story.jpg"
                title="রাষ্ট্রায়ত্ত প্রতিষ্ঠানে নতুন নেতৃত্ব নির্বাচন সম্পন্ন"
                href="#"
              />
            </div>
          </div>

          {/* Sidebar - Latest and Popular News */}
          <div className="md:col-span-1">
            <div className="bg-card border border-border">
              <div className="flex border-b border-border">
                <button className="flex-1 py-3 px-4 border-b-2 border-primary text-primary font-bold text-center">
                  সর্বশেষ
                </button>
                <button className="flex-1 py-3 px-4 text-foreground font-bold text-center hover:text-primary transition">
                  পাঠক প্রিয়
                </button>
              </div>

              <div className="divide-y divide-border max-h-96 overflow-y-auto">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="p-3 hover:bg-secondary transition">
                    <h4 className="text-sm font-semibold text-foreground hover:text-primary line-clamp-2">
                      শেয়ারবাজারে সরকারের সুনজর অল্প দিনের মধ্যেই বুঝা যাবে
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
