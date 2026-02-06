/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import BlogDetailsContent from '@/components/pages/blog-details-content'
import { Metadata } from 'next'

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const { slug } = await params
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/slug/${slug}`, {
            cache: 'no-store'
        })

        if (!res.ok) {
            throw new Error('Failed to fetch blog')
        }

        const blog = await res.json()

        return {
            title: `${blog.data.title} || Beyond Tax Consultants`,
            description: blog.data.excerpt || blog.data.title,
            openGraph: {
                title: blog.data.title,
                description: blog.data.excerpt,
                images: [blog.data.featured_image],
            },
        }
    } catch (error) {
        return {
            title: 'Blog Post || Beyond Tax Consultants',
            description: 'Read our latest insights and articles',
        }
    }
}

export default async function BlogDetailPage({ params }: Props) {
    const { slug } = await params
    return <BlogDetailsContent slug={slug} />
}