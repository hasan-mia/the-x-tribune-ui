/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React from 'react';
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, Search, ArrowRight, Loader2, BookOpen } from 'lucide-react'
import { useGeActiveBlogs } from '@/api/blog'
import { useCategories } from '@/api/category'
import PageHero from '../shared/page-hero'
import Subscriber from '../public/subscriber'

export default function BlogContent() {
    const [page, setPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [debouncedSearch, setDebouncedSearch] = useState('')

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery)
            setPage(1) // Reset to first page on search
        }, 500)
        return () => clearTimeout(timer)
    }, [searchQuery])

    // Build filters object for the API
    const filters = {
        page: page,
        limit: 6,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(selectedCategory !== 'All' && { category_id: selectedCategory })
    }

    // Pass filters to the hook
    const { data: blogsData, isLoading: blogsLoading } = useGeActiveBlogs(true, filters)
    const { data: categoriesData, isLoading: categoriesLoading } = useCategories(true)

    const blogs = blogsData?.data?.blogs || []
    const pagination = blogsData?.data?.pagination || { total: 0, page: 1, totalPages: 1 }
    const categories = categoriesData?.data || []
    const featuredPost = blogs.find((post: any) => post.is_featured)

    const handleLoadMore = () => {
        if (page < pagination.totalPages) {
            setPage(prev => prev + 1)
        }
    }

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategory(categoryId)
        setPage(1) // Reset to first page on category change
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return (
        <div className="min-h-screen">

            <PageHero
                icon={BookOpen}
                badge="Blogs"
                title="Insights & Updates"
                description="Stay updated with the latest tax tips, accounting insights, and financial strategies from our expert team."
            />

            {/* Categories Filter */}
            <section className="border-b bg-card sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    {categoriesLoading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm text-muted-foreground">Loading categories...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                            <button
                                onClick={() => handleCategoryChange('All')}
                                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${selectedCategory === 'All'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted hover:bg-muted/80'
                                    }`}
                            >
                                All
                            </button>
                            {categories.map((category: any) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryChange(category.id)}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${selectedCategory === category.id
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted hover:bg-muted/80'
                                        }`}
                                    style={
                                        selectedCategory === category.id
                                            ? { backgroundColor: category.color }
                                            : undefined
                                    }
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Featured Post */}
            {featuredPost && selectedCategory === 'All' && !searchQuery && (
                <section className="py-16 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold">Featured Article</h2>
                        </div>
                        <Link href={`/blog/${featuredPost.slug}`}>
                            <div className="group grid md:grid-cols-2 gap-8 bg-card border rounded-2xl overflow-hidden hover:shadow-lg transition-all">
                                <div className="relative h-64 md:h-auto overflow-hidden">
                                    <img
                                        src={featuredPost.featured_image}
                                        alt={featuredPost.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                                            Featured
                                        </span>
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col justify-center">
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                        <span
                                            className="px-3 py-1 rounded-full text-white font-medium"
                                            style={{ backgroundColor: featuredPost.category.color }}
                                        >
                                            {featuredPost.category.name}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>{formatDate(featuredPost.published_at)}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                                        {featuredPost.title}
                                    </h3>
                                    <p className="text-muted-foreground mb-6 leading-relaxed">
                                        {featuredPost.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                {featuredPost.author.avatar ? (
                                                    <img
                                                        src={featuredPost.author.avatar}
                                                        alt={featuredPost.author.first_name}
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <User className="h-5 w-5 text-primary" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">
                                                    {featuredPost.author.first_name} {featuredPost.author.last_name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">{featuredPost.read_time}</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </section>
            )}

            {/* Blog Grid */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="text-3xl font-bold">
                            {selectedCategory === 'All'
                                ? 'Latest Articles'
                                : `${categories.find((c: any) => c.id === selectedCategory)?.name || ''} Articles`}
                        </h2>
                        <p className="text-muted-foreground">
                            {pagination.total} article{pagination.total !== 1 ? 's' : ''}
                        </p>
                    </div>

                    {blogsLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : blogs.length > 0 ? (
                        <>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {blogs.map((post: any) => (
                                    <Link key={post.id} href={`/blog/${post.slug}`}>
                                        <article className="group bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all h-full flex flex-col">
                                            <div className="relative h-48 overflow-hidden">
                                                <img
                                                    src={post.featured_image}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute top-4 left-4">
                                                    <span
                                                        className="px-3 py-1 rounded-full text-white text-xs font-semibold"
                                                        style={{ backgroundColor: post.category.color }}
                                                    >
                                                        {post.category.name}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-6 flex flex-col flex-grow">
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>{formatDate(post.published_at)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        <span>{post.read_time}</span>
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                                    {post.title}
                                                </h3>
                                                <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow">
                                                    {post.excerpt}
                                                </p>
                                                <div className="flex items-center justify-between pt-4 border-t">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                            {post.author.avatar ? (
                                                                <img
                                                                    src={post.author.avatar}
                                                                    alt={post.author.first_name}
                                                                    className="w-full h-full rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                <User className="h-4 w-4 text-primary" />
                                                            )}
                                                        </div>
                                                        <span className="text-sm font-medium">
                                                            {post.author.first_name} {post.author.last_name}
                                                        </span>
                                                    </div>
                                                    <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>

                            {/* Load More Button */}
                            {page < pagination.totalPages && (
                                <div className="mt-12 text-center">
                                    <Button
                                        onClick={handleLoadMore}
                                        disabled={blogsLoading}
                                        size="lg"
                                        variant="outline"
                                        className="px-8"
                                    >
                                        {blogsLoading ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Loading...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                Load More Articles
                                                <ArrowRight className="h-4 w-4" />
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
                                <Search className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                            <p className="text-muted-foreground mb-6">
                                Try adjusting your search or filter to find what you&apos;re looking for.
                            </p>
                            <Button
                                onClick={() => {
                                    setSearchQuery('')
                                    setSelectedCategory('All')
                                }}
                                variant="outline"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter CTA */}
            <Subscriber />
        </div>
    )
}