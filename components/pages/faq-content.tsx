"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Search,
    ChevronDown,
    ChevronUp,
    MessageCircle,
    Phone,
    Mail,
    ArrowRight,
} from 'lucide-react';
import { useGetAllFaq } from '@/api/faq';

export default function FAQContent() {
    const { data: faqData, isLoading } = useGetAllFaq();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [openItems, setOpenItems] = useState<string[]>([]);

    const faqs = faqData?.data || [];

    // Get unique categories
    const categories = ['all', ...new Set(faqs.map((faq: any) => faq.category))];

    // Filter FAQs based on search and category
    const filteredFaqs = faqs.filter((faq: any) => {
        const matchesSearch =
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
        return matchesSearch && matchesCategory && faq.is_active;
    });

    // Group FAQs by category for display
    const groupedFaqs = filteredFaqs.reduce((acc: any, faq: any) => {
        if (!acc[faq.category]) {
            acc[faq.category] = [];
        }
        acc[faq.category].push(faq);
        return acc;
    }, {});

    const toggleItem = (id: string) => {
        setOpenItems(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const getCategoryLabel = (category: string) => {
        return category.charAt(0).toUpperCase() + category.slice(1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            {/* Hero Section */}
            <section className="relative py-10 px-4 bg-gradient-to-br from-primary via-primary to-blue-700 text-primary-foreground overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />

                <div className="relative max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center p-2 bg-white/10 rounded-full mb-6">
                        <MessageCircle className="h-8 w-8" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-xl opacity-95 mb-8 max-w-2xl mx-auto">
                        Find answers to common questions about our accounting services, pricing, and how we can help your business succeed.
                    </p>
                </div>
            </section>

            {/* Search and Filter Section */}
            <section className="py-8 px-4 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-card rounded-xl shadow-lg p-6 border">
                        {/* Search Bar */}
                        <div className="relative mb-6">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search for answers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedCategory(category as string)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                                        ? 'bg-primary text-primary-foreground shadow-md'
                                        : 'bg-muted hover:bg-muted/80'
                                        }`}
                                >
                                    {getCategoryLabel(category as string)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="bg-card rounded-lg p-6 border animate-pulse">
                                    <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                                    <div className="h-4 bg-muted rounded w-full"></div>
                                </div>
                            ))}
                        </div>
                    ) : filteredFaqs.length === 0 ? (
                        <div className="text-center py-16">
                            <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-2xl font-semibold mb-2">No results found</h3>
                            <p className="text-muted-foreground mb-6">
                                Try adjusting your search or filter to find what you're looking for.
                            </p>
                            <Button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                                Clear Filters
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {Object.entries(groupedFaqs).map(([category, categoryFaqs]: [string, any]) => (
                                <div key={category}>
                                    {selectedCategory === 'all' && (
                                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                            <span className="h-8 w-1 bg-primary rounded-full"></span>
                                            {getCategoryLabel(category)}
                                        </h2>
                                    )}
                                    <div className="space-y-3">
                                        {categoryFaqs
                                            .sort((a: any, b: any) => a.sort_order - b.sort_order)
                                            .map((faq: any) => (
                                                <div
                                                    key={faq.id}
                                                    className="bg-card rounded-lg border transition-all hover:shadow-md"
                                                >
                                                    <button
                                                        onClick={() => toggleItem(faq.id)}
                                                        className="w-full px-6 py-5 text-left flex items-start justify-between gap-4 group"
                                                    >
                                                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors flex-1">
                                                            {faq.question}
                                                        </h3>
                                                        {openItems.includes(faq.id) ? (
                                                            <ChevronUp className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                                                        ) : (
                                                            <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                                                        )}
                                                    </button>
                                                    {openItems.includes(faq.id) && (
                                                        <div className="px-6 pb-5 pt-0">
                                                            <div className="h-px bg-border mb-4"></div>
                                                            <p className="text-muted-foreground leading-relaxed">
                                                                {faq.answer}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Still Have Questions Section */}
            <section className="py-16 px-4 bg-muted/30">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-gradient-to-br from-primary via-primary to-blue-700 text-primary-foreground rounded-2xl p-8 md:p-12 relative overflow-hidden">
                        <div className="absolute inset-0 bg-grid-white/10"></div>
                        <div className="relative">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Still have questions?
                            </h2>
                            <p className="text-lg opacity-95 mb-8 max-w-2xl">
                                Can't find the answer you're looking for? Our friendly team is here to help you with any questions you may have.
                            </p>

                            <div className="grid md:grid-cols-3 gap-4">
                                <Link href="/contact" className="block">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all group">
                                        <Mail className="h-8 w-8 mb-3" />
                                        <h3 className="font-semibold mb-1">Send us an email</h3>
                                        <p className="text-sm opacity-90 mb-2">We'll respond within 24 hours</p>
                                        <span className="text-sm font-medium group-hover:underline inline-flex items-center">
                                            Contact Us <ArrowRight className="h-4 w-4 ml-1" />
                                        </span>
                                    </div>
                                </Link>

                                <a href="tel:5551234567" className="block">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all group">
                                        <Phone className="h-8 w-8 mb-3" />
                                        <h3 className="font-semibold mb-1">Give us a call</h3>
                                        <p className="text-sm opacity-90 mb-2">Mon-Fri 9am-5pm EST</p>
                                        <span className="text-sm font-medium group-hover:underline inline-flex items-center">
                                            (555) 123-4567 <ArrowRight className="h-4 w-4 ml-1" />
                                        </span>
                                    </div>
                                </a>

                                <Link href="/contact" className="block">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all group">
                                        <MessageCircle className="h-8 w-8 mb-3" />
                                        <h3 className="font-semibold mb-1">Schedule consultation</h3>
                                        <p className="text-sm opacity-90 mb-2">Free 30-minute session</p>
                                        <span className="text-sm font-medium group-hover:underline inline-flex items-center">
                                            Book Now <ArrowRight className="h-4 w-4 ml-1" />
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}