import Link from "next/link"

interface NewsCardProps {
  image: string
  title: string
  href: string
  large?: boolean
}

export default function NewsCard({ image, title, href, large = false }: NewsCardProps) {
  return (
    <Link href={href}>
      <div className="bg-card border border-border hover:shadow-lg transition overflow-hidden group cursor-pointer">
        <div className={`relative overflow-hidden bg-muted ${large ? "h-64" : "h-40"}`}>
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        </div>
        <div className="p-4">
          <h3
            className={`font-bold text-foreground group-hover:text-primary transition ${
              large ? "text-lg line-clamp-3" : "text-sm line-clamp-2"
            }`}
          >
            {title}
          </h3>
        </div>
      </div>
    </Link>
  )
}
