'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Hero() {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="relative w-full h-[60vh]">  {/* Changed from h-[90vh] to h-[60vh] */}
      <div className="absolute inset-0 w-full h-full">
        {imgError ? (
          <div className="w-full h-full bg-gradient-to-b from-gray-900 to-gray-700" />
        ) : (
          <Image
            src="/Images/hero.png"
            alt="Hero background"
            width={1920}
            height={400}
            priority
            unoptimized
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative h-full flex flex-col items-center justify-center">
        <div className="container px-4 mx-auto text-center space-y-8">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-white">
            Welcome to <span className="text-blue-500">Coin Tide</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-200 text-lg sm:text-xl">
            Coin Tide is a web-based application that helps users monitor live cryptocurrency prices and trends. Whether you're a casual crypto fan or an active investor, cointide offers a sleek and simple way to stay informed.
          </p>
        </div>
      </div>
    </section>
  );
}
