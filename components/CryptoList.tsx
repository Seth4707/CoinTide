'use client';

import { useState, useEffect } from 'react';
import { fetchCryptoData } from '../utils/api';
import { mockCryptoList } from '../utils/mockData';

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

interface CryptoListProps {
  filteredData: Crypto[];
  onCoinSelect: (coinId: string, coinName: string) => void;
  isSearching?: boolean;
}

function CryptoList({ filteredData = [], onCoinSelect, isSearching = false }: CryptoListProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [cryptoData, setCryptoData] = useState<Crypto[]>([]);
  const dataToDisplay = filteredData.length > 0 ? filteredData : cryptoData;

  useEffect(() => {
    const fetchData = async () => {
      if (filteredData.length > 0) return;

      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchCryptoData(
          '/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
        );
        
        if (!Array.isArray(data) || data.length === 0) {
          console.log('API returned empty data, using mock data');
          setCryptoData(mockCryptoList);
        } else {
          setCryptoData(data);
        }
      } catch (err: any) {
        console.log('All APIs failed, using mock data');
        // Use mock data when all APIs fail
        setCryptoData(mockCryptoList);
        
        if (err.message.includes('Rate limit') && retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 5000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filteredData.length, retryCount]);

  if (loading || isSearching) {
    return (
      <div className="text-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2">Loading cryptocurrencies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <div className="text-red-500 mb-2">Error: {error}</div>
        {error.includes('Rate limit') && (
          <button 
            onClick={() => setRetryCount(prev => prev + 1)}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (dataToDisplay.length === 0) {
    return <div className="text-center p-4">No cryptocurrencies found</div>;
  }

  return (
    <div className="w-full">
      {/* Desktop Table (hidden on small screens) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full table-fixed divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th className="w-[35%] px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Name
              </th>
              <th className="w-[20%] px-3 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Price
              </th>
              <th className="hidden md:table-cell w-[30%] px-3 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Market Cap
              </th>
              <th className="w-[15%] px-3 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                24h
              </th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border">
            {dataToDisplay.map((crypto) => (
              <tr 
                key={crypto.id} 
                onClick={() => onCoinSelect(crypto.id, crypto.name)}
                className="cursor-pointer hover:bg-muted/50"
              >
                <td className="w-[35%] px-3 py-4">
                  <div className="flex items-center min-w-0">
                    <div className="flex-shrink-0 h-8 w-8">
                      <img className="h-8 w-8 rounded-full" src={crypto.image} alt={crypto.name} />
                    </div>
                    <div className="ml-3 min-w-0 flex-1">
                      <div className="text-sm font-medium text-foreground truncate">{crypto.name}</div>
                      <div className="text-xs text-muted-foreground">{crypto.symbol.toUpperCase()}</div>
                    </div>
                  </div>
                </td>
                <td className="w-[20%] px-3 py-4">
                  <div className="text-sm text-foreground text-right">
                    ${(crypto.current_price || 0).toFixed(2)}
                  </div>
                </td>
                <td className="hidden md:table-cell w-[30%] px-3 py-4">
                  <div className="text-sm text-foreground text-right">
                    ${crypto.market_cap.toLocaleString()}
                  </div>
                </td>
                <td className="w-[15%] px-3 py-4">
                  <div className={`text-sm text-right ${crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (shown only on small screens) */}
      <div className="sm:hidden">
        <div className="space-y-3">
          {dataToDisplay.map((crypto) => (
            <div 
              key={crypto.id}
              onClick={() => onCoinSelect(crypto.id, crypto.name)}
              className="bg-background p-4 rounded-lg border border-border cursor-pointer hover:bg-muted/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img className="h-8 w-8 rounded-full" src={crypto.image} alt={crypto.name} />
                  <div className="ml-3">
                    <div className="text-sm font-medium">{crypto.name}</div>
                    <div className="text-xs text-muted-foreground">{crypto.symbol.toUpperCase()}</div>
                  </div>
                </div>
                <div className={`text-sm font-medium ${crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {crypto.price_change_percentage_24h.toFixed(2)}%
                </div>
              </div>
              <div className="mt-2 flex justify-between">
                <div className="text-sm text-muted-foreground">Price</div>
                <div className="text-sm font-medium">${crypto.current_price.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CryptoList;
