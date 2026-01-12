import { formatDate } from '@/utils/helper'
import { Calendar, Clock } from 'lucide-react'
import Link from 'next/link'

export default function BlogCard({ post }: { post: any }) {
    return (
        <Link href={`/blog/${post.slug}`}>
            <div className="group bg-card border rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 h-full">
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span
                        className="absolute top-3 left-3 px-2.5 py-1 rounded text-white text-xs font-medium"
                        style={{ backgroundColor: post.category.color }}
                    >
                        {post.category.name}
                    </span>
                </div>
                <div className="p-5">
                    <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {post.excerpt || post.meta_description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(post.published_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{post.read_time}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
