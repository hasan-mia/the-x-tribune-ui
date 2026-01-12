import NewsCard from "@/components/news-card/news-card"

interface CardGridProps {
  title: string
  subtitle?: string
  itemCount?: number
}

export default function CardGrid({ title, itemCount = 3 }: CardGridProps) {
  return (
    <section className="bg-background py-6 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground border-b-2 border-primary pb-3 inline-block">{title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: itemCount }).map((_, i) => (
            <NewsCard
              key={i}
              image={`/placeholder.svg?height=200&width=400&query=${title} news ${i + 1}`}
              title={`${title} - গুরুত্বপূর্ণ খবর ${i + 1}`}
              href="#"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
