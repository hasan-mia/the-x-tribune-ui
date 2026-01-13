import BannerAds from "@/components/ads/banner-ads"
import FeaturedSection from "@/components/sections/featured-section"
import ThreeColumnAds from "@/components/ads/three-column-ads"
import SidebarAds from "@/components/sidebar-ads/sidebar-ads"
import Gallery from "@/components/gallery/gallery"
import NewsCard from "@/components/news-card/news-card"
import GridSection from "@/components/sections/grid-section"
import ThreeColumnVerticalSection from "@/components/sections/three-column-vertical-section"
import ThreeColumnVerticalSectionTwo from "@/components/sections/three-column-vertical-section-two"
import HorizontalGridSection from "@/components/sections/horizontal-grid-section"
import VerticalGridSection from '../../components/sections/vertical-grid-section';

export default function Home() {
  return (
    <>
      <BannerAds />

      {/* Featured Section with Tabs */}
      <FeaturedSection />

      {/* Three Column Ads */}
      <ThreeColumnAds />

      {/* জাতীয় with 3-column grid */}
      <GridSection />

      <ThreeColumnAds />

      <ThreeColumnVerticalSection />

      <ThreeColumnAds />

      <ThreeColumnVerticalSectionTwo />

      <ThreeColumnAds />

      <HorizontalGridSection />

      <ThreeColumnAds />

      <VerticalGridSection />

      {/* Second Category Section - বিনোদন */}
      <section className="bg-background py-6 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground border-b-2 border-primary pb-3 inline-block">বিনোদন</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <NewsCard
                key={i}
                image={`/placeholder.svg?height=200&width=400&query=entertainment news ${i + 1}`}
                title={`বিনোদন - আকর্ষণীয় খবর ${i + 1}`}
                href="#"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Three Column Ads */}
      <ThreeColumnAds />

      {/* Third Category with Sidebar - খেলাধুলা */}
      <section className="bg-background py-6 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground border-b-2 border-primary pb-3 inline-block">
                  খেলাধুলা
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <NewsCard
                    key={i}
                    image={`/placeholder.svg?height=200&width=400&query=sports news ${i + 1}`}
                    title={`খেলাধুলা - ক্রীড়া সংবাদ ${i + 1}`}
                    href="#"
                  />
                ))}
              </div>
            </div>
            <div className="md:col-span-1">
              <SidebarAds />
            </div>
          </div>
        </div>
      </section>

      {/* Three Column Ads */}
      <ThreeColumnAds />

      {/* Fourth Category - অর্থনীতি */}
      <section className="bg-background py-6 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground border-b-2 border-primary pb-3 inline-block">অর্থনীতি</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <NewsCard
                key={i}
                image={`/placeholder.svg?height=200&width=400&query=economy news ${i + 1}`}
                title={`অর্থনীতি - ব্যবসায়িক সংবাদ ${i + 1}`}
                href="#"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Three Column Ads */}
      <ThreeColumnAds />

      {/* Fifth Category with Sidebar - রাজনীতি */}
      <section className="bg-background py-6 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground border-b-2 border-primary pb-3 inline-block">
                  রাজনীতি
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <NewsCard
                    key={i}
                    image={`/placeholder.svg?height=200&width=400&query=politics news ${i + 1}`}
                    title={`রাজনীতি - রাজনৈতিক সংবাদ ${i + 1}`}
                    href="#"
                  />
                ))}
              </div>
            </div>
            <div className="md:col-span-1">
              <SidebarAds />
            </div>
          </div>
        </div>
      </section>

      {/* Three Column Ads */}
      <ThreeColumnAds />

      {/* Sixth Category - প্রযুক্তি */}
      <section className="bg-background py-6 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground border-b-2 border-primary pb-3 inline-block">প্রযুক্তি</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <NewsCard
                key={i}
                image={`/placeholder.svg?height=200&width=400&query=technology news ${i + 1}`}
                title={`প্রযুক্তি - প্রযুক্তি সংবাদ ${i + 1}`}
                href="#"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Three Column Ads */}
      <ThreeColumnAds />

      {/* Gallery Section */}
      <Gallery />

      {/* Three Column Ads */}
      <ThreeColumnAds />
    </>
  )
}
