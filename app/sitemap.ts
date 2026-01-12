import { MetadataRoute } from 'next'

const BASE_URL = 'https://beyondtaxconsultants.com'
const API_URL = 'https://api.beyondtaxconsultants.com/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/privacy-policy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/terms-of-service`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
    ]

    let blogEntries: MetadataRoute.Sitemap = []
    let serviceEntries: MetadataRoute.Sitemap = []

    try {
        // Fetch blogs data
        const blogsResponse = await fetch(`${API_URL}/blogs`, {
            next: { revalidate: 3600 }
        })

        if (blogsResponse.ok) {
            const blogsData = await blogsResponse.json()
            // Blogs are in data.blogs array
            const blogs = blogsData?.data?.blogs || []

            blogEntries = blogs.map((blog: any) => ({
                url: `${BASE_URL}/blog/${blog.slug}`,
                lastModified: new Date(blog.updated_at),
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            }))
        }
    } catch (error) {
        console.error('Error fetching blogs:', error)
    }

    try {
        // Fetch services data
        const servicesResponse = await fetch(`${API_URL}/services`, {
            next: { revalidate: 3600 }
        })

        if (servicesResponse.ok) {
            const servicesData = await servicesResponse.json()
            // Services are directly in data array
            const services = servicesData?.data || []

            serviceEntries = services.map((service: any) => ({
                url: `${BASE_URL}/services/${service.slug}`,
                lastModified: new Date(service.updated_at),
                changeFrequency: 'daily' as const,
                priority: 0.8,
            }))
        }
    } catch (error) {
        console.error('Error fetching services:', error)
    }

    return [...staticPages, ...blogEntries, ...serviceEntries]
}