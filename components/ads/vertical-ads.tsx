import Image from "next/image";

export default function VerticalAds() {
  return (
    <section className="bg-card py-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-center">
          <Image height={320} width={100} src="/vertical-ads.jpg" alt="Advertisement Banner" className="w-full max-h-[600] object-contain" />
        </div>
      </div>
    </section>
  )
}
