'use client';

import { useState } from 'react';
import CryptoList from '@/components/CryptoList';
import SearchBar from '@/components/SearchBar';
import { Card } from '@/components/ui/card';

interface Crypto {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
}

export default function MarketsPage() {
  const [filteredData, setFilteredData] = useState<Crypto[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<{ id: string; name: string }>({ 
    id: 'bitcoin', 
    name: 'Bitcoin' 
  });

  const handleCoinSelect = (coinId: string, coinName: string) => {
    setSelectedCoin({ id: coinId, name: coinName });
  };

  return (
    <section className="w-full py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Cryptocurrency Markets</h1>
          <p className="text-muted-foreground mt-2">
            Track real-time cryptocurrency prices, market cap, and trading volume
          </p>
        </div>

        <div className="mb-8">
          <SearchBar 
            onSearchResults={setFilteredData}
            onSearchingStateChange={setIsSearching}
          />
        </div>

        <div className="space-y-8">
          {/* Market Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Global Market Cap</div>
              <div className="text-2xl font-bold">$2.1T</div>
              <div className="text-sm text-green-500">+2.4%</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">24h Volume</div>
              <div className="text-2xl font-bold">$84.5B</div>
              <div className="text-sm text-red-500">-1.2%</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">BTC Dominance</div>
              <div className="text-2xl font-bold">42.3%</div>
              <div className="text-sm text-green-500">+0.8%</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Active Coins</div>
              <div className="text-2xl font-bold">2,547</div>
              <div className="text-sm text-muted-foreground">Total Listed</div>
            </Card>
          </div>

          {/* Main Crypto List */}
          <Card className="p-6">
            <CryptoList 
              filteredData={filteredData}
              onCoinSelect={handleCoinSelect}
              isSearching={isSearching}
            />
          </Card>

          {/* Market Information */}
          <div className="text-sm text-muted-foreground">
            <p>
              Data is updated every 5 minutes. Last updated: {new Date().toLocaleTimeString()}
            </p>
            <p className="mt-2">
              * Market cap is calculated by multiplying the total supply of coins by current price.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}