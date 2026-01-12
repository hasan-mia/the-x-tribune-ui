export default function ThreeColumnAds() {
  return (
    <section className="bg-background py-4 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-center bg-card border border-border min-h-24">
            <img src="/ad-banner-1.jpg" alt="Ad 1" className="w-full h-full object-contain p-2" />
          </div>
          <div className="flex items-center justify-center bg-card border border-border min-h-24">
            <img src="/ad-banner-2.jpg" alt="Ad 2" className="w-full h-full object-contain p-2" />
          </div>
          <div className="flex items-center justify-center bg-card border border-border min-h-24">
            <img src="/ad-banner-3.jpg" alt="Ad 3" className="w-full h-full object-contain p-2" />
          </div>
        </div>
      </div>
    </section>
  )
}
