import BannerAds from "./banner-ads";

export default function ThreeColumnAds() {
  return (
    <section className="bg-card py-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {[0, 1, 2].map(item => <BannerAds key={item} />)}
        </div>
      </div>
    </section>
  )
}
