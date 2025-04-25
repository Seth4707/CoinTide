'use client';

import { useState, useEffect } from 'react';
import { fetchCryptoData } from '../utils/api';

interface CoinDetailsProps {
  coinId: string;
}

interface CoinDetails {
  name: string;
  symbol: string;
  image: {
    large: string;
  };
  market_data: {
    current_price: { usd: number };
    high_24h: { usd: number };
    low_24h: { usd: number };
    price_change_percentage_24h: number;
    market_cap: { usd: number };
    total_volume: { usd: number };
    circulating_supply: number;
    max_supply: number | null;
  };
  description: { en: string };
}

function CoinDetails({ coinId }: CoinDetailsProps) {
  const [coinDetails, setCoinDetails] = useState<CoinDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchCryptoData(`/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`);
        setCoinDetails(data);
      } catch (err) {
        setError('Failed to fetch coin details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [coinId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading details...</p>
        </div>
      </div>
    );
  }

  if (error || !coinDetails) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center p-4 text-red-500">
          {error || 'No coin details available'}
        </div>
      </div>
    );
  }

  const priceChangeColor = coinDetails.market_data.price_change_percentage_24h >= 0 
    ? 'text-green-500' 
    : 'text-red-500';

  return (
    <div className="bg-background rounded-lg border p-6 shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <img 
          src={coinDetails.image.large} 
          alt={coinDetails.name} 
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h2 className="text-2xl font-bold">{coinDetails.name}</h2>
          <p className="text-muted-foreground">{coinDetails.symbol.toUpperCase()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Price Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Price</span>
              <span className="font-medium">${coinDetails.market_data.current_price.usd.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">24h High</span>
              <span className="font-medium">${coinDetails.market_data.high_24h.usd.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">24h Low</span>
              <span className="font-medium">${coinDetails.market_data.low_24h.usd.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">24h Change</span>
              <span className={`font-medium ${priceChangeColor}`}>
                {coinDetails.market_data.price_change_percentage_24h.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Market Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Market Cap</span>
              <span className="font-medium">${coinDetails.market_data.market_cap.usd.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">24h Volume</span>
              <span className="font-medium">${coinDetails.market_data.total_volume.usd.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Circulating Supply</span>
              <span className="font-medium">{coinDetails.market_data.circulating_supply.toLocaleString()}</span>
            </div>
            {coinDetails.market_data.max_supply && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Supply</span>
                <span className="font-medium">{coinDetails.market_data.max_supply.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {coinDetails.description.en && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">About</h3>
          <p className="text-sm text-muted-foreground line-clamp-4">
            {coinDetails.description.en.replace(/<\/?[^>]+(>|$)/g, '')}
          </p>
        </div>
      )}
    </div>
  );
}

export default CoinDetails;