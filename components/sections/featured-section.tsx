import NewsTabs from "../tabs/news-tabs"
import FeatureGrid from "./feature-grid"

export default function FeaturedSection() {
  return (
    <section className="bg-card">
      <div className="container mx-auto p-4 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Featured Articles */}
          <div className="md:col-span-2 space-y-4">
            {/* Large Featured Card */}
            <FeatureGrid />

          </div>
          {/* Right Sidebar - Tabs */}
          <div className="md:col-span-1">
            <NewsTabs />
          </div>
        </div>
      </div>
    </section>
  )
}
