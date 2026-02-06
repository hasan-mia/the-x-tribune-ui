/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React from 'react';
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, ArrowLeft, Bookmark, Facebook, Twitter, Linkedin, Mail, ChevronRight, Loader2, Eye } from 'lucide-react'
import { useGetSingleBlog, useGetRelateBlogs, useGetPopularBlogs } from '@/api/blog'
import { formatDate } from '@/utils/helper'
import { useState } from 'react'
import BlogCard from '../public/blog-card'

export default function BlogDetailsContent({ slug }: { slug: string }) {
    const [bookmarked, setBookmarked] = useState(false)

    // Fetch single blog
    const { data: blogData, isLoading } = useGetSingleBlog(slug)

    // Fetch related blogs (only if we have a blog ID)
    const { data: relatedBlogsData, isLoading: isLoadingRelated } = useGetRelateBlogs(
        blogData?.data?.id || '',
        !!blogData?.data?.id
    )

    // Fetch popular blogs
    const { data: popularBlogsData, isLoading: isLoadingPopular } = useGetPopularBlogs()

    const post = blogData?.data
    const relatedBlogs = relatedBlogsData?.data || []
    const popularBlogs = popularBlogsData?.data || []

    // Share functionality
    const handleShare = (platform: string) => {
        if (!post) return

        const url = typeof window !== 'undefined' ? window.location.href : ''
        const title = encodeURIComponent(post.title)
        const description = encodeURIComponent(post.meta_description || post.title)

        const shareUrls: { [key: string]: string } = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${title}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            email: `mailto:?subject=${title}&body=${description}%0A%0A${encodeURIComponent(url)}`
        }

        if (platform === 'email') {
            window.location.href = shareUrls[platform]
        } else {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400')
        }
    }

    const handleBookmark = () => {
        setBookmarked(!bookmarked)
        // Add your bookmark logic here (localStorage, API call, etc.)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
                    <p className="text-muted-foreground mb-8">The article you&apos;re looking for doesn&apos;t exist.</p>
                    <Link href="/blog">
                        <Button>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Blog
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="relative h-[50vh] min-h-[400px] max-h-[600px] overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
                <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                {/* Breadcrumb */}
                <div className="absolute top-6 left-0 right-0 px-4">
                    <div className="max-w-7xl mx-auto">
                        <Link href="/blog" className="inline-flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Articles
                        </Link>
                    </div>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-8">
                    <div className="max-w-7xl mx-auto">
                        <span
                            className="inline-block px-3 py-1.5 rounded text-white text-sm font-medium mb-4"
                            style={{ backgroundColor: post.category.color }}
                        >
                            {post.category.name}
                        </span>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight max-w-7xl">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center">
                                    {post.author.avatar ? (
                                        <img
                                            src={post.author.avatar}
                                            alt={post.author.first_name}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <User className="h-4 w-4" />
                                    )}
                                </div>
                                <span className="font-medium">
                                    {post.author.first_name} {post.author.last_name}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(post.published_at)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{post.read_time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                <span>{post.view_count.toLocaleString()} views</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <article className="py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-[1fr_280px] gap-12">
                        {/* Article Content */}
                        <div>
                            {/* Share Bar */}
                            <div className="flex items-center justify-between mb-8 pb-6 border-b">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-muted-foreground">Share:</span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleShare('facebook')}
                                            className="h-9 w-9 rounded-full border bg-background hover:bg-primary hover:text-white hover:border-primary flex items-center justify-center transition-all"
                                            aria-label="Share on Facebook"
                                        >
                                            <Facebook className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleShare('twitter')}
                                            className="h-9 w-9 rounded-full border bg-background hover:bg-primary hover:text-white hover:border-primary flex items-center justify-center transition-all"
                                            aria-label="Share on Twitter"
                                        >
                                            <Twitter className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleShare('linkedin')}
                                            className="h-9 w-9 rounded-full border bg-background hover:bg-primary hover:text-white hover:border-primary flex items-center justify-center transition-all"
                                            aria-label="Share on LinkedIn"
                                        >
                                            <Linkedin className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleShare('email')}
                                            className="h-9 w-9 rounded-full border bg-background hover:bg-primary hover:text-white hover:border-primary flex items-center justify-center transition-all"
                                            aria-label="Share via Email"
                                        >
                                            <Mail className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={handleBookmark}
                                    className={`h-9 px-4 rounded-full border flex items-center gap-2 transition-all ${bookmarked
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-background hover:bg-primary hover:text-white hover:border-primary'
                                        }`}
                                >
                                    <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
                                    <span className="text-sm font-medium">{bookmarked ? 'Saved' : 'Save'}</span>
                                </button>
                            </div>

                            {/* Article Body */}
                            <div
                                className="prose prose-lg max-w-none 
                                prose-headings:font-bold prose-headings:text-foreground
                                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 
                                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                                prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-5
                                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                                prose-strong:text-foreground prose-strong:font-semibold
                                prose-ul:my-6 prose-ol:my-6
                                prose-li:text-muted-foreground prose-li:my-2
                                prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r
                                prose-img:rounded-lg prose-img:my-8
                                prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                                prose-pre:bg-muted prose-pre:border"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />

                            {/* Tags */}
                            {post.tags && post.tags.length > 0 && (
                                <div className="mt-12 pt-8 border-t">
                                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">TAGS</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {post.tags.map((tag: any) => (
                                            <Link
                                                key={tag.id}
                                                href={`/blog?tag=${tag.id}`}
                                                className="px-3 py-1.5 rounded-full border bg-background text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all"
                                            >
                                                #{tag.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside className="space-y-6">
                            {/* Author Card */}
                            <div className="bg-card border rounded-lg p-6 sticky top-24">
                                <div className="text-center mb-4">
                                    <div className="h-20 w-20 rounded-full border-2 border-primary/20 flex items-center justify-center mx-auto mb-3 overflow-hidden">
                                        {post.author.avatar ? (
                                            <img
                                                src={post.author.avatar}
                                                alt={post.author.first_name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="h-10 w-10 text-primary" />
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-base mb-1">
                                        {post.author.first_name} {post.author.last_name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">Author</p>
                                </div>
                                <Link href="/contact">
                                    <Button size="sm" className="w-full">Contact Author</Button>
                                </Link>
                            </div>

                            {/* Category Card */}
                            <div className="border rounded-lg p-5" style={{ backgroundColor: `${post.category.color}15` }}>
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="h-10 w-10 rounded flex items-center justify-center shrink-0" style={{ backgroundColor: post.category.color }}>
                                        <span className="text-white font-bold text-sm">{post.category.name.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm mb-1">{post.category.name}</h3>
                                        <p className="text-xs text-muted-foreground line-clamp-2">{post.category.description}</p>
                                    </div>
                                </div>
                                <Link href={`/blog?category=${post.category.id}`}>
                                    <Button variant="outline" size="sm" className="w-full text-xs">
                                        More in {post.category.name}
                                    </Button>
                                </Link>
                            </div>

                            {/* Newsletter */}
                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-5">
                                <h3 className="font-semibold text-sm mb-2">Newsletter</h3>
                                <p className="text-xs text-muted-foreground mb-4">
                                    Stay informed with our latest insights and updates.
                                </p>
                                <Link href="/blog">
                                    <Button size="sm" variant="outline" className="w-full text-xs">
                                        Subscribe
                                    </Button>
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </article>

            {/* Related Blogs Section */}
            {relatedBlogs.length > 0 && (
                <section className="py-12 px-4 bg-muted/30">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold mb-1">Related Articles</h2>
                                <p className="text-sm text-muted-foreground">Explore similar topics</p>
                            </div>
                            <Link href="/blog">
                                <Button variant="ghost" size="sm">
                                    View All
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </Link>
                        </div>

                        {isLoadingRelated ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {relatedBlogs.slice(0, 3).map((blog: any) => (
                                    <BlogCard key={blog.id} post={blog} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Popular Blogs Section */}
            {popularBlogs.length > 0 && (
                <section className="py-12 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold mb-1">Trending Articles</h2>
                                <p className="text-sm text-muted-foreground">Most read this month</p>
                            </div>
                            <Link href="/blog">
                                <Button variant="ghost" size="sm">
                                    View All
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </Link>
                        </div>

                        {isLoadingPopular ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {popularBlogs.slice(0, 3).map((blog: any) => (
                                    <BlogCard key={blog.id} post={blog} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-16 px-4 bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">Need Expert Guidance?</h2>
                    <p className="text-base text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Connect with our team of financial professionals for personalized advice tailored to your goals.
                    </p>
                    <Link href="/free-consultants">
                        <Button size="lg">
                            Schedule a Consultation
                            <ChevronRight className="h-5 w-5 ml-2" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}