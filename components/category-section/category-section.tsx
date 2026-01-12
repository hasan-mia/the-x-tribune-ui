import NewsCard from "@/components/news-card/news-card"

interface CategorySectionProps {
  title: string
  category: string
}

export default function CategorySection({ title, category }: CategorySectionProps) {
  const articles = Array.from({ length: 3 }).map((_, i) => ({
    id: i + 1,
    title: `${title} নিউজ ${i + 1}: গুরুত্বপূর্ণ খবর এখানে আসবে এবং দীর্ঘ হতে পারে`,
    image: `/placeholder.svg?height=200&width=400&query=${category} news ${i + 1}`,
  }))

  return (
    <section className="bg-background py-8 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground border-b-2 border-primary pb-3 inline-block">{title}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <NewsCard key={article.id} image={article.image} title={article.title} href="#" />
          ))}
        </div>
      </div>
    </section>
  )
}
