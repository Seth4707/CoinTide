'use client';

import Image from 'next/image'; // Add this import

function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[70vh]">
      {/* Background Image - Using Next/Image for optimization */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero.png"
          alt="Hero background"
          fill
          priority
          className="object-cover opacity-40"
          quality={100}
        />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-background" />
      
      {/* Content */}
      <div className="container relative px-4 mx-auto text-center space-y-8 z-10">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-blue-600">
          Welcome to <span className="text-blue-600">Coin Tide</span>
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground text-lg sm:text-xl text-white">
          Coin Tide is a web-based application that helps users monitor live cryptocurrency prices and trends. Whether you're a casual crypto fan or an active investor, cointide offers a sleek and simple way to stay informed. The goal is to combine data, design, and functionality to bring users closer to the ever-changing crypto market.
        </p>
      </div>
    </section>
  );
}

export default Hero;
