"use client";

import Image from "next/image";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Header() {
  const currentDate = new Date().toLocaleDateString("bn-BD", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="container mx-auto py-4 lg:py-0 px-4">
      {/* Top Row */}
      <div className="flex flex-row items-center">
        <div className="max-w-3/12">{currentDate}</div>

        <div className="max-w-6/12 mx-auto px-4 flex justify-center">
          <Image
            src="/logo.png"
            alt="World Tribune"
            width={320}
            height={40}
            priority
          />
        </div>

        <div className="max-w-3/12">
          <div className="flex items-center gap-4">
            <Facebook className="w-6 h-6 cursor-pointer hover:text-blue-600" />
            <Twitter className="w-6 h-6 cursor-pointer hover:text-sky-500" />
            <Instagram className="w-6 h-6 cursor-pointer hover:text-pink-500" />
            <Youtube className="w-6 h-6 cursor-pointer hover:text-red-600" />
          </div>
        </div>

      </div>

    </header>
  );
}
