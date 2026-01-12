import { Metadata } from 'next';
import BlogContent from '@/components/pages/blog-content';

export const metadata: Metadata = {
    title: "Blog || Beyond Tax Consultants – Professional Accounting & Tax Services",
    description: "Beyond Tax Consultants provides professional accounting and tax services for businesses and individuals.",
    keywords: ["tax", "accounting", "consulting", "business services"],
    authors: [{ name: "Beyond Tax Consultants" }],
}

export default function BlogPage() {
    return <BlogContent />;
}