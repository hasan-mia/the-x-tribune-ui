/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useEffect } from "react"
declare global {
  interface Window {
    lightbox?: {
      option: (options: Record<string, any>) => void
    }
  }
}

const galleryImages = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  src: `/placeholder.svg?height=800&width=800&query=gallery image ${i + 1}`,
  thumb: `/placeholder.svg?height=400&width=400&query=gallery image ${i + 1}`,
  alt: `Gallery image ${i + 1}`,
}))

export default function Gallery() {
  useEffect(() => {
    // Load jQuery (required by Lightbox2)
    const jqueryScript = document.createElement('script')
    jqueryScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js'
    jqueryScript.async = false
    document.body.appendChild(jqueryScript)

    jqueryScript.onload = () => {
      // Load Lightbox2 CSS
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.4/css/lightbox.min.css'
      document.head.appendChild(link)

      // Load Lightbox2 JS after jQuery
      const lightboxScript = document.createElement('script')
      lightboxScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.4/js/lightbox.min.js'
      lightboxScript.async = false
      document.body.appendChild(lightboxScript)

      lightboxScript.onload = () => {
        // Configure Lightbox2 options
        if (window.lightbox) {
          window.lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true,
            'albumLabel': 'Image %1 of %2',
            'fadeDuration': 600,
            'imageFadeDuration': 600
          })
        }
      }
    }

    return () => {
      // Cleanup
      const scripts = document.querySelectorAll('script[src*="jquery"], script[src*="lightbox"]')
      scripts.forEach(script => script.remove())
      const links = document.querySelectorAll('link[href*="lightbox"]')
      links.forEach(link => link.remove())
    }
  }, [])

  return (
    <section className="container mx-auto bg-white py-12 border-t border-gray-200 px-4">
      <div className="cat-title-two mb-4">
        <h1 className="text-3xl font-bold">
          <a href="single.html" className="text-gray-900 hover:text-blue-600">
            মিডিয়া গ্যালারি
          </a>
        </h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {galleryImages.map((image) => (
          <a
            key={image.id}
            href={image.src}
            data-lightbox="gallery"
            data-title={image.alt}
            className="aspect-square overflow-hidden rounded-lg group block shadow-md hover:shadow-xl transition-shadow"
          >
            <img
              src={image.thumb || "/placeholder.svg"}
              alt={image.alt}
              className="w-full h-full object-cover group-hover:scale-110 group-hover:opacity-90 transition-all duration-300"
            />
          </a>
        ))}
      </div>
    </section>
  )
}