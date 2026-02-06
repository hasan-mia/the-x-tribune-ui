"use client";

import React from "react";
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
    <header className="container mx-auto bg-card border-b border-border px-4 my-2">
      {/* Top Row */}
      <div className="flex flex-row justify-between items-center">
        <div className="w-4/12 head-date">{currentDate}</div>

        <div className="w-4/12">
          <Image
            src="/logo.png"
            alt="World Tribune"
            width={320}
            height={100}
            priority
          />
        </div>

        <div className="w-4/12">
          <div className="header-social">
            <ul className="social-top">
              <li><Facebook className="w-6 h-6 cursor-pointer hover:text-blue-600" /></li>
              <li><Twitter className="w-6 h-6 cursor-pointer hover:text-sky-500" /></li>
              <li><Instagram className="w-6 h-6 cursor-pointer hover:text-pink-500" /></li>
              <li><Youtube className="w-6 h-6 cursor-pointer hover:text-red-600" /></li>
            </ul>
          </div>
        </div>

      </div>

    </header>
  );
}
