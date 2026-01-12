import Link from "next/link"

interface NewsCardSmallProps {
  image: string
  title: string
  href: string
}

export default function NewsCardSmall({ image, title, href }: NewsCardSmallProps) {
  return (
    <Link href={href}>
      <div className="flex gap-3 p-3 bg-card border border-border hover:bg-secondary transition group">
        <div className="w-20 h-20 flex-shrink-0 overflow-hidden bg-gray-200">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition line-clamp-3">
            {title}
          </h4>
        </div>
      </div>
    </Link>
  )
}
