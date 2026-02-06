import React from "react"
import BannerAds from "@/components/ads/banner-ads"
import FeaturedSection from "@/components/sections/featured-section"
import ThreeColumnAds from "@/components/ads/three-column-ads"
import Gallery from "@/components/gallery/gallery"
import GridSection from "@/components/sections/grid-section"
import ThreeColumnVerticalSection from "@/components/sections/three-column-vertical-section"
import ThreeColumnVerticalSectionTwo from "@/components/sections/three-column-vertical-section-two"
import HorizontalGridSection from "@/components/sections/horizontal-grid-section"
import VerticalGridSection from '@/components/sections/vertical-grid-section';

export default function Home() {
  return (
    <>
      <BannerAds />

      <FeaturedSection />

      <ThreeColumnAds />

      <GridSection />

      <ThreeColumnAds />

      <ThreeColumnVerticalSection />

      <ThreeColumnAds />

      <ThreeColumnVerticalSectionTwo />

      <ThreeColumnAds />

      <HorizontalGridSection />

      <ThreeColumnAds />

      <VerticalGridSection />

      <Gallery />
    </>
  )
}
