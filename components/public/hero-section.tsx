"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Award, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useGetActiveHeroes } from '@/api/hero';

// Skeleton Loader Component
function HeroSkeleton() {
  return (
    <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 animate-pulse" />

      <div className="relative h-full flex items-center px-4">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-3xl space-y-8">
            {/* Badge skeleton */}
            <div className="inline-flex h-10 w-64 rounded-full bg-white/10 animate-pulse" />

            {/* Title skeleton */}
            <div className="space-y-4">
              <div className="h-16 w-full max-w-2xl bg-white/20 rounded-lg animate-pulse" />
              <div className="h-16 w-3/4 bg-white/20 rounded-lg animate-pulse" />
            </div>

            {/* Description skeleton */}
            <div className="space-y-3">
              <div className="h-8 w-full max-w-xl bg-white/15 rounded animate-pulse" />
              <div className="h-8 w-2/3 bg-white/15 rounded animate-pulse" />
            </div>

            {/* Buttons skeleton */}
            <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
              <div className="h-14 w-64 bg-white/20 rounded-lg animate-pulse" />
              <div className="h-14 w-48 bg-white/10 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Dots skeleton */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-10">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-2 w-2 rounded-full bg-white/30 animate-pulse" />
        ))}
      </div>
    </section>
  );
}

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const { data, isLoading, isError } = useGetActiveHeroes();

  // Extract hero slides from API response
  const heroSlides = data?.data || [];

  React.useEffect(() => {
    if (heroSlides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Show skeleton while loading
  if (isLoading) {
    return <HeroSkeleton />;
  }

  // Show error state or fallback
  if (isError || heroSlides.length === 0) {
    return (
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h2 className="text-3xl font-bold mb-4">Welcome to Our Accounting Services</h2>
          <p className="text-xl text-white/80">Expert financial solutions for your business</p>
        </div>
      </section>
    );
  }

  const currentHero = heroSlides[currentSlide];

  return (
    <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
      {/* Background Image Slider */}
      <div className="absolute inset-0">
        {heroSlides.map((slide: { id: React.Key | null | undefined; image_url: string | Blob | undefined; image_alt: string | undefined; }, index: number) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === index ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <img
              src={slide.image_url}
              alt={slide.image_alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center px-4">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-3xl space-y-8">
            {currentHero.badge_text && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium border border-white/20">
                <Award className="h-4 w-4" />
                <span>{currentHero.badge_text}</span>
              </div>
            )}

            <h1 className="text-3xl md:text-7xl font-bold tracking-tight text-white leading-tight">
              {currentHero.title}
            </h1>

            <p className="text-base md:text-2xl text-white/90 leading-relaxed">
              {currentHero.description}
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
              <Button
                size="lg"
                className="text-lg px-8 h-14 shadow-xl hover:cursor-pointer"
                onClick={() => router.push(currentHero.primary_btn_link)}
              >
                {currentHero.primary_btn_text}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 h-14 bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white backdrop-blur-sm"
                onClick={() => router.push(currentHero.secondary_btn_link)}
              >
                {currentHero.secondary_btn_text}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Navigation Dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-10">
        {heroSlides.map((slide: { id: React.Key | null | undefined; }, index: number) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${currentSlide === index ? 'w-12 bg-white' : 'w-2 bg-white/50 hover:bg-white/70'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slider Arrow Controls */}
      {heroSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
            aria-label="Previous slide"
          >
            <ArrowRight className="h-6 w-6 rotate-180" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
            aria-label="Next slide"
          >
            <ArrowRight className="h-6 w-6" />
          </button>
        </>
      )}
    </section>
  );
}