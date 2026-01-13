import Image from "next/image";

export default function BannerAds() {
  return (
    <section className="bg-card py-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-center">
          <Image height={120} width={300} src="/big-banner-ads.gif" alt="Advertisement Banner" className="w-full max-h-32 object-contain" />
        </div>
      </div>
    </section>
  )
}
