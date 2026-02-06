"use client"

import { useGetActiveTestimonials } from "@/api/testimonial"
import { Star } from "lucide-react"
import { useEffect, useState } from "react"
import TestimonialSkeleton from "../shared/skelton/testimonial-skelton"

interface Testimonial {
  id: string
  name: string
  avatar: string | null
  role: string
  text: string
  rating: number
  displayOrder: number
}

export default function Testimonials() {
  const { data, isLoading, isError } = useGetActiveTestimonials()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const testimonials: Testimonial[] = data?.testimonials || []
  const itemsPerView = 3
  const totalSlides = Math.max(0, testimonials.length - itemsPerView + 1)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= itemsPerView) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length, itemsPerView, totalSlides])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
    setIsAutoPlaying(false)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${star <= rating
              ? "fill-amber-400 text-amber-400"
              : "text-gray-300"
              }`}
          />
        ))}
      </div>
    )
  }

  // Show skeletons while loading
  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-transparent to-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-[500px] mx-auto animate-pulse" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <TestimonialSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Show error state or no testimonials
  if (isError || testimonials.length === 0) {
    return null // Or return a fallback UI
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-transparent to-primary/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Client Success Stories</h2>
          <p className="text-xl text-muted-foreground">
            See what our clients have to say about working with us
          </p>
        </div>

        {/* Mobile: Grid View */}
        <div className="md:hidden grid gap-8">
          {testimonials.slice(0, 6).map((testimonial) => (
            <div key={testimonial.id} className="bg-card p-8 rounded-xl border shadow-sm">
              {renderStars(testimonial.rating)}

              <p className="text-muted-foreground mb-6 leading-relaxed italic">
                "{testimonial.text}"
              </p>

              <div className="border-t pt-4">
                <div className="flex items-center gap-3">
                  {testimonial.avatar ? (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-semibold text-primary">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-lg">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Carousel View */}
        <div className="hidden md:block relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {testimonials?.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-1/3 flex-shrink-0 px-4"
                >
                  <div className="bg-card p-8 rounded-xl border shadow-sm h-full flex flex-col">
                    {renderStars(testimonial.rating)}

                    <p className="text-muted-foreground mb-6 leading-relaxed italic flex-grow">
                      "{testimonial.text}"
                    </p>

                    <div className="border-t pt-4">
                      <div className="flex items-center gap-3">
                        {testimonial.avatar ? (
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="h-12 w-12 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-semibold text-primary">
                              {testimonial.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-lg">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {testimonials.length > itemsPerView && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors z-10"
                aria-label="Previous testimonials"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors z-10"
                aria-label="Next testimonials"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Dots Navigation */}
          {testimonials.length > itemsPerView && (
            <div className="flex justify-center gap-2 mt-8">
              {[...Array(totalSlides)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all ${index === currentIndex
                    ? "w-8 bg-primary"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}