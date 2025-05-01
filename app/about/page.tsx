'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">About Coin Tide</h1>
        <div className="max-w-6xl mx-auto space-y-6">
          <p className="text-xl text-muted-foreground text-center font-bold">
            Welcome to Coin Tide — Ride the Waves of Crypto Price Fluctuations
          </p>
          <p className="text-lg text-muted-foreground text-justify">
            Coin Tide is a sleek, data-driven, and fully responsive frontend-only web application 
            built to simplify the process of tracking, analyzing, and managing cryptocurrency data 
            in real-time. It empowers users with reliable insights, beautiful chart visualizations, 
            and intuitive features — all designed with usability and performance in mind.
          </p>
          <p className="text-lg text-muted-foreground text-justify">
            This project was conceptualized and developed by Adeleye Oluwadamilare Seth as the final 
            project for completion of the Front-End Web Development program at Softlyft Digital Centre. 
            Built with modern web technologies including React, Next.js, and TailwindCSS, Coin Tide 
            represents the culmination of extensive learning and practical application of frontend 
            development principles.
          </p>
          <p className="text-lg text-muted-foreground text-justify">
            Our platform offers comprehensive cryptocurrency tracking capabilities, real-time price 
            updates, detailed market analytics, and an intuitive interface for monitoring your favorite 
            digital assets. Whether you're a seasoned crypto investor or just getting started, 
            Coin Tide provides the tools and insights you need to navigate the dynamic world of 
            cryptocurrency.
          </p>
        </div>
      </div>

      {/* Features Section with Image */}
      <div className="mb-16">
        <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl hidden sm:block">
          <Image
            src="/Images/crypto 1.png"
            alt="Crypto Trading Dashboard"
            fill={true}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      </div>

      {/* Founder Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-semibold mb-12 text-center">Meet the Founder</h2>
        <div className="flex flex-col md:flex-row items-center max-w-7xl mx-auto justify-center">
          <div className="w-64 h-64 relative rounded-full overflow-hidden shadow-xl mb-8 md:mb-0 md:mr-[70px] mx-auto md:mx-0">
            <Image
              src="/Images/Seth.jpg"
              alt="Adeleye Oluwadamilare Seth"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="text-center md:text-left md:max-w-2xl">
            <h3 className="text-2xl font-semibold">Adeleye Oluwadamilare Seth</h3>
            <p className="text-lg text-primary font-medium">Front End Developer</p>
            <p className="text-muted-foreground">
              As the founder and developer of Coin Tide, I am passionate about creating intuitive and powerful tools 
              for cryptocurrency enthusiasts. This project represents the culmination of my journey at 
              Softlyft Digital Centre's Front-End Web Development program, where I combined my technical skills 
              in React, Next.js, and TailwindCSS with my vision for accessible crypto market data.
              My goal is to provide users with a seamless experience in tracking and analyzing cryptocurrency markets,
              making complex data easily digestible for both beginners and experienced traders alike.
            </p>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="text-center bg-card p-12 rounded-lg">
        <h2 className="text-3xl font-semibold mb-4">Get in Touch</h2>
        <p className="text-muted-foreground mb-6">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
        <Link href="/contact">
          <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
            Contact Us
          </button>
        </Link>
      </div>
    </div>
  );
}










