'use client';

import React from 'react';
// Core imports
import { useState } from 'react';

// Component imports
import Chart from '@/components/Chart';
import CoinDetails from '@/components/CoinDetails';
import CryptoList from '@/components/CryptoList';
import EducationSection from '@/components/EducationSection';
import Hero from '@/components/Hero';
import NewsSection from '@/components/NewsSection';
import PortfolioSummary from '@/components/PortfolioSummary';
import SearchBar from '@/components/SearchBar';

// Types
interface CoinData {
  id: string;
  name: string;
}

export default function HomePage() {
  // State management
  const [filteredData, setFilteredData] = useState<any[]>([]); // Consider creating a type for your crypto data
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedCoin, setSelectedCoin] = useState<CoinData>({ 
    id: 'bitcoin', 
    name: 'Bitcoin' 
  });

  // Event handlers
  const handleCoinSelect = (coin: CoinData) => {
    setSelectedCoin(coin);
  };

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Main Content Section */}
      <section className="container mx-auto px-4 py-8">
        <SearchBar 
          onSearchResults={setFilteredData}
          onSearchingStateChange={setIsSearching}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Crypto List Column */}
          <div>
            <CryptoList 
              filteredData={filteredData}
              onCoinSelect={(coinId, coinName) => handleCoinSelect({ id: coinId, name: coinName })}
              isSearching={isSearching}
            />
          </div>

          {/* Chart and Details Column */}
          <div>
            <Chart 
              coinId={selectedCoin.id}
              coinName={selectedCoin.name}
            />
            <CoinDetails 
              coinId={selectedCoin.id}
            />
          </div>
        </div>
      </section>

      {/* Portfolio Summary Section */}
      <PortfolioSummary />
      
      {/* Marketing Banner Section */}
      <section className="w-full h-[300px] relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("/images/market.png")'
          }}
        />
      </section>

      {/* Educational Content */}
      <EducationSection />

      {/* News Feed */}
      <NewsSection />
      
      {/* Pre-Footer CTA Section */}
      <section className="w-full py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-600">
                Did you know?
              </h2>
              <p className="text-lg text-muted-foreground">
                Over $1 trillion flows through the crypto market every day.
                Bitcoin was once traded for pizzas, and now it's reshaping how nations handle money.
                Crypto isn't just about coins, it's about freedom, technology, and the future of finance.
                The question isn't if it will change the world, but how fast.
                Stay curious. Stay informed. The crypto tide never sleeps.
              </p>
            </div>
            <div className="relative h-[400px]">
              <img
                src="/images/bullish.png"
                alt="Crypto Analysis"
                className="object-cover w-full h-full rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}







