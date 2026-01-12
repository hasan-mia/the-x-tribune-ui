"use client"

import { useState } from "react"
import { X } from "lucide-react"

const galleryImages = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  src: `/placeholder.svg?height=400&width=400&query=gallery image ${i + 1}`,
  alt: `Gallery image ${i + 1}`,
}))

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  return (
    <section className="bg-background py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white bg-gray-800 p-4 text-center">মিডিয়া গ্যালারি</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="aspect-square overflow-hidden rounded-lg cursor-pointer group"
              onClick={() => setSelectedImage(image.id)}
            >
              <img
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition"
              />
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-10 right-0 text-white hover:text-gray-300"
              >
                <X className="w-8 h-8" />
              </button>
              <img
                src={galleryImages.find((img) => img.id === selectedImage)?.src || "/placeholder.svg"}
                alt="Full size"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
