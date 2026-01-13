import Image from "next/image";

export default function VerticalAds({ height = 96 }: { height?: number }) {
  return (
    <section className="bg-card py-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-center">
          <Image height={height} width={100} src="/vertical-ads.jpg" alt="Advertisement Banner" className={`w-full h-${height} object-contain`} />
        </div>
      </div>
    </section>
  )
}
